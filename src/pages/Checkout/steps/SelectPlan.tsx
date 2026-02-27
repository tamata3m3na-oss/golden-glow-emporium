import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info, Wallet, ChevronLeft, Sparkles } from 'lucide-react';
import type { InstallmentPackage } from '../types';

interface SelectPlanProps {
  packages: InstallmentPackage[];
  selectedPackage: InstallmentPackage | null;
  onSelectPackage: (pkg: InstallmentPackage) => void;
  onContinue: () => void;
  onBack: () => void;
}

const PLAN_GROUPS = [
  {
    key: '4',
    title: 'باقات 4 دفعات',
    filter: (p: InstallmentPackage) => p.installmentsCount === 4,
  },
  {
    key: '6',
    title: 'باقات 6 دفعات',
    filter: (p: InstallmentPackage) => p.installmentsCount === 6,
  },
  {
    key: '24',
    title: 'باقات 24 دفعة',
    filter: (p: InstallmentPackage) => p.installmentsCount === 24,
  },
  {
    key: 'tamara',
    title: 'باقات تمارا فقط',
    filter: (p: InstallmentPackage) => p.installmentsCount === 12 || p.installmentsCount === 36,
  },
];

const SelectPlan = ({
  packages,
  selectedPackage,
  onSelectPackage,
  onContinue,
  onBack,
}: SelectPlanProps) => {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]" dir="rtl">
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
          <div className="w-16 h-16 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-[hsl(340,80%,55%)]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">اختر خطتك</h1>
          <p className="text-gray-500 text-sm">اختر الباقة المناسبة لك</p>
        </div>

        {/* Important Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              جميع الأقساط نفس قيمة القسط الأول، لا يوجد قسط أعلى أو أقل، العمولة تُخصم مرة واحدة فقط
            </p>
          </div>
        </div>

        {/* Plan Groups */}
        <div className="space-y-6">
          {PLAN_GROUPS.map(group => {
            const groupPackages = packages.filter(group.filter);
            if (groupPackages.length === 0) return null;

            return (
              <div key={group.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[hsl(340,80%,55%)]" />
                    {group.title}
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {groupPackages.map(pkg => {
                    const isSelected = selectedPackage?.totalAmount === pkg.totalAmount &&
                                       selectedPackage?.installmentsCount === pkg.installmentsCount;

                    return (
                      <button
                        key={`${pkg.totalAmount}-${pkg.installmentsCount}`}
                        onClick={() => onSelectPackage(pkg)}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-[hsl(340,80%,55%)] bg-[hsl(340,80%,55%,0.05)]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(pkg.totalAmount)} ريال
                              </span>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-600">
                                {pkg.installmentsCount} دفعات
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>كل دفعة {formatPrice(pkg.perInstallment)} ريال</div>
                              <div className="text-amber-600">العمولة: {formatPrice(pkg.commission)} ريال</div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[hsl(340,80%,55%)] bg-[hsl(340,80%,55%)]'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* How to get advance */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-[hsl(340,80%,55%)]" />
            طريقة الحصول على السلفة
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[hsl(340,80%,55%)] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-gray-600">إدخال البطاقة</span>
            </div>
            <div className="h-px flex-1 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-gray-600">التحقق من الهوية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={onContinue}
            disabled={!selectedPackage}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
