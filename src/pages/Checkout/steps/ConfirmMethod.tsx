import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, ShieldCheck } from 'lucide-react';
import { toEnglishNumbers } from '@/lib/utils';

interface ConfirmMethodProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmMethod = ({ phoneNumber, setPhoneNumber, onBack, onSubmit }: ConfirmMethodProps) => {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[hsl(340,80%,55%)] mb-6">
        ← رجوع
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="mb-8">
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-12 mx-auto object-contain"
          />
        </div>

        <div className="w-16 h-16 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-4 flex items-center justify-center">
          <Phone className="h-8 w-8 text-[hsl(340,80%,55%)]" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">أدخل رقم الجوال</h2>
        <p className="text-gray-500 text-sm mb-6">سنرسل لك رمز تحقق لتأكيد رقمك</p>

        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
              <span className="text-xl">🇸🇦</span>
              <span className="text-gray-700 font-medium">+966</span>
            </div>
            <Input
              value={phoneNumber}
              onChange={e => setPhoneNumber(toEnglishNumbers(e.target.value))}
              placeholder="05XXXXXXXX"
              className="bg-gray-50 border-gray-300 text-gray-900 text-center text-lg tracking-wider w-48 focus:border-[hsl(340,80%,55%)] focus:ring-[hsl(340,80%,55%)]"
              maxLength={10}
              dir="ltr"
              type="tel"
            />
          </div>

          <p className="text-xs text-gray-400">
            يجب أن يكون الرقم مسجل باسمك في البنك
          </p>

          <Button
            onClick={onSubmit}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
            disabled={!phoneNumber || phoneNumber.length < 10}
          >
            إرسال الرمز
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

export default ConfirmMethod;
