import { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { JewelryProduct, STORE_INFO, formatAmount, formatPrice } from '../data/products';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  key: string;
  product: JewelryProduct;
  variant: string;
  quantity: number;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'Studio Pickup';
  totalPkr: number;
  itemCount: number;
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  currency: 'PKR' | 'USD';
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  items,
  currency,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery' | 'Bank Transfer' | 'Studio Pickup'
  >('Cash on Delivery');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && items.length > 0 && step === 'confirmed') {
      setStep('bag');
    }
  }, [open, items.length, step]);

  if (!open) return null;

  const subtotalPkr = items.reduce(
    (sum, item) => sum + item.product.pricePkr * item.quantity,
    0
  );
  const qualifiesFreeDelivery =
    subtotalPkr >= STORE_INFO.freeDeliveryThresholdPkr ||
    paymentMethod === 'Studio Pickup';
  const deliveryFeePkr =
    items.length === 0 || qualifiesFreeDelivery ? 0 : STORE_INFO.deliveryFeePkr;
  const totalPkr = subtotalPkr + deliveryFeePkr;
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setFormError('Please fill in your name, phone number, city, and delivery address.');
      return;
    }
    setFormError('');
    const orderNumber = `JWL-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      paymentMethod,
      totalPkr,
      itemCount: totalCount,
    });
    onClearCart();
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('bag');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C1917]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E6E1D8] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D8] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              {step === 'bag' && 'Your Bag'}
              {step === 'checkout' && 'Checkout Details'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
            {step === 'bag' && (
              <p className="text-xs text-[#57534E] tabular-nums mt-0.5">
                {totalCount} {totalCount === 1 ? 'piece' : 'pieces'} selected
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close bag"
            className="w-10 h-10 flex items-center justify-center rounded-md border border-[#E6E1D8] text-[#1C1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="space-y-6 py-4">
              <div className="p-5 bg-white border border-[#E6E1D8] rounded-lg space-y-3">
                <div className="flex items-center gap-2.5 text-[#1C1917]">
                  <CheckCircle2 className="w-5 h-5 text-[#9A6F38] shrink-0" aria-hidden="true" />
                  <span className="text-sm font-semibold tabular-nums">
                    Order #{confirmedOrder.orderNumber} Confirmed — Preparing Shipment
                  </span>
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Thank you, {confirmedOrder.customerName}. Our studio will send a confirmation call
                  or WhatsApp message to <span className="font-medium text-[#1C1917] tabular-nums">{confirmedOrder.phone}</span> before dispatch.
                </p>
              </div>

              <dl className="bg-white border border-[#E6E1D8] rounded-lg p-5 space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#78716C]">Items</dt>
                  <dd className="font-medium text-[#1C1917] tabular-nums">
                    {confirmedOrder.itemCount} pieces
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#78716C]">Payment Method</dt>
                  <dd className="font-medium text-[#1C1917]">{confirmedOrder.paymentMethod}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#78716C]">Destination</dt>
                  <dd className="font-medium text-[#1C1917] text-right">
                    {confirmedOrder.address}, {confirmedOrder.city}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-[#E6E1D8] text-sm">
                  <dt className="font-medium text-[#1C1917]">Total Payable</dt>
                  <dd className="font-semibold text-[#1C1917] tabular-nums">
                    {formatAmount(confirmedOrder.totalPkr, currency)}
                  </dd>
                </div>
              </dl>

              <div className="p-4 bg-[#F2EFE9] rounded-lg text-xs text-[#57534E] space-y-2">
                <p className="font-medium text-[#1C1917]">Need sizing changes or express dispatch?</p>
                <a
                  href={STORE_INFO.phoneHref}
                  className="inline-flex items-center gap-2 font-semibold text-[#9A6F38] hover:underline tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Call Store Desk · {STORE_INFO.phone}</span>
                </a>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F2EFE9] flex items-center justify-center text-[#9A6F38]">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Explore our 18k gold chains, freshwater pearl drops, and handcrafted rings to begin.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#1C1917] text-[#FAF9F6] text-xs font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-4">
              {/* Delivery Threshold Note */}
              <div className="p-3.5 bg-[#F2EFE9] rounded-lg text-xs text-[#57534E]">
                {qualifiesFreeDelivery ? (
                  <span className="text-[#1C1917] font-medium">
                    Complimentary insured courier delivery unlocked.
                  </span>
                ) : (
                  <span className="tabular-nums">
                    Add{' '}
                    <strong className="text-[#1C1917]">
                      {formatAmount(STORE_INFO.freeDeliveryThresholdPkr - subtotalPkr, currency)}
                    </strong>{' '}
                    more for complimentary insured delivery.
                  </span>
                )}
              </div>

              <ul className="divide-y divide-[#E6E1D8]">
                {items.map((item) => (
                  <li key={item.key} className="py-4 flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-[#F2EFE9] shrink-0 border border-[#E6E1D8]">
                      <ResilientImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-[#1C1917] truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#78716C] mt-0.5 truncate">
                            {item.variant}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Remove ${item.product.name}`}
                          className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3">
                        <div className="inline-flex items-center border border-[#E6E1D8] bg-white rounded-md h-8">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, -1)}
                            aria-label={`Decrease quantity for ${item.product.name}`}
                            className="w-8 h-full flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, 1)}
                            aria-label={`Increase quantity for ${item.product.name}`}
                            className="w-8 h-full flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#1C1917] tabular-nums">
                          {formatPrice(
                            {
                              pricePkr: item.product.pricePkr * item.quantity,
                              priceUsd: item.product.priceUsd * item.quantity,
                            },
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800"
                >
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Full Name
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Ayesha Kamran"
                  className="w-full h-11 px-3.5 text-sm bg-white border border-[#E6E1D8] rounded-md focus:outline-none focus:border-[#9A6F38]"
                />
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full h-11 px-3.5 text-sm bg-white border border-[#E6E1D8] rounded-md tabular-nums focus:outline-none focus:border-[#9A6F38]"
                />
              </div>

              <div>
                <label htmlFor="chk-city" className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  City
                </label>
                <input
                  id="chk-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Karachi, Lahore, Islamabad..."
                  className="w-full h-11 px-3.5 text-sm bg-white border border-[#E6E1D8] rounded-md focus:outline-none focus:border-[#9A6F38]"
                />
              </div>

              <div>
                <label htmlFor="chk-address" className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  id="chk-address"
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Street / Sector"
                  className="w-full p-3.5 text-sm bg-white border border-[#E6E1D8] rounded-md focus:outline-none focus:border-[#9A6F38]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#1C1917] mb-2">
                  Payment Preference
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash on Delivery', 'Bank Transfer', 'Studio Pickup'] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2.5 py-2.5 text-[11px] font-medium rounded-md border text-center transition-colors cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-[#1C1917] text-[#FAF9F6] border-[#1C1917]'
                            : 'bg-white text-[#1C1917] border-[#E6E1D8] hover:border-[#9A6F38]'
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="px-6 py-5 border-t border-[#E6E1D8] bg-white space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#57534E]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatAmount(subtotalPkr, currency)}</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span>Insured Courier</span>
                <span className="tabular-nums">
                  {deliveryFeePkr === 0
                    ? 'Complimentary'
                    : formatAmount(deliveryFeePkr, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1C1917] pt-2 border-t border-[#E6E1D8]">
                <span>Total</span>
                <span className="tabular-nums">{formatAmount(totalPkr, currency)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-11 bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-4 h-11 border border-[#E6E1D8] text-[#1C1917] text-xs font-medium rounded-md hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 h-11 bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="px-6 py-5 border-t border-[#E6E1D8] bg-white">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full h-11 bg-[#1C1917] text-[#FAF9F6] text-sm font-medium rounded-md hover:bg-[#342F2C] transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
