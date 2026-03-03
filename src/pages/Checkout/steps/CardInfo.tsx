import { toEnglishNumbers } from '@/lib/utils';
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
          {/* Title Section */}
          <div className="mb-2">
            <h1 className="text-[22px] font-bold text-right" style={{ color: 'hsl(40 30% 92%)' }}>
              أدخل بيانات بطاقتك
            </h1>
            <p className="text-[14px] mt-1 text-right" style={{ color: 'hsl(220 15% 55%)' }}>
              سيتم التحقق من بطاقتك تلقائياً
            </p>
          </div>

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

        {/* Fixed Bottom Button */}
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
              متابعة الدفع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
