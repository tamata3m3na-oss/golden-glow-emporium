import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';

interface SelectPlanProps {
  productPrice: number;
  onContinue: () => void;
  onBack: () => void;
}

const PLAN_GROUPS = [
  {
    key: '4',
    title: 'باقات 4 دفعات',
    packages: [
      { totalAmount: 4140, installmentsCount: 4, perInstallment: 1035, commission: 210 },
      { totalAmount: 8280, installmentsCount: 4, perInstallment: 2070, commission: 410 },
      { totalAmount: 20700, installmentsCount: 4, perInstallment: 5175, commission: 1040 },
    ],
  },
  {
    key: '6',
    title: 'باقات 6 دفعات',
    packages: [
      { totalAmount: 6210, installmentsCount: 6, perInstallment: 1035, commission: 310 },
      { totalAmount: 12420, installmentsCount: 6, perInstallment: 2070, commission: 620 },
      { totalAmount: 31050, installmentsCount: 6, perInstallment: 5175, commission: 1550 },
    ],
  },
  {
    key: '24',
    title: 'باقات 24 دفعة',
    packages: [
      { totalAmount: 24000, installmentsCount: 24, perInstallment: 1000, commission: 600 },
    ],
  },
  {
    key: 'tamara',
    title: 'باقات تمارا فقط',
    packages: [
      { totalAmount: 50000, installmentsCount: 12, perInstallment: 4166, commission: 1800 },
      { totalAmount: 100000, installmentsCount: 36, perInstallment: 2777, commission: 2200 },
    ],
  },
];

const SelectPlan = ({
  productPrice,
  onContinue,
  onBack,
}: SelectPlanProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA').format(price);
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">اختر طريقة دفعك</h1>
          <p className="text-xl font-semibold text-[hsl(340,80%,55%)]">
            {formatPrice(productPrice)} ريال
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6" />

        {/* Important Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>جميع الأقساط نفس قيمة القسط الأول</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>لا يوجد قسط أعلى أو أقل</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>العمولة تُخصم مرة واحدة فقط</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6" />

        {/* Plan Groups - Text Only */}
        <div className="space-y-6">
          {PLAN_GROUPS.map(group => (
            <div key={group.key}>
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-[hsl(340,80%,55%)]">🔹</span>
                {group.title}
              </h2>
              <div className="space-y-4">
                {group.packages.map((pkg, index) => (
                  <div
                    key={`${pkg.totalAmount}-${pkg.installmentsCount}-${index}`}
                    className="bg-white rounded-xl border border-gray-200 p-4"
                  >
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {formatPrice(pkg.totalAmount)} ريال
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {pkg.installmentsCount} دفعات | كل دفعة {formatPrice(pkg.perInstallment)} ريال
                    </div>
                    <div className="text-sm text-amber-600">
                      العمولة: {formatPrice(pkg.commission)} ريال
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6" />

        {/* How to get advance */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚡</span>
            طريقة الحصول على السلفة
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>1️⃣</span>
              <span>يتم الطلب عبر تابي أو تمارا</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2️⃣</span>
              <span>تدفع أول قسط فقط (وهو نفس باقي الأقساط)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={onContinue}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-xl"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
