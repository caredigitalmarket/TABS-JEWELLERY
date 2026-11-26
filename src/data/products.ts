export type JewelryCategory = 'All' | 'Necklaces' | 'Earrings' | 'Rings' | 'Bracelets';

export interface JewelryProduct {
  id: string;
  name: string;
  category: Exclude<JewelryCategory, 'All'>;
  material: string;
  gemstone?: string;
  pricePkr: number;
  priceUsd: number;
  weightGrams: string;
  variants: string[];
  availability: 'In Stock' | 'Made to Order' | 'Limited Run';
  featuredRank: number;
  image: string;
  description: string;
  craftNote: string;
}

export const STORE_INFO = {
  name: 'TABS jewellery',
  phone: '03375277606',
  phoneHref: 'tel:03375277606',
  whatsappHref: 'https://wa.me/923375277606',
  hours: 'Mon – Sat · 11:00 AM – 8:30 PM',
  freeDeliveryThresholdPkr: 25000,
  deliveryFeePkr: 450,
};

export const PRODUCTS: JewelryProduct[] = [
  {
    id: 'soleil-layered-chain-suite',
    name: 'Soleil Layered Chain Suite',
    category: 'Necklaces',
    material: '18k Yellow Gold Vermeil',
    pricePkr: 48500,
    priceUsd: 175,
    weightGrams: '24.6g',
    variants: ['16" + 18" Duo', '18" + 20" Duo', 'Full 4-Chain Set'],
    availability: 'In Stock',
    featuredRank: 1,
    image: '/assets/jewelry/gold_chains.jpg',
    description:
      'Architectural box-link, paperclip, and rope chains crafted to layer effortlessly or wear solo with warm satin sheen.',
    craftNote: 'Hand-soldered lobster clasps with 2-inch extender links for tailored neckline framing.',
  },
  {
    id: 'torsade-twisted-hoops',
    name: 'Torsade Twisted Hoops',
    category: 'Earrings',
    material: '18k Solid Gold Plated',
    pricePkr: 18900,
    priceUsd: 68,
    weightGrams: '9.2g',
    variants: ['22mm Everyday', '28mm Statement'],
    availability: 'In Stock',
    featuredRank: 2,
    image: '/assets/jewelry/gold_hoops.jpg',
    description:
      'Sculptural braided rope hoops hollow-cast for featherlight all-day comfort and high-polish light reflection.',
    craftNote: 'Click-top hinge closure engineered for secure, snag-free wear.',
  },
  {
    id: 'vespera-rose-gold-suite',
    name: 'Vespera Rose Gold Cuff & Pendant',
    category: 'Bracelets',
    material: '18k Rose Gold',
    gemstone: 'Morganite & Pavé Crystal',
    pricePkr: 36000,
    priceUsd: 130,
    weightGrams: '16.4g',
    variants: ['Small (15.5cm)', 'Medium (17cm)', 'Adjustable Open Cuff'],
    availability: 'Limited Run',
    featuredRank: 3,
    image: '/assets/jewelry/rose_gold_suite.jpg',
    description:
      'Warm rose-gold open cuff paired with twin diamond-cut medallions, balanced for sunlit evening and bridal wear.',
    craftNote: 'Micro-pavé stones hand-set under 20x magnification for lasting brilliance.',
  },
  {
    id: 'lumiere-cushion-halo-pendant',
    name: 'Lumière Cushion Halo Pendant',
    category: 'Necklaces',
    material: '18k Rose Gold',
    gemstone: 'Cushion-Cut White Topaz',
    pricePkr: 29500,
    priceUsd: 106,
    weightGrams: '7.8g',
    variants: ['16" Snake Chain', '18" Snake Chain'],
    availability: 'In Stock',
    featuredRank: 4,
    image: '/assets/jewelry/cushion_halo_pendant.jpg',
    description:
      'A luminous cushion-cut center stone framed by a double pavé halo suspended from a fluid rounded herringbone chain.',
    craftNote: 'Open gallery basket maximizes light entry from beneath the pavilion.',
  },
  {
    id: 'celeste-crescent-sapphire-duo',
    name: 'Celeste Crescent & Topaz Duo',
    category: 'Necklaces',
    material: '18k Yellow Gold',
    gemstone: 'London Blue Topaz',
    pricePkr: 32400,
    priceUsd: 118,
    weightGrams: '11.4g',
    variants: ['18" Crescent Only', '16" + 20" Layered Duo'],
    availability: 'In Stock',
    featuredRank: 5,
    image: '/assets/jewelry/crescent_pendants.jpg',
    description:
      'Deep octagonal blue topaz paired with a hand-engraved crescent talisman set with subtle star-flush accents.',
    craftNote: 'Antiqued satin finish resists hairline marks while deepening golden warmth.',
  },
  {
    id: 'riviere-pearl-solitaire-drop',
    name: 'Rivière Pearl & Solitaire Drop',
    category: 'Necklaces',
    material: '18k Gold & Freshwater Pearl',
    gemstone: 'Cultured Pearls & Zircon',
    pricePkr: 39000,
    priceUsd: 142,
    weightGrams: '18.1g',
    variants: ['16" Choker Length', '18" Princess Length'],
    availability: 'In Stock',
    featuredRank: 6,
    image: '/assets/jewelry/pearl_crystal_pendant.jpg',
    description:
      'Lustrous hand-knotted freshwater pearls accented by solid gold spacer beads and a pear-drop crystal heirloom pendant.',
    craftNote: 'Double-knotted on natural silk thread with 18k gold bead separators.',
  },
  {
    id: 'aurelia-pave-heart-stack-ring',
    name: 'Aurelia Pavé Heart Stack Ring',
    category: 'Rings',
    material: '18k Yellow Gold',
    gemstone: 'Pavé White Diamond Simulant',
    pricePkr: 26800,
    priceUsd: 96,
    weightGrams: '6.5g',
    variants: ['US 5', 'US 6', 'US 7', 'US 8'],
    availability: 'In Stock',
    featuredRank: 7,
    image: '/assets/jewelry/pave_heart_ring.jpg',
    description:
      'Three interlocking ribbed and pavé-set bands crowned with a sculptural heart silhouette designed for stacking or solo statement.',
    craftNote: 'Comfort-fit inner shank prevents pinching across multi-band wear.',
  },
  {
    id: 'azurite-chandelier-earrings',
    name: 'Azurite Botanical Chandelier Drops',
    category: 'Earrings',
    material: 'Rhodium-Plated 925 Silver',
    gemstone: 'Pear-Cut Sapphire Crystal',
    pricePkr: 24200,
    priceUsd: 88,
    weightGrams: '13.0g',
    variants: ['Standard Post Back'],
    availability: 'Limited Run',
    featuredRank: 8,
    image: '/assets/jewelry/sapphire_earrings.jpg',
    description:
      'Art-deco inspired geometric frame enclosing a vivid pear-cut royal sapphire center stone with baguette crystal borders.',
    craftNote: 'Hypoallergenic sterling posts with wide comfort disc backs for balanced support.',
  },
  {
    id: 'mirasol-y-lariat-bracelet',
    name: 'Mirasol Fine Lariat & Bracelet Set',
    category: 'Bracelets',
    material: '14k Champagne Gold',
    gemstone: 'Bezel White Topaz',
    pricePkr: 34500,
    priceUsd: 125,
    weightGrams: '8.9g',
    variants: ['Standard 17cm + 18" Lariat', 'Bracelet Only'],
    availability: 'In Stock',
    featuredRank: 9,
    image: '/assets/jewelry/layered_necklaces.jpg',
    description:
      'Delicate twin-chain bracelet and cascading Y-lariat set punctuated by minimalist bezel-set stones that catch subtle light.',
    craftNote: 'Low-profile bezels stay flush against skin without catching on fine knits.',
  },
  {
    id: 'valkyrie-sculpted-silver-stack',
    name: 'Valkyrie Sculpted Signet Stack',
    category: 'Rings',
    material: '925 Sterling Silver',
    pricePkr: 19500,
    priceUsd: 70,
    weightGrams: '14.2g',
    variants: ['US 6', 'US 7', 'US 8', 'US 9'],
    availability: 'In Stock',
    featuredRank: 10,
    image: '/assets/jewelry/silver_rings.jpg',
    description:
      'Liquid-mirror domed signet paired with crossed architectural bands in solid hallmarked 925 sterling silver.',
    craftNote: 'Mirror-lapped by hand and coated with anti-tarnish rhodium veil.',
  },
  {
    id: 'rubellite-solitaire-cocktail-ring',
    name: 'Rubellite Solitaire Cocktail Ring',
    category: 'Rings',
    material: 'Platinum-Plated Silver',
    gemstone: 'Emerald-Cut Pink Tourmaline',
    pricePkr: 44000,
    priceUsd: 160,
    weightGrams: '8.4g',
    variants: ['US 5', 'US 6', 'US 7', 'US 8'],
    availability: 'Made to Order',
    featuredRank: 11,
    image: '/assets/jewelry/ruby_ring.jpg',
    description:
      'Vibrant rose-rubellite step-cut centerpiece mounted above delicate pavé gallery shoulders for evening elegance.',
    craftNote: 'Individually claw-pronged to showcase clean step-cut facets.',
  },
  {
    id: 'petite-charm-trio-necklaces',
    name: 'Petite Charm Trio Necklaces',
    category: 'Necklaces',
    material: '18k Gold Vermeil',
    pricePkr: 21500,
    priceUsd: 78,
    weightGrams: '5.4g',
    variants: ['16" Single Chain', '16" + 18" + 20" Trio'],
    availability: 'In Stock',
    featuredRank: 12,
    image: '/assets/jewelry/dainty_gold_necklaces.jpg',
    description:
      'Feather-light cable chains carrying heirloom miniature charms designed for effortless everyday layering.',
    craftNote: 'Tarnish-resistant 2.5-micron 18k gold layer over recycled sterling core.',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Ayesha Kamran',
    city: 'Lahore',
    piece: 'Soleil Layered Chain Suite',
    quote:
      'Ordered by phone for my sister’s engagement. The weight and warm tone of the chains looked identical to solid 22k pieces, and delivery arrived in 24 hours.',
  },
  {
    name: 'Zainab Tariq',
    city: 'Karachi',
    piece: 'Torsade Twisted Hoops',
    quote:
      'Most statement hoops pull on the ear after an hour. These feel weightless all day at the studio and still look brand new after four months.',
  },
  {
    name: 'Maham Siddiqui',
    city: 'Islamabad',
    piece: 'Rivière Pearl & Solitaire Drop',
    quote:
      'Called 03375277606 to confirm choker sizing before checkout—received photos on WhatsApp within minutes and custom clasp adjustment at no extra fee.',
  },
];

export function formatPrice(product: Pick<JewelryProduct, 'pricePkr' | 'priceUsd'>, currency: 'PKR' | 'USD'): string {
  if (currency === 'USD') {
    return `$${product.priceUsd.toLocaleString('en-US')}`;
  }
  return `PKR ${product.pricePkr.toLocaleString('en-US')}`;
}

export function formatAmount(amountPkr: number, currency: 'PKR' | 'USD'): string {
  if (currency === 'USD') {
    const usd = Math.round(amountPkr / 278);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return `PKR ${amountPkr.toLocaleString('en-US')}`;
}
