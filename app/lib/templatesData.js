// app/lib/templatesData.js

export const categoryTemplateMap = {
  'visiting-cards': {
    name: 'Visiting Cards',
    description: 'Check out a variety of designs for business cards. Find a look that fits your business – and your style.',
    basePrice: '₹200.00',
    unitPriceText: '₹2.00 each / 100 units',
    rating: '4.7 (1,519)',
    size: '85mm x 55mm (3.5" x 2") Standard Card',
    hasBackSide: true,
    filterOptions: {
      color: ['Black', 'Blue', 'Gold', 'Red', 'Green', 'White', 'Multi'],
      orientation: ['Horizontal', 'Vertical', 'Square'],
      corners: ['Standard', 'Rounded'],
      stock: ['Standard Matte', 'Premium Glossy', 'Ultra Thick 350 GSM', 'Textured Cotton'],
      finish: ['Matte', 'Glossy', 'Gold Foil Accent', 'Spot UV Effect'],
      industry: ['Corporate & Executive', 'Creative & Design', 'Medical & Healthcare', 'Food & Restaurant', 'Salon & Spa', 'Real Estate', 'Education & Coaching', 'Retail & E-commerce'],
      style: ['Minimalist', 'Bold & Modern', 'Elegant & Luxury', 'Geometric', 'Vintage & Classic'],
      logoArea: ['With Photo Area', 'With Logo Space', 'Text Only Layout'],
      useCase: ['Networking & Business', 'Appointment & Loyalty', 'Corporate ID', 'Event Pass']
    },
    templates: []
  },
  'custom-tshirts': {
    name: 'Custom T-Shirts & Apparel',
    description: 'Explore trendy and professional graphic artwork templates for custom printed t-shirts, polo jerseys, and merchandise.',
    basePrice: '₹349.00',
    unitPriceText: '₹349.00 / shirt (Discounts on bulk)',
    rating: '4.8 (984)',
    size: 'Front Chest / Back Area: 10" x 12" Standard',
    hasBackSide: false,
    filterOptions: {
      color: ['Black', 'White', 'Navy Blue', 'Red', 'Olive Green', 'Mustard', 'Heather Grey'],
      orientation: ['Front Print Only', 'Back Print Only', 'Front & Back Combo', 'Pocket Logo'],
      corners: ['Crew Neck Regular', 'Oversized Fit', 'Polo Collar Fit'],
      stock: ['180 GSM 100% Cotton', '220 GSM Heavy French Terry', 'Bio-Washed Combed Cotton'],
      finish: ['Screen Print', 'DTF High-Definition', 'Puff 3D Emboss Print', 'Premium Embroidery'],
      industry: ['Casual & Streetwear', 'Corporate Team Uniform', 'College & University Fest', 'Gym & Fitness', 'Music & Events', 'Sports & E-sports'],
      style: ['Typography & Quotes', 'Retro & Vintage', 'Minimalist Logo', 'Abstract & Aesthetic', 'Anime & Illustration'],
      logoArea: ['Full Chest Artwork', 'Left Pocket Crest', 'Large Back Graphic'],
      useCase: ['Corporate Gifting', 'Merchandise Sales', 'Event Staff Uniform', 'Personal Style']
    },
    templates: []
  },
  'banner-poster': {
    name: 'Banner & Poster Printing',
    description: 'High-visibility display templates for retail store promotions, corporate events, exhibition roll-up stands, and real estate hoardings.',
    basePrice: '₹499.00',
    unitPriceText: '₹499.00 / Banner (Standard 4x2 ft)',
    rating: '4.8 (812)',
    size: 'Standard Banner (3ft x 6ft) / A3 Poster (11.7" x 16.5")',
    hasBackSide: false,
    filterOptions: {
      color: ['Red & Yellow Promo', 'Blue & White Corporate', 'Black & Gold Luxury', 'Green Eco Theme', 'Vibrant Multi'],
      orientation: ['Horizontal Outdoor Flex', 'Vertical Roll-up Stand', 'Square Backdrop Panel'],
      corners: ['Metal Eyelets & Grommets', 'Pole Pockets', 'Wooden Frame Mount', 'Self-Adhesive Back'],
      stock: ['Heavy-Duty 340 GSM Flex', 'Star Backlit Vinyl Flex', 'Exhibition Satin Fabric', 'Photo-Grade Poster Paper'],
      finish: ['UV Weatherproof Gloss', 'Anti-Glare Matte Finish', 'High-Res Solvent Print'],
      industry: ['Retail Sale & Offer', 'Corporate Exhibition & Conference', 'Real Estate & Property', 'Grand Opening Event', 'Food & Restaurant Menu', 'Coaching & Education Admission'],
      style: ['High Impact Sale', 'Professional & Clean', 'Modern Minimalist', 'Photo & Product Showcase'],
      logoArea: ['Header Logo Space', 'Full Center Banner', 'Multi-Partner Sponsor Footer'],
      useCase: ['Outdoor Store Hoarding', 'Indoor Exhibition Booth', 'Event Photo Backdrop', 'Street Promotion']
    },
    templates: []
  },
  'flex-board': {
    name: 'Flex Board & Signage',
    description: 'Durable weather-resistant glow sign boards, shopfront frontlit boards, and 3D acrylic LED templates.',
    basePrice: '₹650.00',
    unitPriceText: '₹650.00 / sq. mt (With frame options)',
    rating: '4.8 (645)',
    size: 'Standard Storefront Board (4ft x 8ft)',
    hasBackSide: false,
    filterOptions: {
      color: ['Bright LED White', 'Golden Glow', 'Royal Blue', 'Deep Red', 'Emerald Green'],
      orientation: ['Horizontal Shopfront', 'Vertical Pillar Sign', 'Projecting Blade Board'],
      corners: ['Heavy Iron Box Frame', '3D Acrylic Letters', 'Aluminum Border Frame', 'Backlit Glow Box'],
      stock: ['Frontlit Weatherproof Vinyl', 'Backlit Star Flex', 'Sunboard Vinyl Panel', '3D Raised Acrylic Lettering'],
      finish: ['UV Protected Gloss', 'LED Backlit Glow', 'Reflective Night-Glow'],
      industry: ['Medical Pharmacy Store', 'Supermarket & Grocery', 'Restaurant & Cafe Front', 'Jewelry & Fashion Boutique', 'Automotive & Workshop', 'Hardware & Electronics'],
      style: ['Modern LED Glow', 'Bold & High Visibility', 'Classic Framed', 'Minimalist Luxury'],
      logoArea: ['Prominent Center Emblem', 'Left Aligned Icon', 'Full Width Typography'],
      useCase: ['Storefront Main Board', 'Highway Guidance Sign', 'Indoor Reception Crest', 'Roof Top Hoarding']
    },
    templates: []
  },
  'packaging-labeling': {
    name: 'Packaging, Boxes & Stickers',
    description: 'Custom corrugated boxes, product labels, waterproof stickers, Kraft paper bags, and luxury rigid gift boxes.',
    basePrice: '₹150.00',
    unitPriceText: '₹1.50 each / 100 stickers or labels',
    rating: '4.9 (734)',
    size: 'Custom Die-Cut Box / 3" x 3" Stickers',
    hasBackSide: false,
    filterOptions: {
      color: ['Kraft Brown Natural', 'Minimalist White & Black', 'Gold Foil & Navy', 'Pastel Pink & Cream', 'Bright Eco Green'],
      orientation: ['Bottle / Jar Label', 'Box Packaging Template', 'Shopping Bag Layout', 'Die-Cut Sticker'],
      corners: ['Square Cut', 'Round Corner Sticker', 'Die-Cut Custom Shape', 'Pouch Layout'],
      stock: ['Waterproof Vinyl Sticker', 'Corrugated E-Flute Box', 'Kraft Paper Shopping Bag', 'Art Paper Label', 'Luxury Rigid Cardboard'],
      finish: ['Matte Lamination', 'High Gloss Finish', 'Gold / Silver Hot Stamping', 'Embossed Texture'],
      industry: ['Organic & Gourmet Food', 'Cosmetics & Skincare', 'E-Commerce & D2C Shipping', 'Artisanal Bakery & Cafe', 'Perfume & Luxury Gifts', 'Pharmaceuticals'],
      style: ['Minimalist & Organic', 'Luxury Foil Accent', 'Bold D2C Branding', 'Handmade & Craft'],
      logoArea: ['Center Brand Emblem', 'Top Flap Logo', 'Wrap-Around Banner'],
      useCase: ['Product Jar & Bottle', 'Shipping Box & Mailer', 'Retail Bag Gifting', 'Brand Seal & Tag']
    },
    templates: []
  },
  'mugs-drinkware': {
    name: 'Custom Mugs & Drinkware',
    description: 'Personalized ceramic coffee mugs, insulated travel tumblers, magic photo reveal mugs, and corporate branded flasks.',
    basePrice: '₹199.00',
    unitPriceText: '₹199.00 / Ceramic Mug (11 oz)',
    rating: '4.8 (521)',
    size: 'Wraparound Print Area (8.5" x 3.5" / 330ml Mug)',
    hasBackSide: false,
    filterOptions: {
      color: ['Glossy White', 'Matte Black', 'Inside Color Rim', 'Magic Black Reveal', 'Metallic Silver'],
      orientation: ['Full Wrap Around Print', 'Front & Back Logo', 'Single Side Photo'],
      corners: ['11 oz Standard Mug', '15 oz Large Mug', 'Insulated Steel Flask', 'Travel Sipper Mug'],
      stock: ['High-Grade White Ceramic', 'Color Changing Magic Ceramic', 'Food-Grade Stainless Steel'],
      finish: ['Sublimation High-Gloss', 'Laser Engraved Metallic', 'Matte Ceramic Finish'],
      industry: ['Corporate Employee Gift', 'Anniversary & Birthday Gift', 'Cafe & Restaurant Serveware', 'Souvenir & Merchandise'],
      style: ['Motivational Quote', 'Company Logo Branding', 'Photo Collage', 'Minimalist Typography'],
      logoArea: ['Full Wrap Artwork', 'Center Front Emblem', 'Double Sided Crest'],
      useCase: ['Office Desk Mug', 'Gift Box Combo', 'Event Giveaways', 'Daily Coffee Mug']
    },
    templates: []
  },
  'hoodies-jackets': {
    name: 'Hoodies & Winterwear',
    description: 'Premium heavy fleece hoodies, zipper jackets, varsity jackets, and sweatshirts with high-density puff print and embroidery.',
    basePrice: '₹799.00',
    unitPriceText: '₹799.00 / Hoodie (320 GSM Brushed Fleece)',
    rating: '4.9 (480)',
    size: 'Front Chest / Back Area: 12" x 14" Standard',
    hasBackSide: false,
    filterOptions: {
      color: ['Jet Black', 'Heather Grey', 'Navy Blue', 'Forest Green', 'Maroon Red', 'Beige Cream'],
      orientation: ['Chest Crest + Back Graphic', 'Sleeve Embroidery Only', 'Front Kangaroo Pocket Logo'],
      corners: ['Pullover Hoodie Regular Fit', 'Oversized Streetwear Hoodie', 'Zip-Up Winter Jacket', 'Varsity College Jacket'],
      stock: ['320 GSM 100% Cotton Fleece', '400 GSM Ultra-Heavy Winter Fleece', 'Polyester Windbreaker Fabric'],
      finish: ['3D Puff Emboss Print', 'Premium Chenille & Embroidery', 'High-Density DTF Print'],
      industry: ['Streetwear Fashion Brand', 'University & College Varsity', 'Corporate Winter Uniform', 'Sports & Athlete Club'],
      style: ['Minimalist Chest Logo', 'Bold Back Artwork', 'Varsity & Letterman Style', 'Typography & Slogans'],
      logoArea: ['Full Back Graphic', 'Left Chest Emblem', 'Both Sleeve & Back'],
      useCase: ['Premium Winter Wear', 'Team & Club Apparel', 'Merchandise Drop', 'Corporate Executive Gift']
    },
    templates: []
  }
};

