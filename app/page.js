

import React from 'react';
import Hero from './home/hero';
import Slider from './home/slider';
import PrintingCategories from './home/printingCategories';
import GraphicCategories from './home/graphicCategories';
import Promotions from './home/promotions';
import PreviewProducts from './home/previewProducts';
import HomeFaqs from './home/faqs';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Slider />
      <PrintingCategories />
      <GraphicCategories />
      <PreviewProducts slug="visiting-cards" bgClassName="bg-slate-50/50" />
      <Promotions />
      <PreviewProducts slug="custom-tshirts" bgClassName="bg-white" />
      <PreviewProducts slug="banner-poster" bgClassName="bg-slate-50/50" />
      <PreviewProducts slug="packaging-labeling" bgClassName="bg-white" />
      <PreviewProducts slug="mugs-drinkware" bgClassName="bg-slate-50/50" />
      <PreviewProducts slug="hoodies-jackets" bgClassName="bg-white" />
      <HomeFaqs />
    </main>
  );
}



