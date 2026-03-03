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
        <div className="h-px bg-[#eee]" />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          <h1 className="text-[22px] font-bold text-black mb-1 text-right">
            أدخل بيانات بطاقتك
          </h1>
          <p className="text-[14px] text-[#666] mb-6 text-right">
            سيتم التحقق من بطاقتك تلقائياً
          </p>

          {/* Card Name */}
          <div className="mb-4">
            <label className="text-[14px] font-medium text-black block mb-2 text-right">
              اسم حامل البطاقة
            </label>
            <input
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="الاسم كما يظهر على البطاقة"
              className="w-full px-4 py-3 text-[15px] text-black bg-white border rounded-[10px] outline-none placeholder-[#aaa]"
              style={{ borderColor: '#dcdcdc' }}
              dir="ltr"
              maxLength={100}
            />
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="text-[14px] font-medium text-black block mb-2 text-right">
              رقم البطاقة
            </label>
            <input
              value={cardNumber}
              onChange={e => setCardNumber(toEnglishNumbers(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              className="w-full px-4 py-3 text-[15px] text-black bg-white border rounded-[10px] outline-none placeholder-[#aaa] text-center"
              style={{ borderColor: '#dcdcdc', letterSpacing: '0.2em' }}
              dir="ltr"
              maxLength={19}
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-[14px] font-medium text-black block mb-2 text-right">
                تاريخ الانتهاء
              </label>
              <input
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 text-[15px] text-black bg-white border rounded-[10px] outline-none placeholder-[#aaa] text-center"
                style={{
                  borderColor: expiryInvalid ? '#ef4444' : '#dcdcdc',
                }}
                dir="ltr"
                maxLength={5}
              />
              {expiryInvalid && (
                <p className="text-xs text-red-500 mt-1 text-right">تاريخ انتهاء غير صالح</p>
              )}
            </div>
            <div>
              <label className="text-[14px] font-medium text-black block mb-2 text-right">
                CVV
              </label>
              <input
                value={cardCvv}
                onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                placeholder="•••"
                type="password"
                className="w-full px-4 py-3 text-[15px] text-black bg-white border rounded-[10px] outline-none placeholder-[#aaa] text-center"
                style={{ borderColor: '#dcdcdc' }}
                dir="ltr"
                maxLength={4}
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onSubmit}
              disabled={!isFormValid}
              className="w-full py-4 font-bold rounded-[10px] transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: isFormValid ? '#000000' : '#ddd',
                color: isFormValid ? '#fff' : '#999',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
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
