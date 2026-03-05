import { useState, useMemo } from 'react';
import TamaraLogo from '@/components/TamaraLogo';
import type { PaymentMethod } from '../types';
import type { Product } from '@/data/products';

interface PaymentMethodSelectionProps {
  product: Product;
  userName: string;
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

const ALL_PACKAGES = [
  { totalAmount: 4140, installmentsCount: 4, perInstallment: 1035, commission: 210 },
  { totalAmount: 8280, installmentsCount: 4, perInstallment: 2070, commission: 410 },
  { totalAmount: 20700, installmentsCount: 4, perInstallment: 5175, commission: 1040 },
  { totalAmount: 6210, installmentsCount: 6, perInstallment: 1035, commission: 310 },
  { totalAmount: 12420, installmentsCount: 6, perInstallment: 2070, commission: 620 },
  { totalAmount: 31050, installmentsCount: 6, perInstallment: 5175, commission: 1550 },
  { totalAmount: 24000, installmentsCount: 24, perInstallment: 1000, commission: 600 },
  { totalAmount: 50000, installmentsCount: 12, perInstallment: 4166, commission: 1800 },
  { totalAmount: 100000, installmentsCount: 36, perInstallment: 2777, commission: 2200 },
];

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14.4998 12.001C14.4998 13.3817 13.3805 14.501 11.9998 14.501C10.6191 14.501 9.49982 13.3817 9.49982 12.001C9.49982 10.6203 10.6191 9.50098 11.9998 9.50098C13.3805 9.50098 14.4998 10.6203 14.4998 12.001Z"/>
    <path d="M16 5.00098C18.4794 5.00098 20.1903 5.38518 21.1329 5.6773C21.6756 5.84549 22 6.35987 22 6.92803V16.6833C22 17.7984 20.7719 18.6374 19.6762 18.4305C18.7361 18.253 17.5107 18.1104 16 18.1104C11.2491 18.1104 10.1096 19.9161 3.1448 18.3802C2.47265 18.232 2 17.6275 2 16.9392V6.92214C2 5.94628 2.92079 5.23464 3.87798 5.42458C10.1967 6.67844 11.4209 5.00098 16 5.00098Z"/>
    <path d="M2 9.00098C3.95133 9.00098 5.70483 7.40605 5.92901 5.75514M18.5005 5.50098C18.5005 7.54062 20.2655 9.46997 22 9.46997M22 15.001C20.1009 15.001 18.2601 16.3112 18.102 18.0993M6.00049 18.4971C6.00049 16.2879 4.20963 14.4971 2.00049 14.4971"/>
  </svg>
);

const TabbyLogo = () => (
  <svg width="70" height="24" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 4C9.46 4 7 6.46 7 9.5c0 3.04 2.46 5.5 5.5 5.5 3.04 0 5.5-2.46 5.5-5.5C18 6.46 15.54 4 12.5 4zm0 9c-1.93 0-3.5-1.57-3.5-3.5S10.57 6 12.5 6 16 7.57 16 9.5 14.43 13 12.5 13z" fill="#000"/>
    <path d="M24 4h2v10h-2zM24 2h2v2h-2zM30 4h-2v2h-2v2h2v4c0 1.1.9 2 2 2h2v-2h-2V8h2V6h-2V4zM38 4c-2.21 0-4 1.79-4 4v6h2V8c0-1.1.9-2 2-2h2V4h-2zM46 4h-6v2h2v8h2V6h2V4zM54 4h-2v10h2c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm2 6c0 1.1-.9 2-2 2h-2V6h2c1.1 0 2 .9 2 2v2zM62 4h-2v10h2V4zM62 2h-2v2h2V2zM68 4h-2v2h-2v2h2v4c0 1.1.9 2 2 2h2v-2h-2V8h2V6h-2V4z" fill="#000"/>
  </svg>
);

