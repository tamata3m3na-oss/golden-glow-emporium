import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Lock, ShieldCheck, LockKeyhole } from 'lucide-react';
import { toEnglishNumbers } from '@/lib/utils';

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
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[hsl(340,80%,55%)] mb-6">
        ← رجوع
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-6">
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-10 mx-auto object-contain mb-4"
          />
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-3 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-[hsl(340,80%,55%)]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">أدخل بيانات البطاقة</h2>
          <p className="text-sm text-gray-500 mt-1">سيتم التحقق من بطاقتك تلقائياً</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-gray-700 text-sm block">اسم حامل البطاقة</label>
            <Input
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="الاسم كما يظهر على البطاقة"
              className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[hsl(340,80%,55%)] focus:ring-[hsl(340,80%,55%)]"
              dir="ltr"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-700 text-sm block">رقم البطاقة</label>
            <Input
              value={cardNumber}
              onChange={e => setCardNumber(toEnglishNumbers(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              className="bg-gray-50 border-gray-300 text-gray-900 text-center tracking-[0.3em] focus:border-[hsl(340,80%,55%)] focus:ring-[hsl(340,80%,55%)]"
              dir="ltr"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-gray-700 text-sm block">تاريخ الانتهاء</label>
              <Input
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className={`bg-gray-50 text-gray-900 text-center focus:ring-[hsl(340,80%,55%)] ${
                  expiryInvalid
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-gray-300 focus:border-[hsl(340,80%,55%)]'
                }`}
                dir="ltr"
                maxLength={5}
              />
              {expiryInvalid && (
                <p className="text-xs text-red-500">تاريخ انتهاء غير صالح</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-sm block">CVV</label>
              <Input
                value={cardCvv}
                onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                placeholder="•••"
                type="password"
                className="bg-gray-50 border-gray-300 text-gray-900 text-center focus:border-[hsl(340,80%,55%)] focus:ring-[hsl(340,80%,55%)]"
                dir="ltr"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          className="w-full mt-6 py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
          disabled={!isFormValid}
        >
          <Lock className="h-4 w-4 ml-2" />
          متابعة
        </Button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <LockKeyhole className="h-3 w-3" />
          <span>بياناتك محمية بتشفير SSL</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-3 w-3" />
            <span>معتمد من هيئة السعودية للبيانات والذكاء الاصطناعي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
