import React from 'react';
import { connectDB } from '../../lib/mongodb';
import Category from '../../models/Category';
import Product from '../../models/Product';
import ProductDetail from '../../components/ProductDetail';

export default async function DynamicProductPage({ params }) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams?.category;
  const productId = resolvedParams?.id;

  await connectDB();

  const catDoc = await Category.findOne({
    $or: [
      { slug: categoryKey?.toLowerCase() },
      { id: categoryKey?.toLowerCase() },
    ],
  }).lean();

  const numVal = !isNaN(Number(productId)) ? Number(productId) : null;
  const idConditions = [
    { id: String(productId) },
    { slug: productId?.toLowerCase() },
  ];
  if (numVal !== null) {
    idConditions.push({ numericId: numVal });
  }

  let prodDoc = null;
  if (categoryKey) {
    prodDoc = await Product.findOne({
      categorySlug: categoryKey.toLowerCase(),
      $or: idConditions,
    }).lean();
  }
  if (!prodDoc) {
    prodDoc = await Product.findOne({
      $or: idConditions,
    }).lean();
  }

  const recsQuery = {
    isActive: true,
  };

  if (categoryKey) {
    recsQuery.categorySlug = categoryKey.toLowerCase();
  }

  if (prodDoc && prodDoc._id) {
    recsQuery._id = { $ne: prodDoc._id };
  }

  const recsDoc = await Product.find(recsQuery).limit(4).lean();

  const serializedCategory = catDoc ? JSON.parse(JSON.stringify(catDoc)) : null;
  const serializedProduct = prodDoc ? JSON.parse(JSON.stringify(prodDoc)) : null;
  const serializedRecs = recsDoc ? JSON.parse(JSON.stringify(recsDoc)) : [];

  return (
    <ProductDetail
      category={categoryKey}
      id={productId}
      initialCategory={serializedCategory}
      initialProduct={serializedProduct}
      initialRecommendations={serializedRecs}
    />
  );
}
