import { useEffect, useState } from 'react';
import { Minus, Phone, Plus, ShieldCheck, X } from 'lucide-react';
import { JewelryProduct, STORE_INFO, formatPrice } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductModalProps {
  product: JewelryProduct | null;
  currency: 'PKR' | 'USD';
  onClose: () => void;
  onAddToBag: (product: JewelryProduct, variant: string, quantity: number) => void;
}

export function ProductModal({
  product,
  currency,
  onClose,
  onAddToBag,
}: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToBag(product, selectedVariant || product.variants[0], quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF9F6] border border-[#E6E1D8] rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-md bg-[#FAF9F6]/90 border border-[#E6E1D8] text-[#1C1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Gallery Column */}
        <div className="lg:col-span-6 bg-[#F2EFE9] relative min-h-[260px] sm:min-h-[340px] lg:min-h-full">
          <ResilientImage
            src={product.image}
            alt={product.name}
            fallbackLabel={product.name}
            loading="eager"
            className="w-full h-full max-h-[360px] lg:max-h-none object-cover"
          />
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="lg:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
              <span className="font-medium text-[#9A6F38]">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.material}</span>
              <span aria-hidden="true">·</span>
              <span>{product.availability}</span>
            </div>

            <h2
              id="pdp-title"
              className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-tight text-balance"
            >
              {product.name}
            </h2>

            <p className="text-xl font-semibold text-[#1C1917] tabular-nums">
              {formatPrice(product, currency)}
            </p>

            <p className="text-sm text-[#57534E] leading-relaxed">{product.description}</p>

            {/* Specifications */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 py-4 border-y border-[#E6E1D8] text-xs">
              <div>
                <dt className="text-[#78716C]">Metal & Finish</dt>
                <dd className="font-medium text-[#1C1917] mt-0.5">{product.material}</dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Approx. Weight</dt>
                <dd className="font-medium text-[#1C1917] mt-0.5 tabular-nums">
                  {product.weightGrams}
                </dd>
              </div>
              {product.gemstone && (
                <div className="col-span-2 pt-1">
                  <dt className="text-[#78716C]">Stone Setting</dt>
                  <dd className="font-medium text-[#1C1917] mt-0.5">{product.gemstone}</dd>
                </div>
              )}
              <div className="col-span-2 pt-1">
                <dt className="text-[#78716C]">Craftsmanship Note</dt>
                <dd className="text-[#57534E] mt-0.5 leading-relaxed">{product.craftNote}</dd>
              </div>
            </dl>

            {/* Variant Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-medium text-[#1C1917]">
                Select Size / Option
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const active = selectedVariant === variant;
                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3.5 py-2 min-h-[40px] text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#1C1917] text-[#FAF9F6] border-[#1C1917]'
                          : 'bg-white text-[#1C1917] border-[#E6E1D8] hover:border-[#9A6F38]'
                      }`}
                    >
                      {variant}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Purchase Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#E6E1D8] bg-white rounded-md h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 h-11 px-6 bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] active:scale-[0.99] transition-all whitespace-nowrap cursor-pointer"
              >
                Add to Bag
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#57534E]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9A6F38]" aria-hidden="true" />
                <span>Hallmarked box & 7-day exchange</span>
              </span>
              <a
                href={STORE_INFO.phoneHref}
                className="inline-flex items-center gap-1.5 font-medium text-[#1C1917] hover:text-[#9A6F38] transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A6F38]" aria-hidden="true" />
                <span className="tabular-nums">Inquire: {STORE_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
