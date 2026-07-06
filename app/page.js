

import React from 'react';
import Hero from './home/hero';
import Slider from './home/slider';
import Categories from './home/categories';
import Promotions from './home/promotions';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Slider />
      <Categories />
      <Promotions />
    </main>
  );
}

