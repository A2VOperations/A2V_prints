import React from 'react';
import TemplateCategoryClient from '../components/TemplateCategoryClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.id || 'visiting-cards';
  const formattedName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${formattedName} Designs & Templates | A2V Prints`,
    description: `Check out a variety of professional designs for ${formattedName}. Find a look that fits your business and style.`
  };
}

export default async function DynamicTemplateCategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams?.id || 'visiting-cards';

  return <TemplateCategoryClient categoryId={categoryId} />;
}
