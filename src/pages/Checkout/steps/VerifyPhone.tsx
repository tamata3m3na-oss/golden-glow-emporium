import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone } from 'lucide-react';
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
  onBack,
  onSubmit,
  onClearError,
}: VerifyPhoneProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
      <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
        <Phone className="h-8 w-8 text-gray-600" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">تحقق من رقمك</h2>
      <p className="text-gray-600 mb-1">{phoneNumber}</p>
      <button
        onClick={onBack}
        className="text-[hsl(340,80%,55%)] text-sm mb-4 hover:underline"
      >
        تبي تغيير رقمك؟
      </button>

      <p className="text-gray-500 text-sm mb-6">لقد أرسلنا رمز التحقق عبر الرسائل القصيرة</p>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 text-sm block mb-2">أدخل رمز التحقق:</Label>
          <Input
            value={activationCode}
            onChange={e => {
              setActivationCode(toEnglishNumbers(e.target.value));
              onClearError();
            }}
            placeholder="_ _ _ _"
            className="bg-gray-50 border-gray-300 text-gray-900 text-center text-2xl tracking-[0.5em] py-4"
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
          أوافق على شروط وأحكام تمارا
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
    </div>
  );
};

export default VerifyPhone;
