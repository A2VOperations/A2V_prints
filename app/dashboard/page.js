// app/dashboard/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // orders | designs | security

  useEffect(() => {
    async function checkAuthAndLoadOrders() {
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

        // If user is an admin, do NOT show user dashboard -> redirect to /admin
        if (data.user.role === "admin") {
          router.push("/admin");
          return;
        }

        setUser(data.user);

        // Load user's live orders from MongoDB
        try {
          const ordersRes = await fetch("/api/orders");
          if (ordersRes.ok) {
            const ordData = await ordersRes.json();
            setOrders(ordData.data || []);
          }
        } catch (e) {
          console.error("Failed fetching user orders:", e);
        } finally {
          setLoadingOrders(false);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoadOrders();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.dispatchEvent(new Event("auth-change"));
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f5f6fb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#9842dc] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm">Loading your member dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f6fb] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Profile Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F06800] via-[#f54278] to-[#9842dc] text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Welcome, {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Active Member
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/visiting-cards"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F06800] to-[#f54278] text-white text-sm font-semibold shadow-sm hover:opacity-95 transition-all"
            >
              Start New Print Order
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2 px-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "orders"
                ? "border-[#9842dc] text-[#9842dc]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("designs")}
            className={`pb-2 px-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "designs"
                ? "border-[#9842dc] text-[#9842dc]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Saved Designs
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-2 px-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "security"
                ? "border-[#9842dc] text-[#9842dc]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Account Security
          </button>
        </div>

        {/* TAB 1: MY ORDERS (LIVE FROM MONGODB) */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Your Print Order History</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Real-time status tracking directly connected to the A2V production team.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#9842dc] text-xs font-bold border border-purple-100">
                ⚡ Future Payment Gateway Ready
              </span>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-gray-400 text-sm">Loading orders from MongoDB...</div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Ordered Products</th>
                      <th className="py-4 px-6">Order Date</th>
                      <th className="py-4 px-6">Live Status</th>
                      <th className="py-4 px-6">Payment</th>
                      <th className="py-4 px-6 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => {
                      const oid = ord.orderId || ord.id || ord._id;
                      return (
                        <tr key={oid} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#9842dc]">{oid}</td>
                          <td className="py-4 px-6 text-gray-800 max-w-sm">
                            <p className="font-semibold text-gray-900 truncate">
                              {(() => {
                                let txt = ord.itemsSummary || "";
                                if (txt.includes("undefined") || !txt) {
                                  if (Array.isArray(ord.items) && ord.items.length > 0) {
                                    const names = ord.items
                                      .map((i) => i.name || i.title || i.productName)
                                      .filter((n) => n && n !== "undefined");
                                    if (names.length > 0) return names.join(", ");
                                  }
                                  return "Premium Visiting Cards (Custom Print)";
                                }
                                return txt;
                              })()}
                            </p>
                            {ord.items && Array.isArray(ord.items) && ord.items.length > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {ord.items.map((i) => i.name || i.title || "Custom Print Item").filter((n) => n && n !== "undefined").join(" + ")}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-xs">
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString()
                              : "Recently"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ord.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ord.status === "Printing"
                                  ? "bg-amber-100 text-amber-800"
                                  : ord.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {ord.status || "Processing"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                              {ord.paymentStatus || "Pending"} (Gateway Ready)
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold text-gray-900">
                            ₹{Number(ord.total || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-[#9842dc] flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">No print orders yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    Once you place an order, you can track production, shipment, and re-order items right here.
                  </p>
                </div>
                <Link
                  href="/visiting-cards"
                  className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#F06800] to-[#f54278] text-white font-bold text-sm shadow-sm hover:opacity-95"
                >
                  Browse Catalog & Place Order
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED DESIGNS */}
        {activeTab === "designs" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm text-center space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Your Cloud Studio Designs</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Custom vector artwork, visiting card layouts, and uploaded brand assets will appear here.
            </p>
            <Link
              href="/graphic-services"
              className="inline-block px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm"
            >
              Upload Artwork to Studio
            </Link>
          </div>
        )}

        {/* TAB 3: ACCOUNT SECURITY */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm space-y-4 max-w-xl">
            <h3 className="text-lg font-bold text-gray-900">Account Profile & Security</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Full Name</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email Address</span>
                <span className="font-semibold text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Role Privilege</span>
                <span className="font-semibold text-emerald-600 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-[#9842dc] via-[#f54278] to-[#F06800] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Need Custom Artwork or Logo Identity?</h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">
              Work directly with our design studio professionals to craft print-ready vector artwork tailored for your brand.
            </p>
          </div>
          <Link
            href="/graphic-services"
            className="px-6 py-3 rounded-xl bg-white text-gray-900 font-bold text-sm shadow-md hover:bg-gray-50 transition-all shrink-0"
          >
            Explore Design Services
          </Link>
        </div>
      </div>
    </div>
  );
}
