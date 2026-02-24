import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone } from 'lucide-react';
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
    <div className="bg-card rounded-2xl border gold-border p-8 text-center">
      <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
      <h2 className="text-xl font-bold text-foreground mb-2">رمز تأكيد الدفع</h2>
      <p className="text-sm text-muted-foreground mb-6">أدخل الرمز المرسل إلى هاتفك لتأكيد عملية الدفع</p>

      <Input
        value={confirmCode}
        onChange={e => {
          setConfirmCode(toEnglishNumbers(e.target.value));
          if (onClearError) onClearError();
        }}
        placeholder="أدخل الرمز"
        className="bg-secondary border-border text-foreground text-center text-2xl tracking-[0.5em] py-6 mb-3"
        dir="ltr"
        maxLength={6}
        type="text"
        inputMode="numeric"
      />

      {codeError && <p className="text-red-500 text-sm mb-4">{codeError}</p>}
      {!codeError && <div className="mb-3" />}

      <Button
        onClick={onSubmit}
        className="w-full py-5 font-bold gold-gradient text-primary-foreground"
        disabled={!confirmCode || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جاري التحقق...
          </>
        ) : (
          'تأكيد'
        )}
      </Button>
    </div>
  );
};

export default ConfirmCode;
