// lib/mongodb.js
import mongoose from "mongoose";
import dns from "dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env or .env.local"
  );
}

function ensureCustomDNS() {
  if (MONGODB_URI && MONGODB_URI.startsWith("mongodb+srv://")) {
    try {
      const currentServers = dns.getServers();
      const fallbackServers = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];
      // Prepend public DNS resolvers to ensure SRV record queries succeed when local DNS refuses querySrv
      const combined = Array.from(new Set([...fallbackServers, ...currentServers]));
      dns.setServers(combined);
    } catch (e) {
      console.warn("Could not set custom DNS servers:", e.message);
    }
  }
}

ensureCustomDNS();

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    ensureCustomDNS();
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}