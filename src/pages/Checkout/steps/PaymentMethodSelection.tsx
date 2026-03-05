import { useState } from 'react';
import TamaraLogo from '@/components/TamaraLogo';
import type { PaymentMethod } from '../types';
import type { Product } from '@/data/products';

interface PaymentMethodSelectionProps {
  product: Product;
  coupon: string;
  couponApplied: boolean;
  discount: number;
  finalPrice: number;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  setCoupon: (value: string) => void;
  applyCoupon: () => void;
  onBack: () => void;
  onContinue: () => void;
  formatPrice: (price: number) => string;
}

const PaymentMethodSelection = ({
  product,
  coupon,
  couponApplied,
  discount,
  finalPrice,
  selectedMethod,
  onSelectMethod,
  setCoupon,
  applyCoupon,
  onBack,
  onContinue,
  formatPrice,
}: PaymentMethodSelectionProps) => {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod>(null);

  const paymentMethods = [
    {
      id: 'tamara' as PaymentMethod,
      name: 'تمارا',
      description: 'قسّمها على 4 دفعات بدون فوائد',
      logo: (
        <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 4h-5C2.1 4 1 5.1 1 6.5v8c0 1.4 1.1 2.5 2.5 2.5h5c1.4 0 2.5-1.1 2.5-2.5v-8C11 5.1 9.9 4 8.5 4z" fill="#F4C13F"/>
          <path d="M17 4h-2c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#F4C13F"/>
          <path d="M24 4h-2c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#F4C13F"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <TamaraLogo />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="text-[14px] text-[#333] font-medium"
            >
              English
            </button>
            <span className="text-[#ccc]">|</span>
            <button
              onClick={onBack}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#ddd] hover:bg-gray-50 transition-colors"
            >
              <span className="text-[#333] text-lg leading-none">✕</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-[#eee] mx-0" />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          {/* Page Title */}
          <h1 className="text-[22px] font-bold text-black mb-1 text-right">
            إتمام الطلب
          </h1>
          <p className="text-[14px] text-[#666] mb-6 text-right">
            راجع تفاصيل طلبك واختر طريقة الدفع
          </p>

          {/* Order Summary Section */}
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-black mb-3 text-right">ملخص الطلب</h2>
            <div className="bg-[#f9fafb] rounded-[12px] p-4 border border-[#eee]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#f4c13f] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  الذهب
                </div>
                <div className="flex-1 text-right">
                  <p className="font-bold text-[15px] text-black">{product.name}</p>
                  <p className="text-[13px] text-[#666]">عيار {product.karat}</p>
                </div>
              </div>
              <div className="border-t border-[#e5e5e5] pt-3">
                <div className="flex justify-between text-[14px] mb-1">
                  <span className="text-[#666]">السعر الأصلي</span>
                  <span className="text-black font-medium">{formatPrice(product.price)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[14px] mb-1">
                    <span className="text-green-600">الخصم</span>
                    <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[16px] font-bold mt-2 pt-2 border-t border-[#e5e5e5]">
                  <span className="text-black">الإجمالي</span>
                  <span className="text-black">{formatPrice(finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-black mb-3 text-right">كوبون الخصم</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="أدخل كود الكوبون"
                disabled={couponApplied}
                className="flex-1 px-4 py-3 text-[14px] border border-[#dcdcdc] rounded-[10px] bg-white text-black placeholder-[#999] outline-none focus:border-black transition-colors text-right"
              />
              <button
                onClick={applyCoupon}
                disabled={couponApplied || !coupon.trim()}
                className="px-5 py-3 text-[14px] font-bold rounded-[10px] transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: couponApplied ? '#22c55e' : coupon.trim() ? '#000000' : '#f5f5f5',
                  color: couponApplied ? '#fff' : coupon.trim() ? '#fff' : '#999',
                  cursor: couponApplied || !coupon.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {couponApplied ? 'تم التطبيق' : 'تطبيق'}
              </button>
            </div>
            {couponApplied && (
              <p className="text-[12px] text-green-600 mt-2 text-right">
                تم تطبيق الكوبون بنجاح! خصم {formatPrice(discount)}
              </p>
            )}
          </div>

          {/* Payment Methods Section */}
          <div className="mb-6 flex-1">
            <h2 className="text-[16px] font-bold text-black mb-3 text-right">طريقة الدفع</h2>
            <div className="flex flex-col gap-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => onSelectMethod(method.id)}
                    onMouseEnter={() => setHoveredMethod(method.id)}
                    onMouseLeave={() => setHoveredMethod(null)}
                    className="relative w-full rounded-[12px] border-2 transition-all duration-200 overflow-hidden text-right"
                    style={{
                      borderColor: isSelected ? '#F4C13F' : '#e5e5e5',
                      backgroundColor: isSelected ? '#FFFBF0' : '#fff',
                    }}
                  >
                    <div className="flex items-center gap-4 px-4 py-4">
                      {/* Radio Button */}
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          borderColor: isSelected ? '#F4C13F' : '#ccc',
                          backgroundColor: isSelected ? '#F4C13F' : '#fff',
                        }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Method Info */}
                      <div className="flex-1 text-right">
                        <div className="font-bold text-[16px] text-black mb-1">
                          {method.name}
                        </div>
                        <div className="text-[13px] text-[#666]">
                          {method.description}
                        </div>
                      </div>

                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {method.logo}
                      </div>
                    </div>

                    {/* Selected Indicator Line */}
                    {isSelected && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-[3px]"
                        style={{ backgroundColor: '#F4C13F' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            disabled={!selectedMethod}
            className="w-full py-[14px] text-[16px] font-bold rounded-[30px] transition-colors mt-auto"
            style={{
              backgroundColor: selectedMethod ? '#000000' : '#f5f5f5',
              color: selectedMethod ? '#fff' : '#999',
              cursor: selectedMethod ? 'pointer' : 'not-allowed',
            }}
          >
            متابعة
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
