

import React from 'react';
import Hero from './home/hero';
import Slider from './home/slider';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Slider />
    </main>
  );
}

