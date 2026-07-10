// app/lib/productService.js
import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";

/**
 * Backend service to retrieve products strictly from MongoDB
 */
export async function getProducts(filter = {}) {
  try {
    await connectDB();
    const query = { isActive: true };

    if (filter.categorySlug && filter.categorySlug !== "all") {
      query.categorySlug = filter.categorySlug.toLowerCase();
    }
    if (filter.serviceType && filter.serviceType !== "all") {
      query.serviceType = filter.serviceType.toLowerCase();
    }
    if (filter.badge && filter.badge !== "all") {
      query.badge = new RegExp(`^${filter.badge}$`, "i");
    }
    if (filter.search && filter.search.trim() !== "") {
      const regex = new RegExp(filter.search.trim(), "i");
      query.$or = [
        { name: regex },
        { title: regex },
        { desc: regex },
        { description: regex },
        { id: regex },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return products || [];
  } catch (error) {
    console.error("MongoDB query failed:", error.message);
    return [];
  }
}

/**
 * Backend service to retrieve a single product by ID or Slug strictly from MongoDB
 */
export async function getProductById(idOrSlug) {
  try {
    await connectDB();
    let product = await Product.findOne({ id: idOrSlug }).lean();
    if (!product && idOrSlug && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).lean();
    }
    return product || null;
  } catch (error) {
    console.error("MongoDB single product lookup failed:", error.message);
    return null;
  }
}
