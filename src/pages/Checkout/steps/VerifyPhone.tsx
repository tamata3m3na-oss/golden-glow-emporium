import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone, MessageSquare } from 'lucide-react';
import { toEnglishNumbers } from '@/lib/utils';

interface VerifyPhoneProps {
  phoneNumber: string;
  activationCode: string;
  setActivationCode: (value: string) => void;
  agreedTerms: boolean;
  setAgreedTerms: (value: boolean) => void;
  codeError: string | null;
  resendTimer: number;
  formatTimer: (seconds: number) => string;
  isVerifyingCode: boolean;
  sentActivationCode: string | null;
  onBack: () => void;
  onSubmit: () => void;
  onClearError: () => void;
}

const VerifyPhone = ({
  phoneNumber,
  activationCode,
  setActivationCode,
  agreedTerms,
  setAgreedTerms,
  codeError,
  resendTimer,
  formatTimer,
  isVerifyingCode,
  sentActivationCode,
  onBack,
  onSubmit,
  onClearError,
}: VerifyPhoneProps) => {
  // Auto-fill the activation code when available
  useEffect(() => {
    if (sentActivationCode && !activationCode) {
      setActivationCode(sentActivationCode);
    }
  }, [sentActivationCode, activationCode, setActivationCode]);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[hsl(340,80%,55%)] mb-6">
        ← رجوع
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="mb-6">
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-10 mx-auto object-contain mb-4"
          />
        </div>

        <div className="w-16 h-16 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-4 flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-[hsl(340,80%,55%)]" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">تحقق من رقمك</h2>
        <p className="text-gray-600 mb-1">{phoneNumber}</p>
        <button
          onClick={onBack}
          className="text-[hsl(340,80%,55%)] text-sm mb-4 hover:underline"
        >
          تبي تغيير رقمك؟
        </button>

        <p className="text-gray-500 text-sm mb-4">لقد أرسلنا رمز التحقق عبر الرسائل القصيرة</p>

        {/* Show the activation code for demo/automatic flow */}
        {sentActivationCode && (
          <div className="bg-[hsl(340,80%,55%,0.05)] border border-[hsl(340,80%,55%,0.2)] rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">رمز التحقق (للعرض التجريبي):</p>
            <p className="text-2xl font-bold text-[hsl(340,80%,55%)] tracking-[0.3em]" dir="ltr">
              {sentActivationCode}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm block mb-2">أدخل رمز التحقق:</label>
            <Input
              value={activationCode}
              onChange={e => {
                setActivationCode(toEnglishNumbers(e.target.value));
                onClearError();
              }}
              placeholder="_ _ _ _ _ _"
              className="bg-gray-50 border-gray-300 text-gray-900 text-center text-2xl tracking-[0.5em] py-4 focus:border-[hsl(340,80%,55%)] focus:ring-[hsl(340,80%,55%)]"
              dir="ltr"
              maxLength={6}
              type="text"
              inputMode="numeric"
            />
          </div>

          {codeError && <p className="text-red-500 text-sm">{codeError}</p>}

          <p className="text-gray-500 text-sm">
            {resendTimer > 0 ? `إعادة الإرسال خلال ${formatTimer(resendTimer)}` : 'يمكنك طلب إعادة الإرسال'}
          </p>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer justify-center">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={e => setAgreedTerms(e.target.checked)}
              className="rounded border-gray-300 accent-[hsl(340,80%,55%)]"
            />
            أوافق على <a href="https://tamara.co/terms" target="_blank" rel="noopener noreferrer" className="text-[hsl(340,80%,55%)] hover:underline">شروط وأحكام تمارا</a>
          </label>

          <Button
            onClick={onSubmit}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
            disabled={!activationCode || !agreedTerms || isVerifyingCode}
          >
            {isVerifyingCode ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري التحقق...
              </>
            ) : (
              'تأكيد'
            )}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Phone className="h-3 w-3" />
            <span>الرمز صالح لمدة 5 دقائق</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
