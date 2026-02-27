import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import type { InstallmentPackage } from '../types';

interface SelectPlanProps {
  productPrice: number;
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
  onContinue,
  onBack,
}: SelectPlanProps) => {
  const [expandedPackage, setExpandedPackage] = useState<Package | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  // Get the closest package to the product price (only 1)
  const closestPackage = useMemo(() => {
    const sorted = [...ALL_PACKAGES].sort((a, b) => {
      const diffA = Math.abs(a.totalAmount - productPrice);
      const diffB = Math.abs(b.totalAmount - productPrice);
      return diffA - diffB;
    });
    return sorted[0];
  }, [productPrice]);

  const handleShowDetails = (pkg: Package) => {
    setExpandedPackage(expandedPackage?.totalAmount === pkg.totalAmount ? null : pkg);
  };

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

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-[hsl(340,80%,55%)] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">رجوع</span>
          </button>
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-8 object-contain"
          />
          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطة الدفع الخاصة بالمنتج</h1>
          <p className="text-xl font-semibold text-[hsl(340,80%,55%)]">
            طريقة الدفع لـ {formatPrice(productPrice)} ريال
          </p>
        </div>

        {/* Plan Card - Single Package */}
        {closestPackage && (() => {
          const isExpanded = expandedPackage?.totalAmount === closestPackage.totalAmount;
          const installmentsText = closestPackage.installmentsCount === 1 ? 'دفعة' : 'دفعات';

          return (
            <div className="bg-white rounded-2xl border-2 border-[hsl(340,80%,55%)] shadow-lg shadow-pink-100 p-5">
              {/* Selected indicator */}
              <div className="absolute -top-3 left-4 bg-[hsl(340,80%,55%)] text-white text-xs font-bold px-3 py-1 rounded-full">
                تم الاختيار
              </div>

              {/* Installments count */}
              <div className="text-lg font-bold text-gray-900 mb-2">
                {closestPackage.installmentsCount} {installmentsText}
              </div>

              {/* Pay today text */}
              <div className="text-gray-600 mb-1">
                ادفع {formatPrice(closestPackage.perInstallment)} ريال اليوم
              </div>

              {/* Installment amount */}
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ريال {formatPrice(closestPackage.perInstallment)}
              </div>

              {/* No processing fees - green */}
              <div className="text-green-600 text-sm font-medium mb-4">
                هذه الخطة لا تشمل رسوم المعالجة
              </div>

              {/* Show details button */}
              <button
                onClick={() => handleShowDetails(closestPackage)}
                className="w-full flex items-center justify-center gap-1 text-[hsl(340,80%,55%)] text-sm font-medium py-2 border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors"
              >
                {isExpanded ? (
                  <>
                    إخفاء التفاصيل
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    عرض التفاصيل
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">📆</span>
                    <span>{closestPackage.installmentsCount} {installmentsText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">💵</span>
                    <span>كل دفعة {formatPrice(closestPackage.perInstallment)} ريال</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">⭐️</span>
                    <span>العمولة {formatPrice(closestPackage.commission)} ريال</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full py-4 font-bold rounded-xl transition-all bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
