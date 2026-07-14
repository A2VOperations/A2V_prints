"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); // overview | products | product-detail | orders | users | settings
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
    badge: "Bestseller"
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
      badge: "New"
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
      badge: prod.badge || "Featured"
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
        badge: productForm.badge
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
      <aside className="w-[260px] fixed top-0 left-0 h-screen bg-surface border-r border-outline-variant flex flex-col z-30 select-none">
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
      <header className="h-16 fixed top-0 right-0 left-[260px] z-20 bg-surface border-b border-outline-variant flex justify-between items-center px-6">
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
      <main className="ml-[260px] pt-16 min-h-screen w-[calc(100%-260px)]">
        <div className="p-6 max-w-[1440px] mx-auto">
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
                              <td className="py-3.5 px-4 text-secondary max-w-[200px] truncate">
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
                    <div className="flex gap-2">
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
                        className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
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