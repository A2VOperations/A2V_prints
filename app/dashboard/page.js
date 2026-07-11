// app/dashboard/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Admin section state inside dashboard
  // Product CRUD state inside dashboard
  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const initialFormState = {
    name: "",
    title: "",
    categorySlug: "visiting-cards",
    serviceType: "printing",
    price: "₹499",
    numericPrice: 499,
    turnaround: "2-3 business days",
    badge: "",
    description: "",
    image: "",
    isActive: true,
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!data.user) {
          router.push("/login");
          return;
        }
        setUser(data.user);

        // If admin, default tab to admin and fetch product catalog
        if (data.user.role === "admin") {
          setActiveTab("admin");
          fetchProducts();
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function fetchProducts() {
    setProductsLoading(true);
    try {
      const res = await fetch("/api/products?limit=500");
      if (res.ok) {
        const data = await res.json();
        setProductsList(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductsLoading(false);
    }
  }

  function openCreateModal(defaultServiceType = "printing") {
    if (!user || user.role !== "admin") return;
    setModalMode("create");
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      serviceType: defaultServiceType,
      categorySlug: defaultServiceType === "graphic" ? "logo-design" : "visiting-cards",
    });
    setIsModalOpen(true);
  }

  function openEditModal(prod) {
    if (!user || user.role !== "admin") return;
    setModalMode("edit");
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      title: prod.title || prod.name || "",
      categorySlug: prod.categorySlug || "visiting-cards",
      serviceType: prod.serviceType || "printing",
      price: prod.price || "",
      numericPrice: prod.numericPrice || 0,
      turnaround: prod.turnaround || "2-3 business days",
      badge: prod.badge || "",
      description: prod.description || prod.desc || "",
      image: prod.image || "",
      isActive: prod.isActive !== undefined ? prod.isActive : true,
      isFeatured: prod.isFeatured || false,
    });
    setIsModalOpen(true);
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    if (!user || user.role !== "admin") return;
    setSavingProduct(true);
    try {
      const targetId = editingProduct ? editingProduct._id || editingProduct.id : null;
      const url = modalMode === "create" ? "/api/products" : `/api/products/${targetId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        desc: formData.description,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || "Failed to save product details");
      }
    } catch (err) {
      console.error("Save product error:", err);
      alert("Error saving product details");
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(prod) {
    if (!user || user.role !== "admin") return;
    if (!confirm(`Are you sure you want to delete product "${prod.name}"?`)) return;
    const targetId = prod._id || prod.id;
    setDeletingId(targetId);
    try {
      const res = await fetch(`/api/products/${targetId}`, { method: "DELETE" });
      if (res.ok) {
        setProductsList((prev) =>
          prev.filter((p) => p._id !== prod._id && p.id !== prod.id)
        );
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.dispatchEvent(new Event("auth-change"));
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  }

  const filteredProducts = productsList.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.categorySlug &&
        p.categorySlug.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const printingProducts = filteredProducts.filter(
    (p) => p.serviceType === "printing" || (!p.serviceType && p.categorySlug !== "graphic")
  );

  const graphicProducts = filteredProducts.filter(
    (p) => p.serviceType === "graphic"
  );

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#f54278]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-600 font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* Admin Alert Banner */}
        {isAdmin && (
          <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Administrator Privileges Active
                </span>
                <p className="text-sm text-gray-300">
                  You are logged in as an Admin. You can manage users and catalog directly from your dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-linear-to-r from-[#F06800] to-[#f54278] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md"
              >
                Full Admin Portal →
              </Link>
            </div>
          </div>
        )}

        {/* Top User Profile Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#F06800] via-[#f54278] to-[#9842dc] text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Welcome, {user.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isAdmin
                      ? "bg-pink-100 text-[#f54278] border border-pink-200"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isAdmin ? "Admin" : "Active Member"}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Only visible if Admin to switch between Admin & Member view) */}
        {isAdmin && (
          <div className="flex border-b border-gray-200 gap-6">
            <button
              onClick={() => setActiveTab("admin")}
              className={`pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === "admin"
                  ? "border-[#f54278] text-[#f54278]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Product Catalog Management (CRUD)
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === "overview"
                  ? "border-[#f54278] text-[#f54278]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              My Member Dashboard
            </button>
          </div>
        )}

        {/* TAB 1: PRODUCT CATALOG CRUD MANAGEMENT */}
        {isAdmin && activeTab === "admin" && (
          <div className="space-y-8">
            {/* Control Header & Search */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Product Catalog Management</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your store catalog divided into Printing Products and Graphic Design Products.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f54278] transition-colors w-64"
                />
                <button
                  onClick={() => openCreateModal("printing")}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#F06800] to-[#f54278] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>+ Create Product</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: PRINTING PRODUCTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#f54278] flex items-center justify-center font-bold text-lg">
                    🖨️
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-gray-900">Printing Products Catalog</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#f54278] text-xs font-bold">
                        {printingProducts.length} items
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Physical print services: Visiting cards, brochures, banners, stickers, packaging, etc.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openCreateModal("printing")}
                  className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#f54278] border border-pink-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Printing Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Product & Category</th>
                      <th className="py-3 px-4 font-semibold">Service Type</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Turnaround</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {printingProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          No printing products found. Click "+ Add Printing Product" to add one!
                        </td>
                      </tr>
                    ) : (
                      printingProducts.map((p) => (
                        <tr key={p._id || p.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                              Slug: {p.categorySlug}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              PRINTING
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {p.price || `₹${p.numericPrice || 0}`}
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-xs">
                            {p.turnaround || "2-3 Days"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {p.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              disabled={deletingId === (p._id || p.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === (p._id || p.id) ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: GRAPHIC PRODUCTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#9842dc] flex items-center justify-center font-bold text-lg">
                    🎨
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-gray-900">Graphic Design Products & Services</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#9842dc] text-xs font-bold">
                        {graphicProducts.length} items
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Digital & creative design offerings: Custom logos, brand identities, UI/UX, artwork, etc.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openCreateModal("graphic")}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#9842dc] border border-purple-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Graphic Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Product & Category</th>
                      <th className="py-3 px-4 font-semibold">Service Type</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Turnaround</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {graphicProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          No graphic design products found. Click "+ Add Graphic Product" to create one!
                        </td>
                      </tr>
                    ) : (
                      graphicProducts.map((p) => (
                        <tr key={p._id || p.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                              Slug: {p.categorySlug}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#9842dc] border border-purple-200">
                              GRAPHIC
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {p.price || `₹${p.numericPrice || 0}`}
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-xs">
                            {p.turnaround || "48-72 Hours"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {p.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              disabled={deletingId === (p._id || p.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === (p._id || p.id) ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBER OVERVIEW CARDS (Shown for users or when Admin views Member tab) */}
        {(!isAdmin || activeTab === "overview") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Orders */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#9842dc] flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-500 mt-1">
                Track active printing orders, review past shipments, and re-order favorites.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase">Status</span>
                <span className="text-sm font-semibold text-[#9842dc]">No pending orders</span>
              </div>
            </div>

            {/* Card 2: Saved Designs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-[#f54278] flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Saved Designs</h3>
              <p className="text-sm text-gray-500 mt-1">
                Access your custom artwork, visiting card designs, and uploaded logos.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase">Cloud Studio</span>
                <span className="text-sm font-semibold text-[#f54278]">Ready to upload</span>
              </div>
            </div>

            {/* Card 3: Account Profile */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#F06800] flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Account Security</h3>
              <p className="text-sm text-gray-500 mt-1">
                Update your contact preferences, delivery address, and login credentials.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase">Protection</span>
                <span className="text-sm font-semibold text-emerald-600">Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT PRODUCT MODAL (ADMIN ONLY) */}
        {isAdmin && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {modalMode === "create" ? "Create New Product" : "Edit Product Details"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure pricing, turnaround, description, and catalog assignment.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Executive Visiting Cards"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Category Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. visiting-cards or logo-design"
                      value={formData.categorySlug}
                      onChange={(e) =>
                        setFormData({ ...formData, categorySlug: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Service Section *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    >
                      <option value="printing">🖨️ Printing Product</option>
                      <option value="graphic">🎨 Graphic Product</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Display Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="₹499"
                      value={formData.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
                        setFormData({ ...formData, price: val, numericPrice: num });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Turnaround Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2-3 Days"
                      value={formData.turnaround}
                      onChange={(e) =>
                        setFormData({ ...formData, turnaround: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Badge Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller / New / 20% Off"
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about specifications, quality, deliverables..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#f54278]"
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#f54278] focus:ring-[#f54278]"
                    />
                    <span>Active (Visible on Storefront)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#f54278] focus:ring-[#f54278]"
                    />
                    <span>Featured Product</span>
                  </label>
                </div>


                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#F06800] to-[#f54278] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                  >
                    {savingProduct
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create Product"
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
