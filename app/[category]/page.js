import React from 'react';
import { connectDB } from '../lib/mongodb';
import Category from '../models/Category';
import Product from '../models/Product';
import CategoryClientView from './CategoryClientView';

export default async function DynamicCategoryOrServicePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.category;

  await connectDB();

  const categoryDoc = await Category.findOne({
    $or: [
      { slug: slug?.toLowerCase() },
      { id: slug?.toLowerCase() },
    ],
  }).lean();

  const productsDoc = await Product.find({
    categorySlug: slug?.toLowerCase(),
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  const serializedCategory = categoryDoc
    ? JSON.parse(JSON.stringify(categoryDoc))
    : null;

  const serializedProducts = productsDoc
    ? JSON.parse(JSON.stringify(productsDoc))
    : [];

  return (
    <CategoryClientView
      category={serializedCategory}
      slug={slug}
      initialProducts={serializedProducts}
    />
  );
}
