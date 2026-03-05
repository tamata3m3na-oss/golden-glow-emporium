import { useState } from 'react';
import TamaraLogo from '@/components/TamaraLogo';
import type { PaymentMethod } from '../types';

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

const PaymentMethodSelection = ({
  selectedMethod,
  onSelectMethod,
  onBack,
  onContinue,
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
          <h1 className="text-[22px] font-bold text-black mb-1 text-right">
            اختر طريقه الدفع
          </h1>
          <p className="text-[14px] text-[#666] mb-6 text-right">
            اختر طريقة الدفع التي تناسبك
          </p>

          {/* Payment Methods */}
          <div className="flex flex-col gap-3 mb-8">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const isHovered = hoveredMethod === method.id;

              return (
                <button
                  key={method.id}
                  onClick={() => onSelectMethod(method.id)}
                  onMouseEnter={() => setHoveredMethod(method.id)}
                  onMouseLeave={() => setHoveredMethod(null)}
                  className="relative w-full rounded-[12px] border-2 transition-all duration-200 overflow-hidden"
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

          {/* Continue Button */}
          <button
            onClick={onContinue}
            disabled={!selectedMethod}
            className="w-full py-[14px] text-[16px] font-bold rounded-[30px] transition-colors"
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
