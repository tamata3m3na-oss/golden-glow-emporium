import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { toEnglishNumbers } from '@/lib/utils';

interface ConfirmCodeProps {
  confirmCode: string;
  setConfirmCode: (value: string) => void;
  onSubmit: () => void;
  codeError?: string | null;
  isLoading?: boolean;
  onClearError?: () => void;
}

const ConfirmCode = ({ confirmCode, setConfirmCode, onSubmit, codeError, isLoading, onClearError }: ConfirmCodeProps) => {
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="mb-6">
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-10 mx-auto object-contain"
          />
        </div>

        <div className="w-16 h-16 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-4 flex items-center justify-center">
          <Lock className="h-8 w-8 text-[hsl(340,80%,55%)]" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">رمز تأكيد الدفع</h2>
        <p className="text-sm text-gray-500 mb-6">
          أدخل الرمز المرسل إلى هاتفك لتأكيد عملية الدفع
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm block mb-2">رمز التحقق (OTP):</label>
            <Input
              value={confirmCode}
              onChange={e => {
                setConfirmCode(toEnglishNumbers(e.target.value));
                if (onClearError) onClearError();
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

          <div className="bg-[hsl(340,80%,55%,0.05)] border border-[hsl(340,80%,55%,0.2)] rounded-lg p-3">
            <p className="text-xs text-gray-500">
              💡 للعرض التجريبي: أدخل أي 4-6 أرقام للمتابعة
            </p>
          </div>

          <Button
            onClick={onSubmit}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
            disabled={!confirmCode || confirmCode.length < 4 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري التحقق...
              </>
            ) : (
              'تأكيد الدفع'
            )}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-3 w-3" />
            <span>معتمد من هيئة السعودية للبيانات والذكاء الاصطناعي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCode;
