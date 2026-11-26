import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ResilientImage } from './components/ResilientImage';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import {
  JewelryCategory,
  JewelryProduct,
  PRODUCTS,
  STORE_INFO,
  TESTIMONIALS,
  formatPrice,
  publicAssetUrl,
} from './data/products';

const CATEGORIES: JewelryCategory[] = [
  'All',
  'Necklaces',
  'Earrings',
  'Rings',
  'Bracelets',
];

type SortOption = 'featured' | 'price-asc' | 'price-desc';

const BAG_STORAGE_KEY = 'jewellery_bag_v1';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<JewelryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [activeProduct, setActiveProduct] = useState<JewelryProduct | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [bagItems, setBagItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(BAG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read errors
    }
    return [];
  });

  // Callback / Bespoke consultation form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryNote, setInquiryNote] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore storage write errors
    }
  }, [bagItems]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.gemstone && item.gemstone.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.pricePkr - b.pricePkr);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.pricePkr - a.pricePkr);
    }
    return [...list].sort((a, b) => a.featuredRank - b.featuredRank);
  }, [selectedCategory, searchQuery, sortBy]);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBag = (
    product: JewelryProduct,
    variant: string,
    quantity = 1
  ) => {
    const key = `${product.id}__${variant}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { key, product, variant, quantity }];
    });
    setToastMessage(`${product.name} added to your bag`);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => {
    setBagItems([]);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setInquirySubmitted(true);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryNote('');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1917]">
      {/* Strict 3-Zone Top Bar */}
      <Navbar
        bagCount={totalBagCount}
        onOpenBag={() => setBagOpen(true)}
        onSelectCategoryLink={(cat) => setSelectedCategory(cat)}
      />

      <main className="flex-1">
        {/* Section 1: Storefront Hero */}
        <section className="border-b border-[#E6E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
                <p className="text-xs font-medium tracking-widest uppercase text-[#9A6F38]">
                  Fine Gold · Pearls · Precious Stones
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#1C1917] leading-[1.06] text-balance">
                  Sculpted Gold &amp; Gemstone Jewellery, Crafted for Daily Heirloom
                </h1>

                <p className="text-base text-[#57534E] leading-relaxed max-w-xl">
                  Thoughtfully proportioned 18k gold vermeil chains, freshwater pearl drops,
                  and gemstone settings finished by hand for effortless everyday wear.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#collection"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[44px] bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] transition-colors whitespace-nowrap"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <a
                    href={STORE_INFO.phoneHref}
                    className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[44px] border border-[#E6E1D8] bg-white text-[#1C1917] text-sm font-medium rounded-md hover:border-[#9A6F38] transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-[#9A6F38]" aria-hidden="true" />
                    <span className="tabular-nums">{STORE_INFO.phone}</span>
                  </a>
                </div>
              </div>

              {/* Right Hero Focal Photography */}
              <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-stretch min-h-[360px] lg:min-h-[480px]">
                <div className="col-span-8 rounded-lg overflow-hidden bg-[#F2EFE9] border border-[#E6E1D8]">
                  <ResilientImage
                    src={publicAssetUrl('assets/jewelry/gold_chains.jpg')}
                    alt="Layered 18k yellow gold box, rope, and paperclip chains on natural linen"
                    fallbackLabel="Soleil Layered Chain Suite"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                  <div className="flex-1 rounded-lg overflow-hidden bg-[#F2EFE9] border border-[#E6E1D8]">
                    <ResilientImage
                      src={publicAssetUrl('assets/jewelry/gold_hoops.jpg')}
                      alt="Twisted 18k gold hoop earrings resting on travertine stones"
                      fallbackLabel="Torsade Hoops"
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-white border border-[#E6E1D8] rounded-lg space-y-1">
                    <span className="block text-[11px] uppercase tracking-wider text-[#9A6F38] font-medium">
                      Featured Piece
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveProduct(PRODUCTS[0])}
                      className="text-left font-display text-lg font-semibold text-[#1C1917] hover:text-[#9A6F38] transition-colors leading-tight cursor-pointer"
                    >
                      Soleil Chain Suite
                    </button>
                    <p className="text-xs text-[#57534E] tabular-nums">
                      {formatPrice(PRODUCTS[0], currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Column Store Guarantee Strip Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-[#E6E1D8] grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="font-medium text-[#1C1917]">18K Gold &amp; Hallmarked 925</p>
                <p className="text-xs text-[#57534E] mt-1">
                  Tarnish-resistant precious finishes
                </p>
              </div>
              <div>
                <p className="font-medium text-[#1C1917]">Insured Nationwide Courier</p>
                <p className="text-xs text-[#57534E] mt-1 tabular-nums">
                  Complimentary above PKR 25,000
                </p>
              </div>
              <div>
                <p className="font-medium text-[#1C1917]">Cash on Delivery &amp; Pickup</p>
                <p className="text-xs text-[#57534E] mt-1">
                  Pay at doorstep or reserve via call
                </p>
              </div>
              <div>
                <p className="font-medium text-[#1C1917]">Direct Studio Desk</p>
                <a
                  href={STORE_INFO.phoneHref}
                  className="inline-block text-xs text-[#9A6F38] font-medium hover:underline mt-1 tabular-nums"
                >
                  {STORE_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Curated Collection & Interactive Catalog */}
        <section id="collection" className="py-14 lg:py-20 border-b border-[#E6E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest uppercase text-[#9A6F38]">
                  Curated Catalogue
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] text-balance">
                  Signature Pieces &amp; Everyday Gold
                </h2>
              </div>

              {/* Currency Switcher */}
              <div className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] border border-[#E6E1D8] rounded-md self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrency('PKR')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    currency === 'PKR'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  PKR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>

            {/* Filter, Search & Sort Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
              {/* Category Segmented Tabs */}
              <div
                role="tablist"
                aria-label="Filter jewellery by category"
                className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F2EFE9] border border-[#E6E1D8] rounded-lg self-start"
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#1C1917] shadow-xs'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chains, pearls, rings..."
                    aria-label="Search jewellery catalog"
                    className="w-full h-10 pl-10 pr-8 bg-white border border-[#E6E1D8] rounded-md text-xs text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A6F38]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 px-3.5 bg-white border border-[#E6E1D8] rounded-md text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#9A6F38] cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 px-6 text-center bg-white border border-[#E6E1D8] rounded-lg space-y-3">
                <p className="font-display text-2xl font-semibold text-[#1C1917]">
                  No matching pieces found
                </p>
                <p className="text-xs text-[#57534E]">
                  Try another keyword or clear your active category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-4 py-2 bg-[#1C1917] text-[#FAF9F6] text-xs font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group bg-white border border-[#E6E1D8] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Uniform Product Image Frame */}
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9A6F38]"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackLabel={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>

                    {/* Uniform Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        {/* Clean Unboxed Metadata */}
                        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#78716C]">
                          <span className="text-[#9A6F38] font-medium">{product.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{product.material}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveProduct(product)}
                          className="block text-left w-full cursor-pointer"
                        >
                          <h3 className="text-base font-semibold text-[#1C1917] group-hover:text-[#9A6F38] transition-colors leading-snug">
                            {product.name}
                          </h3>
                        </button>

                        <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E6E1D8] flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-[15px] font-semibold text-[#1C1917] tabular-nums">
                            {formatPrice(product, currency)}
                          </span>
                          <span className="block text-[11px] text-[#78716C]">
                            {product.availability}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveProduct(product)}
                            className="px-3 py-2 min-h-[38px] border border-[#E6E1D8] text-[#1C1917] text-xs font-medium rounded-md hover:bg-[#F2EFE9] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToBag(product, product.variants[0], 1)}
                            className="px-3.5 py-2 min-h-[38px] bg-[#1C1917] text-[#FAF9F6] text-xs font-medium rounded-md hover:bg-[#342F2C] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: The Atelier, Client Reviews & Direct Studio Consultation */}
        <section id="atelier" className="py-14 lg:py-20 bg-[#F2EFE9]/60 border-b border-[#E6E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Sunlit Display Gallery */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4 min-h-[320px]">
                <div className="rounded-lg overflow-hidden border border-[#E6E1D8] bg-white">
                  <ResilientImage
                    src={publicAssetUrl('assets/jewelry/boutique_display.jpg')}
                    alt="Sunlit architectural jewellery display shelves"
                    fallbackLabel={`${STORE_INFO.name} Boutique`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden border border-[#E6E1D8] bg-white">
                  <ResilientImage
                    src={publicAssetUrl('assets/jewelry/pearl_choker_editorial.jpg')}
                    alt="Model wearing freshwater pearl choker and fine gold pendant"
                    fallbackLabel="Editorial Styling"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Craftsmanship Story & Direct Contact */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-widest uppercase text-[#9A6F38]">
                    The Atelier
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] text-balance leading-tight">
                    Designed in Warm Light, Finished to Last
                  </h2>
                  <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                    Every piece at <span className="font-semibold text-[#1C1917]">{STORE_INFO.name}</span> is
                    cast in small batches, hand-polished on travertine benches, and inspected for
                    clasp tension and stone seating before it ever enters its keepsake box.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white border border-[#E6E1D8] rounded-lg space-y-1">
                    <p className="text-sm font-semibold text-[#1C1917]">Custom Chain &amp; Ring Sizing</p>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Complimentary clasp extensions and size adjustments tailored before dispatch.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-[#E6E1D8] rounded-lg space-y-1">
                    <p className="text-sm font-semibold text-[#1C1917]">Live Video &amp; Photo View</p>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Message our desk on <span className="tabular-nums font-medium text-[#1C1917]">{STORE_INFO.phone}</span> to view pieces in natural daylight.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Testimonials (Adjacent to Craft Claims) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((review) => (
                <blockquote
                  key={review.name}
                  className="p-6 bg-white border border-[#E6E1D8] rounded-lg flex flex-col justify-between gap-4"
                >
                  <p className="text-sm text-[#1C1917] leading-relaxed">
                    “{review.quote}”
                  </p>
                  <footer className="pt-3 border-t border-[#E6E1D8] text-xs">
                    <span className="font-semibold text-[#1C1917]">{review.name}</span>
                    <span className="text-[#78716C]"> · {review.city} · {review.piece}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Direct Concierge & Callback Section (#contact) */}
            <div
              id="contact"
              className="bg-white border border-[#E6E1D8] rounded-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <p className="text-xs font-medium tracking-widest uppercase text-[#9A6F38]">
                  Store Concierge &amp; Orders
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1C1917] text-balance">
                  Speak Directly With Our Jewellery Desk
                </h2>
                <p className="text-sm text-[#57534E] leading-relaxed max-w-lg">
                  Need bridal set styling, gift wrapping, or same-day courier confirmation? Reach
                  us directly by phone or WhatsApp during studio hours ({STORE_INFO.hours}).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={STORE_INFO.phoneHref}
                    className="inline-flex items-center gap-2.5 px-5 py-3 min-h-[44px] bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-[#D6B27A]" aria-hidden="true" />
                    <span className="tabular-nums">Call {STORE_INFO.phone}</span>
                  </a>

                  <a
                    href={STORE_INFO.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 min-h-[44px] border border-[#E6E1D8] bg-[#FAF9F6] text-[#1C1917] text-sm font-medium rounded-md hover:border-[#9A6F38] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#9A6F38]" aria-hidden="true" />
                    <span>WhatsApp Consultation</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                {inquirySubmitted ? (
                  <div className="p-6 bg-[#FAF9F6] border border-[#E6E1D8] rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917]">
                      <Check className="w-4 h-4 text-[#9A6F38]" aria-hidden="true" />
                      <span>Callback Request Received</span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Our studio advisor from <span className="font-medium text-[#1C1917] tabular-nums">{STORE_INFO.phone}</span> will reach out shortly to assist with your piece selection.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySubmitted(false)}
                      className="text-xs font-medium text-[#9A6F38] hover:underline cursor-pointer"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleInquirySubmit}
                    className="p-5 sm:p-6 bg-[#FAF9F6] border border-[#E6E1D8] rounded-lg space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-[#1C1917]">
                      Request a Studio Callback
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Name"
                        aria-label="Your Name"
                        className="h-10 px-3.5 bg-white border border-[#E6E1D8] rounded-md text-xs focus:outline-none focus:border-[#9A6F38]"
                      />
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        className="h-10 px-3.5 bg-white border border-[#E6E1D8] rounded-md text-xs tabular-nums focus:outline-none focus:border-[#9A6F38]"
                      />
                    </div>
                    <input
                      type="text"
                      value={inquiryNote}
                      onChange={(e) => setInquiryNote(e.target.value)}
                      placeholder="Piece name, ring size, or gift question (optional)"
                      aria-label="Inquiry note"
                      className="w-full h-10 px-3.5 bg-white border border-[#E6E1D8] rounded-md text-xs focus:outline-none focus:border-[#9A6F38]"
                    />
                    <button
                      type="submit"
                      className="w-full h-10 bg-[#1C1917] text-[#FAF9F6] text-xs font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
                    >
                      Request Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Section 4: Editorial Footer */}
      <footer className="bg-[#FAF9F6] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#E6E1D8]">
            <div className="space-y-3">
              <span className="font-display text-2xl font-semibold text-[#1C1917] block">
                {STORE_INFO.name}
              </span>
              <p className="text-xs text-[#57534E] leading-relaxed max-w-xs">
                Curated fine gold vermeil, freshwater pearls, and gemstone jewellery designed for
                lasting everyday wear.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-semibold text-[#1C1917]">Categories</p>
              <ul className="space-y-2 text-[#57534E]">
                {(['Necklaces', 'Earrings', 'Rings', 'Bracelets'] as const).map((cat) => (
                  <li key={cat}>
                    <a
                      href="#collection"
                      onClick={() => setSelectedCategory(cat)}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-semibold text-[#1C1917]">Client Care</p>
              <ul className="space-y-2 text-[#57534E]">
                <li>
                  <a href="#atelier" className="hover:text-[#1C1917] transition-colors">
                    Craftsmanship &amp; Sizing
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setBagOpen(true)}
                    className="hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    Shopping Bag &amp; Delivery
                  </button>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#1C1917] transition-colors">
                    Private Consultation
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-semibold text-[#1C1917]">Direct Contact</p>
              <p>
                <a
                  href={STORE_INFO.phoneHref}
                  className="text-sm font-semibold text-[#9A6F38] hover:underline tabular-nums"
                >
                  {STORE_INFO.phone}
                </a>
              </p>
              <p className="text-[#57534E]">{STORE_INFO.hours}</p>
              <p className="text-[#57534E]">Nationwide Insured Cash on Delivery</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716C]">
            <p>© {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.</p>
            <p className="tabular-nums">Store Helpline: {STORE_INFO.phone}</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        currency={currency}
        onClose={() => setActiveProduct(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Shopping Bag & Checkout Drawer */}
      <CartDrawer
        open={bagOpen}
        items={bagItems}
        currency={currency}
        onClose={() => setBagOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Non-blocking Add-to-Bag Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 px-4 py-3 bg-[#1C1917] text-[#FAF9F6] text-xs rounded-lg shadow-xl border border-[#342F2C]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D6B27A] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setBagOpen(true);
            }}
            className="font-semibold text-[#D6B27A] hover:underline whitespace-nowrap cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
