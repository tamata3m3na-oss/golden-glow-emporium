import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
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
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4" /> رجوع
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="mb-8">
          <img
            src="/tamara-logo.webp"
            alt="Tamara"
            className="h-12 mx-auto object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">أدخل رقم الجوال</h2>

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
              className="bg-gray-50 border-gray-300 text-gray-900 text-center text-lg tracking-wider w-48"
              maxLength={10}
              dir="ltr"
              type="tel"
            />
          </div>

          <Button
            onClick={onSubmit}
            className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
            disabled={!phoneNumber || phoneNumber.length < 10}
          >
            إرسال الرمز
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMethod;
