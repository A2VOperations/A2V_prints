"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoryTemplateMap } from "../lib/templatesData";

const parseMmAspectRatio = (sizeStr) => {
  if (!sizeStr) return "1.75 / 1";
  const matches = sizeStr.match(/(\d+(?:\.\d+)?)\s*(?:mm)?\s*(?:[xX×*])\s*(\d+(?:\.\d+)?)\s*(?:mm)?/i);
  if (matches && matches[1] && matches[2]) {
    const w = parseFloat(matches[1]);
    const h = parseFloat(matches[2]);
    if (w > 0 && h > 0) {
      return `${w} / ${h}`;
    }
  }
  return "1.75 / 1";
};

const parseMmDimensions = (str, defaultX = 2, defaultY = 2) => {
  if (!str) return { x: defaultX, y: defaultY };
  const matches = String(str).match(/(\d+(?:\.\d+)?)\s*(?:mm)?\s*(?:[xX×*,\s])*\s*(\d+(?:\.\d+)?)\s*(?:mm)?/i);
  if (matches && matches[1]) {
    const x = parseFloat(matches[1]);
    const y = matches[2] ? parseFloat(matches[2]) : x;
    return { x: isNaN(x) ? defaultX : x, y: isNaN(y) ? defaultY : y };
  }
  const singleNum = parseFloat(str);
  if (!isNaN(singleNum)) return { x: singleNum, y: singleNum };
  return { x: defaultX, y: defaultY };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState({
    name: "Admin Manager",
    email: "admin@a2vprints.com",
    role: "admin"
  });
  const [toast, setToast] = useState(null);

  // Dynamic DB Data states
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("All");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Product Form State (for Add / Edit)
  const [editingProductId, setEditingProductId] = useState(null);
  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    categorySlug: "visiting-cards",
    price: "",
    stock: "500",
    status: "Published",
    description: "",
    image: "",
    images: [],
    badge: "Bestseller",
    customOptions: [],
    quantityTiers: [],
    qualityOptions: [],
    styleOptions: [],
    specifications: []
  });

  // Templates Form & List State
  const [templates, setTemplates] = useState([]);
  const [templateFilter, setTemplateFilter] = useState("All");
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    title: "",
    categorySlug: "visiting-cards",
    price: "₹200.00",
    unitPrice: "₹2.00 each / 100 units",
    frontImage: "",
    backImage: "",
    badge: "New",
    status: "Published",
    orientation: "Horizontal",
    industry: "Corporate & Executive",
    style: "Bold & Modern",
    fullDesignSize: "93.00 mm x 56.00 mm",
    finalCardSize: "90.00 mm x 53.00 mm",
    safeAreaSize: "82.00 mm x 45.00 mm",
    size: "90.00 mm x 53.00 mm",
    bleedArea: 1.5,
    safeArea: 5.5,
    bleedSize: "1.5mm x 1.5mm",
    safeSize: "5.5mm x 5.5mm",
    bleedMarginX: 1.5,
    bleedMarginY: 1.5,
    safeMarginX: 5.5,
    safeMarginY: 5.5
  });

  // Graphics Library State (Cloudinary / DB)
  const [graphicsList, setGraphicsList] = useState([]);
  const [graphicsFilter, setGraphicsFilter] = useState("All");
  const [editingGraphicId, setEditingGraphicId] = useState(null);
  const [graphicUploading, setGraphicUploading] = useState(false);
  const [templateFrontUploading, setTemplateFrontUploading] = useState(false);
  const [templateBackUploading, setTemplateBackUploading] = useState(false);
  const [productPhotoUploading, setProductPhotoUploading] = useState(false);
  const [graphicsForm, setGraphicsForm] = useState({
    title: "",
    category: "image",
    url: "",
    svgContent: "",
    isActive: true
  });

  // Settings State (dynamic persistence)
  const [storeConfig, setStoreConfig] = useState({
    storeName: "A2V Prints Studio",
    tagline: "Precision Custom Printing & Brand Identity Suite",
    supportEmail: "support@a2vprints.com",
    supportPhone: "+91 98765 43210",
    currency: "INR (₹)",
    defaultDPI: 300,
    bleedThreshold: "3mm"
  });

  // Selected order for modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load dynamic data from Backend APIs
  const fetchAllData = async () => {
    try {
      // 1. Check Auth
      const authRes = await fetch("/api/auth/me", { credentials: "include" });
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.user) {
          setCurrentUser(authData.user);
        }
      }

      // 2. Fetch live Products from MongoDB
      const prodRes = await fetch("/api/products?limit=500");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const list = prodData.data || (Array.isArray(prodData) ? prodData : []);
        setProducts(list);
      }

      // Fetch live Templates from MongoDB
      const tplRes = await fetch("/api/templates?limit=500");
      if (tplRes.ok) {
        const tplData = await tplRes.json();
        const tplList = tplData.data || (Array.isArray(tplData) ? tplData : []);
        setTemplates(tplList);
      }

      // Fetch live Graphic Assets from MongoDB
      const graphicsRes = await fetch("/api/graphics?all=true");
      if (graphicsRes.ok) {
        const gData = await graphicsRes.json();
        if (gData.success) setGraphicsList(gData.data || []);
      }

      // 3. Fetch live Users from MongoDB
      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const uList = Array.isArray(usersData) ? usersData : usersData.data || [];
        setUsers(uList);
      }

      // 4. Load dynamic store settings from localStorage if saved
      const savedSettings = localStorage.getItem("a2v_admin_store_config");
      if (savedSettings) {
        try {
          setStoreConfig(JSON.parse(savedSettings));
        } catch (e) {}
      }

      // 5. Fetch live Orders from MongoDB
      const ordersRes = await fetch("/api/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const oList = ordersData.data || [];
        setOrders(oList);
      }
    } catch (err) {
      console.error("Failed loading dynamic admin data:", err);
    } 
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const showToastMsg = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setNewPhotoInput("");
    setProductForm({
      name: "",
      categorySlug: "visiting-cards",
      price: "",
      stock: "500",
      status: "Published",
      description: "",
      image: "",
      images: [],
      badge: "New",
      customOptions: [],
      quantityTiers: [],
      qualityOptions: [],
      styleOptions: [],
      specifications: []
    });
    setActiveTab("product-detail");
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id || prod.id);
    setNewPhotoInput("");
    const existingImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : prod.image
      ? [prod.image]
      : [];
    setProductForm({
      name: prod.name || "",
      categorySlug: prod.categorySlug || "visiting-cards",
      price: prod.numericPrice ? String(prod.numericPrice) : prod.price ? String(prod.price).replace(/[^0-9.]/g, "") : "",
      stock: prod.stock ? String(prod.stock) : "500",
      status: prod.isActive !== false ? "Published" : "Draft",
      description: prod.description || prod.desc || "",
      image: prod.image || existingImages[0] || "",
      images: existingImages,
      badge: prod.badge || "Featured",
      customOptions: Array.isArray(prod.customOptions) ? prod.customOptions : [],
      quantityTiers: Array.isArray(prod.quantityTiers) ? prod.quantityTiers : [],
      qualityOptions: Array.isArray(prod.qualityOptions) ? prod.qualityOptions : [],
      styleOptions: Array.isArray(prod.styleOptions) ? prod.styleOptions : [],
      specifications: Array.isArray(prod.specifications) ? prod.specifications : []
    });
    setActiveTab("product-detail");
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToastMsg("Please enter Product Name and Price");
      return;
    }

    try {
      const numPrice = Number(productForm.price) || 0;
      const allImages = (productForm.images || []).filter(Boolean);
      const coverImage = productForm.image || allImages[0] || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&q=80";
      const payload = {
        name: productForm.name,
        title: productForm.name,
        categorySlug: productForm.categorySlug,
        categoryName: productForm.categorySlug.replace("-", " "),
        price: `₹${numPrice}`,
        numericPrice: numPrice,
        description: productForm.description,
        desc: productForm.description,
        image: coverImage,
        images: allImages.length > 0 ? allImages : [coverImage],
        isActive: productForm.status === "Published",
        badge: productForm.badge,
        customOptions: productForm.customOptions || [],
        quantityTiers: productForm.quantityTiers || [],
        qualityOptions: productForm.qualityOptions || [],
        styleOptions: productForm.styleOptions || [],
        specifications: productForm.specifications || []
      };

      if (editingProductId) {
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("Product updated successfully in DB!");
        } else {
          showToastMsg("Failed updating product");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("New product created successfully in DB!");
        } else {
          const errData = await res.json();
          showToastMsg(errData.error || "Created product");
        }
      }

      await fetchAllData();
      setActiveTab("products");
    } catch (err) {
      console.error(err);
      showToastMsg("Saved product");
      setActiveTab("products");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm("Are you sure you want to permanently delete this product from the database?")) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== prodId && p.id !== prodId));
        showToastMsg("Product deleted from DB");
      } else {
        showToastMsg("Failed deleting product");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Template Handlers
  const handleOpenAddTemplate = () => {
    setEditingTemplateId(null);
    const defaultCat = categoryTemplateMap["visiting-cards"] || {};
    setTemplateForm({
      title: "",
      categorySlug: "visiting-cards",
      price: defaultCat.basePrice || "₹200.00",
      unitPrice: defaultCat.unitPriceText || "₹2.00 each / 100 units",
      size: "85mm x 55mm",
      frontImage: "",
      backImage: "",
      badge: "New",
      status: "Published",
      orientation: "Horizontal",
      industry: "Corporate & Executive",
      style: "Bold & Modern",
      fullDesignSize: "93.00 mm x 56.00 mm",
      finalCardSize: "90.00 mm x 53.00 mm",
      safeAreaSize: "82.00 mm x 45.00 mm",
      size: "90.00 mm x 53.00 mm",
      bleedArea: 1.5,
      safeArea: 5.5,
      bleedSize: "1.5mm x 1.5mm",
      safeSize: "5.5mm x 5.5mm",
      bleedMarginX: 1.5,
      bleedMarginY: 1.5,
      safeMarginX: 5.5,
      safeMarginY: 5.5
    });
    setActiveTab("template-detail");
  };

  const handleEditTemplate = (tpl) => {
    setEditingTemplateId(tpl.id || tpl._id);
    const cat = categoryTemplateMap[tpl.categorySlug] || {};
    const bx = tpl.bleedMarginX ?? tpl.bleedArea ?? 1.5;
    const by = tpl.bleedMarginY ?? tpl.bleedArea ?? 1.5;
    const sx = tpl.safeMarginX ?? tpl.safeArea ?? 5.5;
    const sy = tpl.safeMarginY ?? tpl.safeArea ?? 5.5;

    setTemplateForm({
      title: tpl.title || "",
      categorySlug: tpl.categorySlug || "visiting-cards",
      price: tpl.price || cat.basePrice || "₹200.00",
      unitPrice: tpl.unitPrice || cat.unitPriceText || "₹2.00 each / 100 units",
      size: tpl.finalCardSize || tpl.size || "90.00 mm x 53.00 mm",
      fullDesignSize: tpl.fullDesignSize || "93.00 mm x 56.00 mm",
      finalCardSize: tpl.finalCardSize || tpl.size || "90.00 mm x 53.00 mm",
      safeAreaSize: tpl.safeAreaSize || "82.00 mm x 45.00 mm",
      frontImage: tpl.frontImage || tpl.image || "",
      backImage: tpl.backImage || tpl.frontImage || tpl.image || "",
      badge: tpl.badge || "New",
      status: tpl.isActive !== false ? "Published" : "Draft",
      orientation: tpl.orientation || "Horizontal",
      industry: tpl.industry || "Corporate & Executive",
      style: tpl.style || "Bold & Modern",
      bleedArea: bx,
      safeArea: sx,
      bleedSize: tpl.bleedSize || `${bx}mm x ${by}mm`,
      safeSize: tpl.safeSize || `${sx}mm x ${sy}mm`,
      bleedMarginX: bx,
      bleedMarginY: by,
      safeMarginX: sx,
      safeMarginY: sy
    });
    setActiveTab("template-detail");
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    const isVisitingCard = templateForm.categorySlug === "visiting-cards";
    if (!templateForm.title || !templateForm.frontImage || (isVisitingCard && !templateForm.backImage)) {
      showToastMsg(isVisitingCard ? "Please provide Title, Front Image, and Back Image" : "Please provide Title and Design Image");
      return;
    }

    try {
      const catData = categoryTemplateMap[templateForm.categorySlug] || {};
      const fullP = parseMmDimensions(templateForm.fullDesignSize || "93.00 mm x 56.00 mm", 93, 56);
      const finalP = parseMmDimensions(templateForm.finalCardSize || "90.00 mm x 53.00 mm", 90, 53);
      const safeP = parseMmDimensions(templateForm.safeAreaSize || "82.00 mm x 45.00 mm", 82, 45);

      const bleedX = Math.max(0, (fullP.x - finalP.x) / 2);
      const bleedY = Math.max(0, (fullP.y - finalP.y) / 2);
      const safeX = Math.max(0, (fullP.x - safeP.x) / 2);
      const safeY = Math.max(0, (fullP.y - safeP.y) / 2);

      const payload = {
        title: templateForm.title,
        categorySlug: templateForm.categorySlug,
        categoryName: catData.name || templateForm.categorySlug.replace("-", " "),
        price: templateForm.price,
        unitPrice: templateForm.unitPrice,
        fullDesignSize: templateForm.fullDesignSize || "93.00 mm x 56.00 mm",
        finalCardSize: templateForm.finalCardSize || "90.00 mm x 53.00 mm",
        safeAreaSize: templateForm.safeAreaSize || "82.00 mm x 45.00 mm",
        size: templateForm.finalCardSize || templateForm.size || "90.00 mm x 53.00 mm",
        hasBackSide: isVisitingCard,
        frontImage: templateForm.frontImage,
        backImage: isVisitingCard ? templateForm.backImage : templateForm.frontImage,
        image: templateForm.frontImage,
        badge: templateForm.badge,
        orientation: templateForm.orientation,
        industry: templateForm.industry,
        style: templateForm.style,
        bleedArea: bleedX,
        safeArea: safeX,
        bleedSize: `${bleedX}mm x ${bleedY}mm`,
        safeSize: `${safeX}mm x ${safeY}mm`,
        bleedMarginX: bleedX,
        bleedMarginY: bleedY,
        safeMarginX: safeX,
        safeMarginY: safeY,
        isActive: templateForm.status === "Published"
      };

      if (editingTemplateId) {
        const res = await fetch(`/api/templates/${editingTemplateId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("Template updated successfully in DB!");
        } else {
          showToastMsg("Failed updating template");
        }
      } else {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("New template created successfully in DB!");
        } else {
          const errData = await res.json();
          showToastMsg(errData.error || "Failed creating template");
        }
      }

      await fetchAllData();
      setActiveTab("templates");
    } catch (err) {
      console.error(err);
      showToastMsg("Error saving template");
      setActiveTab("templates");
    }
  };

  const handleDeleteTemplate = async (tplId) => {
    if (!confirm("Are you sure you want to permanently delete this template from the database?")) return;
    try {
      const res = await fetch(`/api/templates/${tplId}`, { method: "DELETE" });
      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t._id !== tplId && t.id !== tplId));
        showToastMsg("Template deleted from DB");
      } else {
        showToastMsg("Failed deleting template");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSaveGraphic = async (e) => {
    e.preventDefault();
    if (!graphicsForm.title || !graphicsForm.url) {
      showToastMsg("Please provide Title and Image URL/File");
      return;
    }
    try {
      const payload = {
        title: graphicsForm.title,
        category: graphicsForm.category,
        url: graphicsForm.url,
        svgContent: graphicsForm.svgContent || "",
        isActive: graphicsForm.isActive
      };
      if (editingGraphicId) {
        const res = await fetch(`/api/graphics/${editingGraphicId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("Graphic asset updated successfully!");
        } else {
          showToastMsg("Failed updating graphic asset");
        }
      } else {
        const res = await fetch("/api/graphics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToastMsg("New graphic asset saved to Cloudinary/DB!");
        } else {
          showToastMsg("Failed creating graphic asset");
        }
      }
      setEditingGraphicId(null);
      setGraphicsForm({ title: "", category: "image", url: "", svgContent: "", isActive: true });
      await fetchAllData();
    } catch (err) {
      console.error(err);
      showToastMsg("Error saving graphic asset");
    }
  };

  const handleDeleteGraphic = async (gId) => {
    if (!confirm("Delete this graphic asset?")) return;
    try {
      const res = await fetch(`/api/graphics/${gId}`, { method: "DELETE" });
      if (res.ok) {
        setGraphicsList((prev) => prev.filter((g) => g.id !== gId));
        showToastMsg("Graphic asset deleted");
      } else {
        showToastMsg("Failed deleting asset");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGraphicFileUpload = async (file) => {
    if (!file) return;
    setGraphicUploading(true);
    try {
      const isSvg = file.name?.endsWith(".svg") || file.type === "image/svg+xml";
      if (isSvg) {
        const text = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
        setGraphicsForm((prev) => ({ ...prev, svgContent: text }));
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "a2v_graphics");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setGraphicsForm((prev) => ({ ...prev, url: data.url }));
        showToastMsg("Uploaded to Cloudinary successfully!");
      } else {
        showToastMsg(data.error || "Upload failed. Using fallback data URL.");
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        setGraphicsForm((prev) => ({ ...prev, url: dataUrl }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToastMsg("Upload failed");
    } finally {
      setGraphicUploading(false);
    }
  };

  const handleTemplateImageUpload = async (file, side = "front") => {
    if (!file) return;
    if (side === "front") setTemplateFrontUploading(true);
    else setTemplateBackUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "a2v_templates");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (side === "front") {
          setTemplateForm((prev) => ({ ...prev, frontImage: data.url }));
        } else {
          setTemplateForm((prev) => ({ ...prev, backImage: data.url }));
        }
        showToastMsg(`Uploaded ${side === "front" ? "Front/Design" : "Back"} photo to Cloudinary!`);
      } else {
        showToastMsg(data.error || "Upload failed. Using fallback data URL.");
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        if (side === "front") {
          setTemplateForm((prev) => ({ ...prev, frontImage: dataUrl }));
        } else {
          setTemplateForm((prev) => ({ ...prev, backImage: dataUrl }));
        }
      }
    } catch (err) {
      console.error("Template photo upload error:", err);
      showToastMsg("Upload failed");
    } finally {
      if (side === "front") setTemplateFrontUploading(false);
      else setTemplateBackUploading(false);
    }
  };

  const handleProductPhotoUpload = async (file) => {
    if (!file) return;
    setProductPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "a2v_products");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProductForm((prev) => {
          const updated = [...(prev.images || []), data.url];
          return {
            ...prev,
            images: updated,
            image: prev.image || updated[0]
          };
        });
        showToastMsg("Product photo uploaded to Cloudinary!");
      } else {
        showToastMsg(data.error || "Upload failed. Using fallback data URL.");
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        setProductForm((prev) => {
          const updated = [...(prev.images || []), dataUrl];
          return {
            ...prev,
            images: updated,
            image: prev.image || updated[0]
          };
        });
      }
    } catch (err) {
      console.error("Product photo upload error:", err);
      showToastMsg("Upload failed");
    } finally {
      setProductPhotoUploading(false);
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setUsers((prev) =>
      prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
    );
    try {
      const res = await fetch(`/api/users/${targetUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToastMsg(`Role dynamically updated to ${newRole}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId || o.id === orderId || o._id === orderId
          ? { ...o, status: newStatus }
          : o
      )
    );
    showToastMsg(`Order #${orderId} status updated to ${newStatus}`);
    if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed updating order status:", err);
    }
  };

  const handleSaveStoreConfig = () => {
    localStorage.setItem("a2v_admin_store_config", JSON.stringify(storeConfig));
    showToastMsg("Store configuration dynamically saved across sessions!");
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categorySlug || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      productFilter === "All" ||
      p.categorySlug === productFilter ||
      p.categoryName === productFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const oid = o.orderId || o.id || o._id || "";
    const customerName = o.customer?.name || "";
    const itemsText = o.itemsSummary || (typeof o.items === "string" ? o.items : "");
    const matchesSearch =
      oid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemsText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || (o.status || "Processing") === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Compute live revenue from orders
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Helper to open Studio without HTTP 431 error when images are base64/long data URLs
  const openAdminStudio = (tplId, formState) => {
    const sessionData = {
      templateId: tplId,
      templateTitle: formState.title || '',
      bgImage: formState.frontImage || '',
      backBgImage: formState.backImage || formState.frontImage || '',
      size: formState.finalCardSize || formState.size || '90.00 mm x 53.00 mm',
      fullDesignSize: formState.fullDesignSize || '93.00 mm x 56.00 mm',
      finalCardSize: formState.finalCardSize || formState.size || '90.00 mm x 53.00 mm',
      safeAreaSize: formState.safeAreaSize || '82.00 mm x 45.00 mm',
      orientation: formState.orientation || 'Standard',
      category: formState.categorySlug || 'visiting-cards',
      frontBackground: formState.frontImage || '',
      backBackground: formState.backImage || formState.frontImage || '',
      bleedArea: formState.bleedArea !== undefined ? formState.bleedArea : 1.5,
      safeArea: formState.safeArea !== undefined ? formState.safeArea : 5.5,
      bleedSize: formState.bleedSize || '1.5mm x 1.5mm',
      safeSize: formState.safeSize || '5.5mm x 5.5mm',
      bleedMarginX: formState.bleedMarginX !== undefined ? formState.bleedMarginX : 1.5,
      bleedMarginY: formState.bleedMarginY !== undefined ? formState.bleedMarginY : 1.5,
      safeMarginX: formState.safeMarginX !== undefined ? formState.safeMarginX : 5.5,
      safeMarginY: formState.safeMarginY !== undefined ? formState.safeMarginY : 5.5
    };
    try {
      sessionStorage.setItem('a2v_editor_session', JSON.stringify(sessionData));
      localStorage.setItem('a2v_admin_editor_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Storage error:', e);
    }

    const paramsObj = {
      adminMode: 'true',
      templateId: tplId,
      templateTitle: formState.title || '',
      size: formState.finalCardSize || formState.size || '90.00 mm x 53.00 mm',
      fullDesignSize: formState.fullDesignSize || '93.00 mm x 56.00 mm',
      finalCardSize: formState.finalCardSize || formState.size || '90.00 mm x 53.00 mm',
      safeAreaSize: formState.safeAreaSize || '82.00 mm x 45.00 mm',
      orientation: formState.orientation || 'Standard',
      category: formState.categorySlug || 'visiting-cards',
      bleedArea: formState.bleedArea !== undefined ? formState.bleedArea : 1.5,
      safeArea: formState.safeArea !== undefined ? formState.safeArea : 5.5,
      bleedSize: formState.bleedSize || '1.5mm x 1.5mm',
      safeSize: formState.safeSize || '5.5mm x 5.5mm',
      bleedMarginX: formState.bleedMarginX !== undefined ? formState.bleedMarginX : 1.5,
      bleedMarginY: formState.bleedMarginY !== undefined ? formState.bleedMarginY : 1.5,
      safeMarginX: formState.safeMarginX !== undefined ? formState.safeMarginX : 5.5,
      safeMarginY: formState.safeMarginY !== undefined ? formState.safeMarginY : 5.5
    };

    if (formState.frontImage && formState.frontImage.length < 500 && !formState.frontImage.startsWith('data:')) {
      paramsObj.bgImage = formState.frontImage;
    }
    if (formState.backImage && formState.backImage.length < 500 && !formState.backImage.startsWith('data:')) {
      paramsObj.backBgImage = formState.backImage;
    }

    const params = new URLSearchParams(paramsObj);
    window.open(`/Editer?${params.toString()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-lg shadow-xl border border-outline-variant flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* FIXED SIDEBAR (260px) */}
      <aside className="w-sidebar-width fixed top-0 left-0 h-screen bg-surface border-r border-outline-variant flex flex-col z-30 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-outline-variant gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-on-surface">A2V Prints</h1>
            <p className="text-[10px] uppercase font-semibold text-primary tracking-wider">
              Live Admin Suite
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Main Operations
          </p>

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "overview"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "products" || activeTab === "product-detail"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>Products & Catalog</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-container text-on-primary-container">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "templates" || activeTab === "template-detail"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">style</span>
              <span>Design Templates</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-container text-on-primary-container">
              {templates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("graphics")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "graphics"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
              <span>Graphics & Assets</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-container text-on-primary-container">
              {graphicsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span>Order Management</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-container text-on-primary-container">
              {orders.length}
            </span>
          </button>

          <p className="px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider pt-5 mb-2">
            Administration
          </p>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "users"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span>User & Access Roles</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface-variant">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "settings"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Store Configuration</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-outline-variant p-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-high hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span>Return to Live Store</span>
          </Link>

          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
              } catch (e) {
                router.push("/");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error-container/40 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* TOP NAVBAR HEADER */}
      <header className="h-16 fixed top-0 right-0 left-sidebar-width z-20 bg-surface border-b border-outline-variant flex justify-between items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, or SKUs across catalog..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToastMsg("Database sync status: Live & Active")}
              className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>

          <div className="h-8 w-px bg-outline-variant" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-on-surface leading-tight">
                {currentUser?.name || "Admin User"}
              </p>
              <p className="text-[11px] text-secondary capitalize">{currentUser?.role || "Admin"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center border border-outline-variant">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="ml-sidebar-width pt-16 min-h-screen w-[calc(100%-260px)]">
        <div className="p-6 max-w-max-content-width mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">Dashboard Overview</h2>
                  <p className="text-sm text-secondary mt-1">
                    Real-time MongoDB metrics and operation summaries.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:brightness-110 active:opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Bento Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Products */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        inventory_2
                      </span>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      Live DB
                    </span>
                  </div>
                  <p className="text-secondary text-xs font-medium uppercase tracking-wider">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-on-surface mt-1">{products.length}</p>
                </div>

                {/* Active Orders */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-amber-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-amber-600 text-[24px]">
                        print
                      </span>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      Active
                    </span>
                  </div>
                  <p className="text-secondary text-xs font-medium uppercase tracking-wider">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-on-surface mt-1">{orders.length}</p>
                </div>

                {/* Registered Users */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-emerald-600 text-[24px]">
                        group
                      </span>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
                      Registered
                    </span>
                  </div>
                  <p className="text-secondary text-xs font-medium uppercase tracking-wider">
                    Total Members
                  </p>
                  <p className="text-3xl font-bold text-on-surface mt-1">{users.length}</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xs">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-purple-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-purple-600 text-[24px]">
                        account_balance_wallet
                      </span>
                    </div>
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-semibold">
                      Live
                    </span>
                  </div>
                  <p className="text-secondary text-xs font-medium uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-on-surface mt-1">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders List */}
                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <div>
                      <h3 className="font-semibold text-base text-on-surface">Recent Print Orders</h3>
                      <p className="text-xs text-secondary">Dynamic live orders tracking</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-primary text-xs font-semibold hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container text-secondary font-medium text-xs uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {orders.slice(0, 5).map((ord) => {
                          const oid = ord.orderId || ord.id || ord._id;
                          return (
                            <tr
                              key={oid}
                              onClick={() => setSelectedOrder(ord)}
                              className="hover:bg-surface-container-low cursor-pointer transition-colors"
                            >
                              <td className="py-3.5 px-4 font-semibold text-primary">{oid}</td>
                              <td className="py-3.5 px-4">
                                <p className="font-medium text-on-surface">{ord.customer?.name || "Customer"}</p>
                                <p className="text-xs text-secondary">{ord.customer?.email || ""}</p>
                              </td>
                              <td className="py-3.5 px-4 text-secondary max-w-50 truncate">
                                {(() => {
                                  let txt = ord.itemsSummary || "";
                                  if (txt.includes("undefined") || !txt) {
                                    if (Array.isArray(ord.items) && ord.items.length > 0) {
                                      const names = ord.items.map((i) => i.name || i.title).filter((n) => n && n !== "undefined");
                                      if (names.length > 0) return names.join(", ");
                                    }
                                    return "Premium Visiting Cards (Custom Print)";
                                  }
                                  return txt;
                                })()}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    ord.status === "Printing"
                                      ? "bg-amber-100 text-amber-800"
                                      : ord.status === "Delivered"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {ord.status || "Processing"}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                                ₹{Number(ord.total || 0).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Database Summary Box */}
                <div className="space-y-6">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
                    <h3 className="font-semibold text-base text-on-surface mb-3">
                      Database Connection Status
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">MongoDB Status</span>
                        <span className="font-semibold text-emerald-600">Connected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Products Count</span>
                        <span className="font-semibold text-on-surface">{products.length} items</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Registered Users</span>
                        <span className="font-semibold text-on-surface">{users.length} members</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">Product Management</h2>
                  <p className="text-sm text-secondary mt-1">
                    Live database catalog — add, update, and delete products directly from MongoDB.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg hover:brightness-110 transition-all font-medium text-sm shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Add Product</span>
                </button>
              </div>

              {/* Quick Filters Bar */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-wrap gap-3 items-center">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-2">
                  Filter Category:
                </span>
                {[
                  "All",
                  "visiting-cards",
                  "t-shirts",
                  "banner-poster",
                  "mugs-drinkware",
                  "stickers"
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      productFilter === cat
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container text-secondary font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-5">Product Details</th>
                        <th className="py-3.5 px-5">Category</th>
                        <th className="py-3.5 px-5">Price</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredProducts.map((item) => (
                        <tr
                          key={item._id || item.id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=200&q=80"
                                }
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-outline-variant shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-on-surface">{item.name}</p>
                                <p className="text-xs text-secondary font-mono">
                                  ID: {item.id || item._id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium">
                              {item.categorySlug || item.categoryName || "visiting-cards"}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-bold text-on-surface">
                            {item.price || `₹${item.numericPrice || 0}`}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.isActive !== false
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.isActive !== false ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(item)}
                                className="p-1.5 rounded hover:bg-surface-container text-primary transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item._id || item.id)}
                                className="p-1.5 rounded hover:bg-error-container/40 text-error transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-secondary">
                            No products match the selected filters. Click &quot;Add Product&quot; to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT DETAILS FORM */}
          {activeTab === "product-detail" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {editingProductId ? "Edit Product in Database" : "Create New Product in Database"}
                  </h2>
                  <p className="text-sm text-secondary mt-1">
                    Changes will directly insert or update documents in MongoDB.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab("products")}
                    className="px-5 py-2 border border-outline-variant rounded-lg font-medium text-sm text-secondary hover:bg-surface-container transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium text-sm hover:brightness-110 shadow-sm transition-all cursor-pointer"
                  >
                    Save to MongoDB
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-5">
                    <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined">description</span>
                      <span>Product Details</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        placeholder="e.g. Luxury Velvet Visiting Cards"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Category Slug *
                        </label>
                        <select
                          value={productForm.categorySlug}
                          onChange={(e) =>
                            setProductForm({ ...productForm, categorySlug: e.target.value })
                          }
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="visiting-cards">visiting-cards</option>
                          <option value="t-shirts">t-shirts</option>
                          <option value="banner-poster">banner-poster</option>
                          <option value="mugs-drinkware">mugs-drinkware</option>
                          <option value="stickers">stickers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Product Badge
                        </label>
                        <input
                          type="text"
                          value={productForm.badge}
                          onChange={(e) =>
                            setProductForm({ ...productForm, badge: e.target.value })
                          }
                          placeholder="e.g. Bestseller, New"
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Product Description
                      </label>
                      <textarea
                        rows="3"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        placeholder="Describe material, specifications, finishes..."
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Dynamic Custom Variables & Selected Details Builder */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined">tune</span>
                          <span>Custom Variables & Selected Details</span>
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          Add custom columns (e.g., Colors, Designs, Add-ons) that buyers can select before sales activity, with dynamic price increases.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(productForm.customOptions || []),
                            { name: "New Option Column", type: "dropdown", required: true, choices: [{ label: "Standard Choice", priceModifier: 0 }] }
                          ];
                          setProductForm({ ...productForm, customOptions: updated });
                        }}
                        className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Add Column</span>
                      </button>
                    </div>

                    {(productForm.customOptions && productForm.customOptions.length > 0) ? (
                      <div className="space-y-4">
                        {productForm.customOptions.map((opt, optIdx) => (
                          <div key={optIdx} className="border border-outline-variant rounded-xl p-4 bg-surface-container-low/40 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant">
                              <div className="flex items-center gap-3 flex-1 min-w-50">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider shrink-0">Column Name:</label>
                                <input
                                  type="text"
                                  value={opt.name}
                                  onChange={(e) => {
                                    const updated = [...productForm.customOptions];
                                    updated[optIdx] = { ...updated[optIdx], name: e.target.value };
                                    setProductForm({ ...productForm, customOptions: updated });
                                  }}
                                  placeholder="e.g. Color Selection, Design Variation"
                                  className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-semibold text-primary focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={opt.type || "dropdown"}
                                  onChange={(e) => {
                                    const updated = [...productForm.customOptions];
                                    updated[optIdx] = { ...updated[optIdx], type: e.target.value };
                                    setProductForm({ ...productForm, customOptions: updated });
                                  }}
                                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs font-medium text-secondary"
                                >
                                  <option value="dropdown">Dropdown Select</option>
                                  <option value="pills">Pill Buttons</option>
                                  <option value="radio">Radio Options</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = productForm.customOptions.filter((_, i) => i !== optIdx);
                                    setProductForm({ ...productForm, customOptions: updated });
                                  }}
                                  className="px-2.5 py-1.5 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* Choices List */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[11px] font-bold text-secondary uppercase tracking-wider px-1">
                                <span>Choices & Price Adjustments</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...productForm.customOptions];
                                    const choices = [...(updated[optIdx].choices || []), { label: "New Choice", priceModifier: 0 }];
                                    updated[optIdx] = { ...updated[optIdx], choices };
                                    setProductForm({ ...productForm, customOptions: updated });
                                  }}
                                  className="text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">add</span>
                                  <span>Add Choice</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(opt.choices || []).map((choice, choiceIdx) => (
                                  <div key={choiceIdx} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2">
                                    <input
                                      type="text"
                                      value={choice.label}
                                      onChange={(e) => {
                                        const updated = [...productForm.customOptions];
                                        const choices = [...updated[optIdx].choices];
                                        choices[choiceIdx] = { ...choices[choiceIdx], label: e.target.value };
                                        updated[optIdx] = { ...updated[optIdx], choices };
                                        setProductForm({ ...productForm, customOptions: updated });
                                      }}
                                      placeholder="Choice label (e.g. 4 Colors)"
                                      className="flex-1 bg-transparent border-0 text-xs font-medium text-on-surface focus:outline-none"
                                    />
                                    <div className="flex items-center gap-1 shrink-0 bg-surface-container-low px-2 py-1 rounded border border-outline-variant">
                                      <span className="text-[10px] font-bold text-secondary">+₹</span>
                                      <input
                                        type="number"
                                        value={choice.priceModifier}
                                        onChange={(e) => {
                                          const updated = [...productForm.customOptions];
                                          const choices = [...updated[optIdx].choices];
                                          choices[choiceIdx] = { ...choices[choiceIdx], priceModifier: Number(e.target.value) || 0 };
                                          updated[optIdx] = { ...updated[optIdx], choices };
                                          setProductForm({ ...productForm, customOptions: updated });
                                        }}
                                        placeholder="0"
                                        className="w-14 bg-transparent border-0 text-xs font-bold text-primary focus:outline-none text-right"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...productForm.customOptions];
                                        const choices = updated[optIdx].choices.filter((_, i) => i !== choiceIdx);
                                        updated[optIdx] = { ...updated[optIdx], choices };
                                        setProductForm({ ...productForm, customOptions: updated });
                                      }}
                                      className="text-secondary hover:text-error transition-colors p-1 cursor-pointer"
                                      title="Remove choice"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-outline-variant rounded-xl p-6 text-center text-secondary text-xs">
                        No custom variables added yet. Click &quot;Add Column&quot; to allow buyers to select specific colors, design tiers, or add-ons.
                      </div>
                    )}
                  </div>

                  {/* Quantity Pricing & Tier Multipliers Builder */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined">shopping_cart</span>
                          <span>Quantity Pricing & Tier Multipliers</span>
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          Set custom quantity tiers and how much the price increases/changes with higher quantities.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(productForm.quantityTiers || []),
                            { label: "500 Units", priceModifier: 0 }
                          ];
                          setProductForm({ ...productForm, quantityTiers: updated });
                        }}
                        className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Add Qty Tier</span>
                      </button>
                    </div>

                    {(productForm.quantityTiers && productForm.quantityTiers.length > 0) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {productForm.quantityTiers.map((tier, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-xl p-3">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-secondary uppercase mb-0.5">Quantity Label</label>
                              <input
                                type="text"
                                value={tier.label}
                                onChange={(e) => {
                                  const updated = [...productForm.quantityTiers];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  setProductForm({ ...productForm, quantityTiers: updated });
                                }}
                                placeholder="e.g. 100 Units"
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="w-28">
                              <label className="block text-[10px] font-bold text-secondary uppercase mb-0.5">Price Increase</label>
                              <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1">
                                <span className="text-[11px] font-bold text-secondary">+₹</span>
                                <input
                                  type="number"
                                  value={tier.priceModifier}
                                  onChange={(e) => {
                                    const updated = [...productForm.quantityTiers];
                                    updated[idx] = { ...updated[idx], priceModifier: Number(e.target.value) || 0 };
                                    setProductForm({ ...productForm, quantityTiers: updated });
                                  }}
                                  placeholder="0"
                                  className="w-full bg-transparent border-0 text-xs font-bold text-primary focus:outline-none text-right"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = productForm.quantityTiers.filter((_, i) => i !== idx);
                                setProductForm({ ...productForm, quantityTiers: updated });
                              }}
                              className="text-secondary hover:text-error transition-colors p-1 mt-4 cursor-pointer"
                              title="Remove quantity tier"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-outline-variant rounded-xl p-6 text-center text-secondary text-xs">
                        Using standard category quantity options. Click &quot;Add Qty Tier&quot; to override quantity choices and price breaks specifically for this product.
                      </div>
                    )}
                  </div>

                  {/* Quality & Finish Overrides Builder */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-6">
                    <div>
                      <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">workspace_premium</span>
                        <span>Quality & Finish Options (with Price Surcharges)</span>
                      </h3>
                      <p className="text-xs text-secondary mt-0.5">
                        Define product-specific paper quality grades or finishing touches and their respective price increases.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Quality Options Column */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Quality Grades</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [
                                ...(productForm.qualityOptions || []),
                                { id: `quality_${Date.now()}`, title: "Premium Velvet", subtitle: "Heavyweight 350 GSM", priceModifier: 150 }
                              ];
                              setProductForm({ ...productForm, qualityOptions: updated });
                            }}
                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            <span>Add Quality</span>
                          </button>
                        </div>
                        {(productForm.qualityOptions && productForm.qualityOptions.length > 0) ? (
                          <div className="space-y-2">
                            {productForm.qualityOptions.map((q, qIdx) => (
                              <div key={qIdx} className="bg-surface-container-low border border-outline-variant rounded-lg p-2.5 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={q.title}
                                    onChange={(e) => {
                                      const updated = [...productForm.qualityOptions];
                                      updated[qIdx] = { ...updated[qIdx], title: e.target.value };
                                      setProductForm({ ...productForm, qualityOptions: updated });
                                    }}
                                    placeholder="Title (e.g. Premium Velvet)"
                                    className="flex-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-xs font-semibold"
                                  />
                                  <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 shrink-0">
                                    <span className="text-[10px] font-bold text-secondary">+₹</span>
                                    <input
                                      type="number"
                                      value={q.priceModifier}
                                      onChange={(e) => {
                                        const updated = [...productForm.qualityOptions];
                                        updated[qIdx] = { ...updated[qIdx], priceModifier: Number(e.target.value) || 0 };
                                        setProductForm({ ...productForm, qualityOptions: updated });
                                      }}
                                      placeholder="0"
                                      className="w-12 bg-transparent border-0 text-xs font-bold text-primary focus:outline-none text-right"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = productForm.qualityOptions.filter((_, i) => i !== qIdx);
                                      setProductForm({ ...productForm, qualityOptions: updated });
                                    }}
                                    className="text-secondary hover:text-error transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={q.subtitle}
                                  onChange={(e) => {
                                    const updated = [...productForm.qualityOptions];
                                    updated[qIdx] = { ...updated[qIdx], subtitle: e.target.value };
                                    setProductForm({ ...productForm, qualityOptions: updated });
                                  }}
                                  placeholder="Subtitle / Description"
                                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-[11px] text-secondary"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-secondary italic p-3 bg-surface-container-low/50 rounded-lg text-center">
                            Uses category default quality options.
                          </div>
                        )}
                      </div>

                      {/* Style Options Column */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Style / Finish Cut</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [
                                ...(productForm.styleOptions || []),
                                { id: `style_${Date.now()}`, title: "Rounded Corners + UV", subtitle: "Specialized die-cut trim", priceModifier: 100 }
                              ];
                              setProductForm({ ...productForm, styleOptions: updated });
                            }}
                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            <span>Add Style</span>
                          </button>
                        </div>
                        {(productForm.styleOptions && productForm.styleOptions.length > 0) ? (
                          <div className="space-y-2">
                            {productForm.styleOptions.map((s, sIdx) => (
                              <div key={sIdx} className="bg-surface-container-low border border-outline-variant rounded-lg p-2.5 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={s.title}
                                    onChange={(e) => {
                                      const updated = [...productForm.styleOptions];
                                      updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                                      setProductForm({ ...productForm, styleOptions: updated });
                                    }}
                                    placeholder="Title (e.g. Rounded Corners)"
                                    className="flex-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-xs font-semibold"
                                  />
                                  <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 shrink-0">
                                    <span className="text-[10px] font-bold text-secondary">+₹</span>
                                    <input
                                      type="number"
                                      value={s.priceModifier}
                                      onChange={(e) => {
                                        const updated = [...productForm.styleOptions];
                                        updated[sIdx] = { ...updated[sIdx], priceModifier: Number(e.target.value) || 0 };
                                        setProductForm({ ...productForm, styleOptions: updated });
                                      }}
                                      placeholder="0"
                                      className="w-12 bg-transparent border-0 text-xs font-bold text-primary focus:outline-none text-right"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = productForm.styleOptions.filter((_, i) => i !== sIdx);
                                      setProductForm({ ...productForm, styleOptions: updated });
                                    }}
                                    className="text-secondary hover:text-error transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={s.subtitle}
                                  onChange={(e) => {
                                    const updated = [...productForm.styleOptions];
                                    updated[sIdx] = { ...updated[sIdx], subtitle: e.target.value };
                                    setProductForm({ ...productForm, styleOptions: updated });
                                  }}
                                  placeholder="Subtitle / Description"
                                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-[11px] text-secondary"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-secondary italic p-3 bg-surface-container-low/50 rounded-lg text-center">
                            Uses category default style options.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications Builder */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">fact_check</span>
                        <span>Technical Specifications</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(productForm.specifications || []),
                            { label: "Paper Weight", value: "350 GSM Premium Card" }
                          ];
                          setProductForm({ ...productForm, specifications: updated });
                        }}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        <span>Add Spec</span>
                      </button>
                    </div>
                    {(productForm.specifications && productForm.specifications.length > 0) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {productForm.specifications.map((spec, specIdx) => (
                          <div key={specIdx} className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg p-2">
                            <input
                              type="text"
                              value={spec.label}
                              onChange={(e) => {
                                const updated = [...productForm.specifications];
                                updated[specIdx] = { ...updated[specIdx], label: e.target.value };
                                setProductForm({ ...productForm, specifications: updated });
                              }}
                              placeholder="Label (e.g. GSM)"
                              className="w-1/3 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => {
                                const updated = [...productForm.specifications];
                                updated[specIdx] = { ...updated[specIdx], value: e.target.value };
                                setProductForm({ ...productForm, specifications: updated });
                              }}
                              placeholder="Value (e.g. 350 GSM)"
                              className="flex-1 bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-xs text-secondary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = productForm.specifications.filter((_, i) => i !== specIdx);
                                setProductForm({ ...productForm, specifications: updated });
                              }}
                              className="text-secondary hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-secondary italic text-center py-3">
                        No custom specifications. Uses category default specs.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-5">
                    <h3 className="font-semibold text-base text-primary">Pricing & Visibility</h3>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Numeric Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        placeholder="499"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Status
                      </label>
                      <select
                        value={productForm.status}
                        onChange={(e) =>
                          setProductForm({ ...productForm, status: e.target.value })
                        }
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                      >
                        <option value="Published">Published (Live on Store)</option>
                        <option value="Draft">Draft (Internal Review)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-base text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[20px]">photo_library</span>
                        <span>Product Gallery Photos</span>
                      </h3>
                      <span className="text-xs text-secondary font-medium">
                        {(productForm.images || []).length} photo(s) added
                      </span>
                    </div>

                    {/* Add new photo bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                        <span>{productPhotoUploading ? "Uploading to Cloudinary..." : "Upload From Device"}</span>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          disabled={productPhotoUploading}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleProductPhotoUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs font-bold text-secondary">OR</span>
                      <input
                        type="text"
                        value={newPhotoInput}
                        onChange={(e) => setNewPhotoInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newPhotoInput.trim()) {
                              const updated = [...(productForm.images || []), newPhotoInput.trim()];
                              setProductForm({
                                ...productForm,
                                images: updated,
                                image: productForm.image || updated[0]
                              });
                              setNewPhotoInput("");
                            }
                          }
                        }}
                        placeholder="Paste image URL (https://...)"
                        className="flex-1 min-w-45 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPhotoInput.trim()) {
                            const updated = [...(productForm.images || []), newPhotoInput.trim()];
                            setProductForm({
                              ...productForm,
                              images: updated,
                              image: productForm.image || updated[0]
                            });
                            setNewPhotoInput("");
                          }
                        }}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                        <span>Add Photo</span>
                      </button>
                    </div>

                    {/* Gallery Photos Grid */}
                    {(productForm.images && productForm.images.length > 0) ? (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {productForm.images.map((imgUrl, idx) => {
                          const isCover = productForm.image === imgUrl || (!productForm.image && idx === 0);
                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                isCover ? "border-primary shadow-sm" : "border-outline-variant"
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery photo ${idx + 1}`}
                                className="w-full h-28 object-cover bg-surface-container"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => setProductForm({ ...productForm, image: imgUrl })}
                                    className="px-2 py-1 bg-white text-on-surface text-[10px] font-bold rounded shadow hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = productForm.images.filter((_, i) => i !== idx);
                                    setProductForm({
                                      ...productForm,
                                      images: updated,
                                      image: productForm.image === imgUrl ? updated[0] || "" : productForm.image
                                    });
                                  }}
                                  className="p-1 bg-error text-white rounded-full hover:brightness-110 transition-colors cursor-pointer"
                                  title="Remove photo"
                                >
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                              </div>
                              {isCover && (
                                <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary shadow-xs">
                                  Cover Photo
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-dashed border-outline-variant rounded-xl p-6 text-center text-secondary text-xs">
                        No photos added yet. Paste image URLs above to create a multi-photo gallery.
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB: TEMPLATES MANAGEMENT */}
          {activeTab === "templates" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">Design Templates Management</h2>
                  <p className="text-sm text-secondary mt-1">
                    Manage front & back design images and pricing as per unit for every template.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddTemplate}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg hover:brightness-110 transition-all font-medium text-sm shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Add Template</span>
                </button>
              </div>

              {/* Quick Category Filters */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-2">
                  Filter Category:
                </span>
                {["All", ...Object.keys(categoryTemplateMap)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      templateFilter === cat
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {cat === "All" ? "All Categories" : (categoryTemplateMap[cat]?.name || cat)}
                  </button>
                ))}
              </div>

              {/* Templates Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container text-secondary font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-5">Design Preview</th>
                        <th className="py-3.5 px-5">Template Title & Category</th>
                        <th className="py-3.5 px-5">Template Size (mm)</th>
                        <th className="py-3.5 px-5">Base Price</th>
                        <th className="py-3.5 px-5">Pricing As Per Unit</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {templates
                        .filter((t) => templateFilter === "All" || t.categorySlug === templateFilter)
                        .map((t) => {
                          const isVC = t.categorySlug === "visiting-cards" || t.hasBackSide;
                          const catData = categoryTemplateMap[t.categorySlug] || {};
                          return (
                          <tr key={t._id || t.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2">
                                <div
                                  style={{ aspectRatio: parseMmAspectRatio(t.size) }}
                                  className="w-16 rounded-lg overflow-hidden bg-slate-50 border border-outline-variant relative group flex items-center justify-center max-h-12 shrink-0"
                                >
                                  <img
                                    src={t.frontImage || t.image}
                                    alt="Front"
                                    className="w-full h-full object-contain"
                                  />
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-bold">
                                    {isVC ? "FRONT" : "DESIGN"}
                                  </span>
                                </div>
                                {isVC && (
                                  <div
                                    style={{ aspectRatio: parseMmAspectRatio(t.size) }}
                                    className="w-16 rounded-lg overflow-hidden bg-slate-50 border border-outline-variant relative group flex items-center justify-center max-h-12 shrink-0"
                                  >
                                    <img
                                      src={t.backImage || t.frontImage || t.image}
                                      alt="Back"
                                      className="w-full h-full object-contain"
                                    />
                                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-bold">BACK</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <div className="font-bold text-on-surface">{t.title}</div>
                              <div className="text-xs text-secondary mt-0.5">{catData.name || t.categoryName || t.categorySlug}</div>
                            </td>
                            <td className="py-4 px-5">
                              <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md block max-w-[200px] leading-snug">
                                {t.size || "85mm x 55mm"}
                              </span>
                            </td>
                            <td className="py-4 px-5 font-semibold text-on-surface">{t.price || "₹200.00"}</td>
                            <td className="py-4 px-5 font-semibold text-primary">{t.unitPrice || "₹2.00 each / 100 units"}</td>
                            <td className="py-4 px-5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                t.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
                                {t.isActive !== false ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right space-x-2">
                              <button
                                onClick={() => handleEditTemplate(t)}
                                className="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-on-surface transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(t.id || t._id)}
                                className="px-3 py-1.5 rounded-lg bg-error text-on-error hover:brightness-110 text-xs font-semibold transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                        })}
                      {templates.filter((t) => templateFilter === "All" || t.categorySlug === templateFilter).length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-10 text-secondary">
                            No templates match the selected category. Click &quot;Add Template&quot; above to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEMPLATE DETAILS FORM */}
          {activeTab === "template-detail" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {editingTemplateId ? "Edit Design Template" : "Create New Design Template"}
                  </h2>
                  <p className="text-sm text-secondary mt-1">
                    Set Front & Back artwork URLs and exact Pricing As Per Unit.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  <button
                    onClick={() => setActiveTab("templates")}
                    className="px-5 py-2 border border-outline-variant rounded-lg font-medium text-sm text-secondary hover:bg-surface-container transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  {editingTemplateId && (
                    <button
                      type="button"
                      onClick={() => openAdminStudio(editingTemplateId, templateForm)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>🎨 Open Studio to Position Elements</span>
                      <span>↗</span>
                    </button>
                  )}
                  <button
                    onClick={handleSaveTemplate}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium text-sm hover:brightness-110 transition-all shadow-sm cursor-pointer"
                  >
                    Save Template
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveTemplate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Template Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={templateForm.title}
                        onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                        placeholder="e.g. Minimalist Blue Edge Executive Card"
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Category Slug *
                      </label>
                      <select
                        value={templateForm.categorySlug}
                        onChange={(e) => {
                          const newSlug = e.target.value;
                          const catData = categoryTemplateMap[newSlug] || {};
                          setTemplateForm({
                            ...templateForm,
                            categorySlug: newSlug,
                            price: catData.basePrice || templateForm.price,
                            unitPrice: catData.unitPriceText || templateForm.unitPrice,
                            size: templateForm.size || "85mm x 55mm"
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                      >
                        {Object.entries(categoryTemplateMap).map(([slug, data]) => (
                          <option key={slug} value={slug}>
                            {data.name} ({slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        Individual Template Size (in mm) *
                      </label>
                      <input
                        type="text"
                        required
                        value={templateForm.size || ""}
                        onChange={(e) => setTemplateForm({ ...templateForm, size: e.target.value })}
                        placeholder='e.g. 85mm x 55mm or 90mm x 50mm'
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Base Price *
                        </label>
                        <input
                          type="text"
                          required
                          value={templateForm.price}
                          onChange={(e) => setTemplateForm({ ...templateForm, price: e.target.value })}
                          placeholder="e.g. ₹200.00"
                          className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Pricing As Per Unit *
                        </label>
                        <input
                          type="text"
                          required
                          value={templateForm.unitPrice}
                          onChange={(e) => setTemplateForm({ ...templateForm, unitPrice: e.target.value })}
                          placeholder="e.g. ₹2.00 each / 100 units"
                          className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Badge / Ribbon
                        </label>
                        <input
                          type="text"
                          value={templateForm.badge}
                          onChange={(e) => setTemplateForm({ ...templateForm, badge: e.target.value })}
                          placeholder="e.g. Bestseller / Popular / New"
                          className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                          Status
                        </label>
                        <select
                          value={templateForm.status}
                          onChange={(e) => setTemplateForm({ ...templateForm, status: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Print Dimensions Specification (Full Design Size, Safe Area, Final Card Size) */}
                    <div className="space-y-4 pt-2 border-t border-outline-variant">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                        <span>Print Dimensions & Guidelines (MM)</span>
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Full Design Size (Including Bleed) *
                          </label>
                          <input
                            type="text"
                            required
                            value={templateForm.fullDesignSize || ""}
                            onChange={(e) => setTemplateForm({ ...templateForm, fullDesignSize: e.target.value })}
                            placeholder="e.g. W: 93.00 mm X H: 56.00 mm"
                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary font-bold text-red-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Maximum Text Area (Safe Area) *
                          </label>
                          <input
                            type="text"
                            required
                            value={templateForm.safeAreaSize || ""}
                            onChange={(e) => setTemplateForm({ ...templateForm, safeAreaSize: e.target.value })}
                            placeholder="e.g. W: 82.00 mm X H: 45.00 mm"
                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary font-bold text-red-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Final Card Size (After Cutting) *
                          </label>
                          <input
                            type="text"
                            required
                            value={templateForm.finalCardSize || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTemplateForm({ ...templateForm, finalCardSize: val, size: val });
                            }}
                            placeholder="e.g. W: 90.00 mm x H: 53.00 mm"
                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary font-bold text-red-600"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant">
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                        {templateForm.categorySlug === "visiting-cards" ? "Front Photo / Design (Cloudinary Upload) *" : "Design Photo (Cloudinary Upload) *"}
                      </label>
                      <p className="text-xs text-secondary">
                        Upload a photo directly from your computer or phone (`a2v_templates` on Cloudinary), or paste an existing image URL.
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="px-4 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 transition-all flex items-center gap-2 shadow-xs">
                          <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                          <span>{templateFrontUploading ? 'Uploading to Cloudinary...' : 'Upload From Device'}</span>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            disabled={templateFrontUploading}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleTemplateImageUpload(e.target.files[0], "front");
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs font-bold text-secondary">OR</span>
                        <input
                          type="text"
                          required
                          value={templateForm.frontImage}
                          onChange={(e) => setTemplateForm({ ...templateForm, frontImage: e.target.value })}
                          placeholder="Paste direct URL (https://... or data:image/...)"
                          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-xs focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                      {templateForm.frontImage && (
                        <div
                          style={{ aspectRatio: parseMmAspectRatio(templateForm.size) }}
                          className="mt-3 w-full max-w-xs rounded-xl overflow-hidden border border-outline-variant bg-slate-50 shadow-sm relative flex items-center justify-center max-h-[260px]"
                        >
                          <img src={templateForm.frontImage} alt="Design Preview" className="w-full h-full object-contain" />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                            {templateForm.categorySlug === "visiting-cards" ? "FRONT PREVIEW" : "DESIGN PREVIEW"}
                          </span>
                        </div>
                      )}
                    </div>

                    {templateForm.categorySlug === "visiting-cards" && (
                      <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant">
                        <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                          Back Photo (Cloudinary Upload) *
                        </label>
                        <p className="text-xs text-secondary">
                          Upload the back side photo from your device (`a2v_templates` on Cloudinary), or paste an image URL.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-4 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 transition-all flex items-center gap-2 shadow-xs">
                            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                            <span>{templateBackUploading ? 'Uploading to Cloudinary...' : 'Upload From Device'}</span>
                            <input
                              type="file"
                              accept="image/*,.svg"
                              disabled={templateBackUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleTemplateImageUpload(e.target.files[0], "back");
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs font-bold text-secondary">OR</span>
                          <input
                            type="text"
                            required
                            value={templateForm.backImage}
                            onChange={(e) => setTemplateForm({ ...templateForm, backImage: e.target.value })}
                            placeholder="Paste direct URL (https://... or data:image/...)"
                            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-xs focus:outline-none focus:border-primary font-mono"
                          />
                        </div>
                        {templateForm.backImage && (
                          <div
                            style={{ aspectRatio: parseMmAspectRatio(templateForm.size) }}
                            className="mt-3 w-full max-w-xs rounded-xl overflow-hidden border border-outline-variant bg-slate-50 shadow-sm relative flex items-center justify-center max-h-[260px]"
                          >
                            <img src={templateForm.backImage} alt="Back Preview" className="w-full h-full object-contain" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">BACK PREVIEW</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>


              </form>
            </div>
          )}

          {/* TAB 3.5: GRAPHICS & ASSETS LIBRARY (CLOUDINARY & MONGODB) */}
          {activeTab === "graphics" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">photo_library</span>
                    <span>Studio Graphics & Asset Library</span>
                  </h2>
                  <p className="text-sm text-secondary mt-1">
                    Upload and manage background photos, icons, vector shapes, and illustrations stored in Cloudinary and Mongo DB.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200">
                    ☁ Cloudinary Powered
                  </span>
                </div>
              </div>

              {/* Add / Edit Asset Form */}
              <form onSubmit={handleSaveGraphic} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-5">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      {editingGraphicId ? 'edit' : 'add_circle'}
                    </span>
                    <span>{editingGraphicId ? 'Edit Graphic Asset' : 'Upload / Add New Graphic Asset'}</span>
                  </h3>
                  {editingGraphicId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGraphicId(null);
                        setGraphicsForm({ title: '', category: 'image', url: '', svgContent: '', isActive: true });
                      }}
                      className="text-xs text-secondary hover:text-on-surface font-semibold underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Asset Category *
                    </label>
                    <select
                      value={graphicsForm.category}
                      onChange={(e) => setGraphicsForm({ ...graphicsForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="image">Image / Photo (Tab: Images)</option>
                      <option value="icon">Icon / Symbol (Tab: Icons)</option>
                      <option value="illustration">Illustration / Graphic (Tab: Illustrations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Asset Title / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={graphicsForm.title}
                      onChange={(e) => setGraphicsForm({ ...graphicsForm, title: e.target.value })}
                      placeholder="e.g. Floral Florist Bouquet or Gold Badge"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={graphicsForm.isActive ? 'active' : 'hidden'}
                      onChange={(e) => setGraphicsForm({ ...graphicsForm, isActive: e.target.value === 'active' })}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="active">Active (Visible in Studio)</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant">
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                      Option 1: Upload File from Computer (Cloudinary)
                    </label>
                    <p className="text-xs text-secondary">
                      Select JPG, PNG, WEBP, or SVG. It will instantly upload to your Cloudinary storage folder (`a2v_graphics`).
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 transition-all flex items-center gap-2 shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                        <span>{graphicUploading ? 'Uploading to Cloudinary...' : 'Choose & Upload File'}</span>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          disabled={graphicUploading}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleGraphicFileUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {graphicsForm.url && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>File Ready</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant">
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                      Option 2: Paste Direct Image / SVG URL
                    </label>
                    <p className="text-xs text-secondary">
                      Or directly paste any URL (`https://...` or `data:image/...`) if already hosted online.
                    </p>
                    <input
                      type="text"
                      value={graphicsForm.url}
                      onChange={(e) => setGraphicsForm({ ...graphicsForm, url: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-xs focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                {/* Optional SVG Raw Code textarea for icons */}
                {(graphicsForm.category === 'icon' || graphicsForm.category === 'illustration') && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Raw SVG Code / Paths (Optional Vector Data)
                    </label>
                    <textarea
                      rows="2"
                      value={graphicsForm.svgContent || ''}
                      onChange={(e) => setGraphicsForm({ ...graphicsForm, svgContent: e.target.value })}
                      placeholder='<svg viewBox="0 0 100 100">...</svg> (If provided, renders razor-sharp scalable vectors)'
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                {/* Live Preview & Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-outline-variant">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-secondary uppercase">Live Preview:</span>
                    <div className="w-16 h-16 rounded-xl border border-outline-variant bg-slate-50 flex items-center justify-center overflow-hidden shadow-2xs p-1">
                      {graphicsForm.url ? (
                        <img src={graphicsForm.url} alt="Preview" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Image</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={graphicUploading}
                    className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {editingGraphicId ? 'Update Graphic Asset' : 'Save Graphic Asset'}
                  </button>
                </div>
              </form>

              {/* Category Filter Tabs */}
              <div className="border-b border-outline-variant flex gap-6 text-sm font-medium">
                {["All", "image", "icon", "illustration"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGraphicsFilter(cat)}
                    className={`pb-3 border-b-2 transition-all cursor-pointer capitalize ${
                      graphicsFilter === cat
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-secondary hover:text-on-surface"
                    }`}
                  >
                    {cat === "All" ? "All Assets" : `${cat}s`} ({graphicsList.filter(g => cat === "All" || g.category === cat).length})
                  </button>
                ))}
              </div>

              {/* Graphics Grid / Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {graphicsList
                  .filter((g) => graphicsFilter === "All" || g.category === graphicsFilter)
                  .map((g) => (
                    <div
                      key={g.id || g._id}
                      className={`bg-surface-container-lowest border rounded-xl p-3 flex flex-col justify-between shadow-2xs relative group transition-all ${
                        !g.isActive ? "border-amber-300 opacity-60" : "border-outline-variant hover:border-primary"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="aspect-square bg-slate-50/80 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden p-2 relative">
                          {g.url ? (
                            <img src={g.url} alt={g.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          ) : (
                            <span className="text-xs text-slate-400 font-bold">No Preview</span>
                          )}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-900/80 text-white tracking-wider">
                            {g.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-on-surface truncate" title={g.title}>
                          {g.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-outline-variant/60 text-xs">
                        <span className={`text-[10px] font-extrabold ${g.isActive ? "text-emerald-600" : "text-amber-600"}`}>
                          {g.isActive ? "● Active" : "○ Hidden"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGraphicId(g.id);
                              setGraphicsForm({
                                title: g.title || "",
                                category: g.category || "image",
                                url: g.url || "",
                                svgContent: g.svgContent || "",
                                isActive: g.isActive !== undefined ? g.isActive : true
                              });
                              window.scrollTo({ top: 300, behavior: "smooth" });
                            }}
                            className="p-1 text-secondary hover:text-primary rounded cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGraphic(g.id)}
                            className="p-1 text-secondary hover:text-error rounded cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDER MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Live Order Management</h2>
                <p className="text-sm text-secondary mt-1">
                  Dynamically track and update print order statuses.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="border-b border-outline-variant flex gap-6 text-sm font-medium">
                {["All", "Processing", "Printing", "Shipped", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`pb-3 border-b-2 transition-all cursor-pointer ${
                      orderStatusFilter === status
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-secondary hover:text-on-surface"
                    }`}
                  >
                    {status} Orders
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container text-secondary font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-5">Order ID</th>
                        <th className="py-3.5 px-5">Customer Info</th>
                        <th className="py-3.5 px-5">Printing Job Items</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5">Date</th>
                        <th className="py-3.5 px-5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredOrders.map((ord) => {
                        const oid = ord.orderId || ord.id || ord._id;
                        return (
                          <tr
                            key={oid}
                            className="hover:bg-surface-container-low transition-colors"
                          >
                            <td className="py-4 px-5 font-bold text-primary">{oid}</td>
                            <td className="py-4 px-5">
                              <p className="font-semibold text-on-surface">{ord.customer?.name || "Customer"}</p>
                              <p className="text-xs text-secondary">{ord.customer?.email || ""}</p>
                            </td>
                            <td className="py-4 px-5 text-secondary max-w-xs truncate">
                              {(() => {
                                let txt = ord.itemsSummary || "";
                                if (txt.includes("undefined") || !txt) {
                                  if (Array.isArray(ord.items) && ord.items.length > 0) {
                                    const names = ord.items.map((i) => i.name || i.title).filter((n) => n && n !== "undefined");
                                    if (names.length > 0) return names.join(", ");
                                  }
                                  return "Premium Visiting Cards (Custom Print)";
                                }
                                return txt;
                              })()}
                            </td>
                            <td className="py-4 px-5">
                              <select
                                value={ord.status || "Processing"}
                                onChange={(e) => handleOrderStatusChange(oid, e.target.value)}
                                className="bg-surface-container-low border border-outline-variant rounded px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Printing">Printing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-4 px-5 text-secondary text-xs">
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ord.date || "Today"}
                            </td>
                            <td className="py-4 px-5 text-right font-bold text-on-surface">
                              ₹{Number(ord.total || 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Live User Access & Roles</h2>
                <p className="text-sm text-secondary mt-1">
                  Dynamically loaded registered users from MongoDB (`/api/users`).
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container text-secondary font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">User Profile</th>
                      <th className="py-3.5 px-5">Email Address</th>
                      <th className="py-3.5 px-5">Role Privileges</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {users.map((usr) => (
                      <tr key={usr._id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-5 font-semibold text-on-surface">
                          {usr.name || "A2V Member"}
                        </td>
                        <td className="py-4 px-5 text-secondary">{usr.email}</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              usr.role === "admin"
                                ? "bg-primary-container text-on-primary-container"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {(usr.role || "user").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleToggleUserRole(usr)}
                            className="px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded text-xs font-medium text-on-surface hover:bg-surface-container cursor-pointer"
                          >
                            Switch to {usr.role === "admin" ? "User" : "Admin"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-secondary">
                          No additional users found in MongoDB. Current Admin: {currentUser.name} ({currentUser.email})
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: STORE CONFIGURATION */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Store Configuration</h2>
                <p className="text-sm text-secondary mt-1">
                  Persistent dynamic store configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
                  <h3 className="font-semibold text-base text-primary">General Business Details</h3>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeConfig.storeName}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, storeName: e.target.value })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={storeConfig.supportEmail}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, supportEmail: e.target.value })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={storeConfig.currency}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, currency: e.target.value })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
                  <h3 className="font-semibold text-base text-primary">Workshop Quality Settings</h3>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Default Artwork DPI Standard
                    </label>
                    <select
                      value={storeConfig.defaultDPI}
                      onChange={(e) =>
                        setStoreConfig({
                          ...storeConfig,
                          defaultDPI: Number(e.target.value)
                        })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                    >
                      <option value="300">300 DPI (Standard High-Definition Print)</option>
                      <option value="600">600 DPI (Ultra Precision Lithograph)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Standard Bleed Threshold
                    </label>
                    <input
                      type="text"
                      value={storeConfig.bleedThreshold}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, bleedThreshold: e.target.value })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-sm"
                    >
                    </input>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveStoreConfig}
                      className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-medium text-sm hover:brightness-110 transition-all cursor-pointer"
                    >
                      Save Dynamic Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}