export const getAllTemplates = () => {
  const all = [];
  Object.keys(categoryTemplateMap).forEach((slug) => {
    const cat = categoryTemplateMap[slug];
    (cat.templates || []).forEach((t) => {
      all.push({
        ...t,
        frontImage: t.frontImage || t.image,
        backImage: t.backImage || t.frontImage || t.image,
        price: t.price || cat.basePrice || "₹200.00",
        unitPrice: t.unitPrice || cat.unitPriceText || "₹2.00 each / 100 units",
        size: t.size || cat.size,
        hasBackSide: cat.hasBackSide,
        categorySlug: slug,
        categoryName: cat.name
      });
    });
  });
  return all;
};

export const getCategoryTemplates = (slug) => {
  if (slug === 'all' || !categoryTemplateMap[slug]) {
    return getAllTemplates();
  }
  const cat = categoryTemplateMap[slug];
  return (cat.templates || []).map((t) => ({
    ...t,
    frontImage: t.frontImage || t.image,
    backImage: t.backImage || t.frontImage || t.image,
    price: t.price || cat.basePrice || "₹200.00",
    unitPrice: t.unitPrice || cat.unitPriceText || "₹2.00 each / 100 units",
    size: t.size || cat.size,
    hasBackSide: cat.hasBackSide,
    categorySlug: slug,
    categoryName: cat.name
  }));
};
