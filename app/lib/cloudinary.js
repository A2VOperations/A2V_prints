// app/lib/cloudinary.js
let cloudinaryInstance = null;

function getCloudinary() {
  // Protect against invalid CLOUDINARY_URL (e.g. browser console links like https://...) before requiring the SDK
  if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
    console.warn("Warning: CLOUDINARY_URL in .env is invalid (should start with 'cloudinary://', not 'https://'). Using CLOUDINARY_CLOUD_NAME instead.");
    delete process.env.CLOUDINARY_URL;
  }

  if (!cloudinaryInstance) {
    const { v2 } = require("cloudinary");
    cloudinaryInstance = v2;
  }

  // Always re-configure with the freshest process.env credentials to prevent stale caching during hot reloads
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
    cloudinaryInstance.config({
      secure: true,
    });
  } else if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinaryInstance.config({
      cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
      api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
      api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
      secure: true,
    });
  }
  return cloudinaryInstance;
}

export async function uploadToCloudinary(fileData, folder = "a2v_graphics") {
  const cloudinary = getCloudinary();

  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary credentials not found in .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Using local fallback.");
    if (typeof fileData === "string" && fileData.startsWith("data:")) {
      return { secure_url: fileData, public_id: `local-${Date.now()}` };
    }
    throw new Error("Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file to enable Cloudinary cloud storage.");
  }

  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (error.http_code === 403 || error.http_code === 401 || (error.message && error.message.includes("403"))) {
      throw new Error(`Cloudinary Auth Error (${error.http_code || 403}): The CLOUDINARY_CLOUD_NAME ('${process.env.CLOUDINARY_CLOUD_NAME}'), API_KEY, and API_SECRET in .env do not match. Please verify your exact lowercase Cloud Name on the Cloudinary Dashboard.`);
    }
    throw error;
  }
}

export default getCloudinary;
