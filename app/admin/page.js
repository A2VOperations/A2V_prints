// app/admin/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    async function initAdmin() {
      try {
        const authRes = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        const authData = await authRes.json();
        if (!authData.user) {
          router.push("/login");
          return;
        }
        if (authData.user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setCurrentUser(authData.user);

        // Fetch users & stats
        const [usersRes, productsRes, categoriesRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        }

        const prodData = productsRes.ok ? await productsRes.json() : [];
        const catData = categoriesRes.ok ? await categoriesRes.json() : [];
        setStats({
          products: Array.isArray(prodData) ? prodData.length : 0,
          categories: Array.isArray(catData) ? catData.length : 0,
        });

      } catch (err) {
        console.error("Admin init error:", err);
      } finally {
        setLoading(false);
      }
    }
    initAdmin();
  }, [router]);

  async function handleToggleRole(targetUser) {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setUpdatingId(targetUser._id);
    try {
      const res = await fetch(`/api/users/${targetUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error("Failed to update user role:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#f54278]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-600 font-medium">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F06800] via-[#f54278] to-[#9842dc] text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Admin Control Portal
                </h1>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-semibold uppercase tracking-wide">
                  Superadmin
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Manage users, system configurations, and printing catalog operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gray-700/80 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-all border border-gray-600"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F06800] to-[#f54278] hover:opacity-90 text-white text-sm font-semibold shadow-md transition-all"
            >
              Storefront
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Users</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-3xl font-extrabold text-white">{users.length}</h3>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catalog Products</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-3xl font-extrabold text-white">{stats.products}</h3>
              <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">Store items</span>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-3xl font-extrabold text-white">{stats.categories}</h3>
              <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Services</span>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Status</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-xl font-extrabold text-emerald-400">Operational</h3>
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700 pb-6">
            <div>
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <p className="text-sm text-gray-400 mt-1">
                View registered customers, assign administrator permissions, or remove accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Joined</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                          {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        {u.name}
                      </td>
                      <td className="py-4 px-4 text-gray-300">{u.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin"
                              ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                        >
                          {u.role ? u.role.toUpperCase() : "USER"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={updatingId === u._id}
                          className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {updatingId === u._id
                            ? "Updating..."
                            : u.role === "admin"
                              ? "Make User"
                              : "Promote Admin"}
                        </button>
                        {u.email !== currentUser.email && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