const PaymentMethodSelection = ({
  product,
  userName,
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
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const closestPackage = useMemo(() => {
    const sorted = [...ALL_PACKAGES].sort((a, b) => {
      const diffA = Math.abs(a.totalAmount - finalPrice);
      const diffB = Math.abs(b.totalAmount - finalPrice);
      return diffA - diffB;
    });
    return sorted[0];
  }, [finalPrice]);

  const formatPricePlain = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div
      className="min-h-screen bg-[#f8f9fa]"
      dir="rtl"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <div className="max-w-[430px] mx-auto w-full min-h-screen flex flex-col bg-[#f8f9fa]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-[97px] h-[80px] border border-gray-200 rounded flex items-center justify-center overflow-hidden">
              <img
                src="/se3ar.jpg"
                alt="شعار المتجر"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[14px] font-medium text-black">{userName}</p>
            <p className="text-[12px] text-[#777]">سلة المشتريات / إتمام الطلب</p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-[#e0e0e0]" />

        {/* Content */}
        <div className="flex-1 px-4 py-4">
          {/* Order Total Section */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-black">إجمالي الطلب</span>
            <div className="flex items-center gap-4">
              <span className="text-[14px] text-red-500 cursor-pointer">لديك كوبون تخفيض ؟</span>
              <span className="text-[16px] font-bold text-black">
                {formatPricePlain(finalPrice)} ريال
              </span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="flex gap-2 mb-4" style={{ width: '440px', maxWidth: '100%' }}>
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="أدخل رمز الكوبون"
              disabled={couponApplied}
              className="flex-1 h-[40px] px-3 text-[14px] border border-[#ddd] rounded bg-white text-black placeholder-[#999] outline-none focus:border-black transition-colors text-right"
            />
            <button
              onClick={applyCoupon}
              disabled={couponApplied || !coupon.trim()}
              className="h-[40px] px-5 text-[14px] font-medium rounded transition-colors whitespace-nowrap"
              style={{
                backgroundColor: couponApplied ? '#22c55e' : '#000000',
                color: '#fff',
                cursor: couponApplied || !coupon.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {couponApplied ? 'تم التطبيق' : 'تطبيق'}
            </button>
          </div>

          {/* Order Details Toggle Button */}
          <button
            onClick={() => setShowOrderDetails(!showOrderDetails)}
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded text-black text-[14px] font-medium flex items-center justify-center gap-2 mb-0"
          >
            {showOrderDetails ? 'إخفاء التفاصيل' : 'تفاصيل الطلب'}
          </button>

          {/* Order Details Content */}
          {showOrderDetails && (
            <div className="bg-white border border-t-0 border-gray-300 rounded-b px-4 py-3 -mt-1 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black">{product.name}</span>
                <span className="text-[14px] text-black">1 × {formatPricePlain(product.price)}.00 ريال</span>
              </div>
            </div>
          )}

          {/* Separator */}
          <hr style={{ margin: '0.7rem 0' }} className="border-gray-300" />

          {/* Payment Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon />
              <span className="text-[16px] font-bold text-black">الدفع</span>
            </div>
            <p className="text-[14px] text-[#777] mb-3 mr-7">select_payment_method</p>

            {/* Payment Method Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => onSelectMethod('tamara')}
                className={`flex-1 h-[50px] flex items-center justify-center border-2 rounded transition-all ${
                  selectedMethod === 'tamara'
                    ? 'border-black bg-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <TamaraLogo />
              </button>
              <button
                onClick={() => onSelectMethod('tabby')}
                className={`flex-1 h-[50px] flex items-center justify-center border-2 rounded transition-all ${
                  selectedMethod === 'tabby'
                    ? 'border-black bg-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <TabbyLogo />
              </button>
            </div>

            {/* Tamara Details */}
            {selectedMethod === 'tamara' && closestPackage && (
              <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                <p className="text-[14px] text-black mb-3">
                  قسّم فاتورتك حتى {closestPackage.installmentsCount} دفعات بدون فوائد!
                </p>
                <p className="text-[14px] text-black mb-3">ادفع قيمة طلبك كاملة</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] text-[#777]">خدمات مطابقة للشريعة الإسلامية</span>
                  <span className="text-[12px] bg-green-100 text-green-700 px-2 py-0.5 rounded">حلال</span>
                </div>
                <p className="text-[12px] text-[#777] mb-1">سجلك الائتماني قد يؤثر على خطط الدفع</p>
                <p className="text-[12px] text-[#777]">خدمات تمارا متاحة للعملاء الأكبر من 18 سنة</p>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Payment Button - Fixed at bottom */}
        <div className="px-4 pb-4 pt-2 bg-[#f8f9fa]">
          <button
            onClick={onContinue}
            disabled={!selectedMethod}
            className="w-full h-[48px] text-[16px] font-bold rounded transition-colors"
            style={{
              backgroundColor: selectedMethod ? '#000000' : '#ddd',
              color: selectedMethod ? '#fff' : '#999',
              cursor: selectedMethod ? 'pointer' : 'not-allowed',
            }}
          >
            تأكيد الدفع
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-6 pt-2 text-center bg-[#f8f9fa]">
          <p className="text-[12px] text-[#777] mb-1">مع كل طلب لك نصيب من الخير</p>
          <p className="text-[11px] text-[#777]">سنتبرع بجزء من قيمة طلبك لجمعية ركن الحوار</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
