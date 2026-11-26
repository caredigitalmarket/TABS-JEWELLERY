import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface NavbarProps {
  bagCount: number;
  onOpenBag: () => void;
  onSelectCategoryLink: (category: 'All' | 'Necklaces' | 'Rings') => void;
}

export function Navbar({ bagCount, onOpenBag, onSelectCategoryLink }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (action?: () => void) => {
    setMobileOpen(false);
    if (action) action();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-2xl sm:text-[26px] font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A6F38]"
        >
          {STORE_INFO.name}
        </a>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#collection"
            onClick={() => onSelectCategoryLink('All')}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#9A6F38] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Collection
          </a>
          <a
            href="#collection"
            onClick={() => onSelectCategoryLink('Necklaces')}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#9A6F38] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Necklaces
          </a>
          <a
            href="#atelier"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#9A6F38] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Atelier
          </a>
          <a
            href="#contact"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#9A6F38] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`Open shopping bag, ${bagCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] bg-[#1C1917] text-[#FAF9F6] text-xs font-medium tracking-wide rounded-md hover:bg-[#342F2C] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A6F38]"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="tabular-nums">Bag ({bagCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#1C1917] rounded-md hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E6E1D8] bg-[#FAF9F6] px-4 py-4 space-y-1"
        >
          <a
            href="#collection"
            onClick={() => handleNavClick(() => onSelectCategoryLink('All'))}
            className="block px-3 py-3 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] rounded-md"
          >
            Collection
          </a>
          <a
            href="#collection"
            onClick={() => handleNavClick(() => onSelectCategoryLink('Necklaces'))}
            className="block px-3 py-3 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] rounded-md"
          >
            Necklaces
          </a>
          <a
            href="#atelier"
            onClick={() => handleNavClick()}
            className="block px-3 py-3 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] rounded-md"
          >
            Atelier
          </a>
          <a
            href="#contact"
            onClick={() => handleNavClick()}
            className="block px-3 py-3 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] rounded-md"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
