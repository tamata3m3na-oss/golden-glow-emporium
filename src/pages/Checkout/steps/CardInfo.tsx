import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
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
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4" /> رجوع
      </button>

      <div className="bg-card rounded-2xl border gold-border p-8">
        <div className="text-center mb-6">
          <CreditCard className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground">بيانات البطاقة</h2>
          <p className="text-sm text-muted-foreground mt-1">أدخل بيانات بطاقتك البنكية</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground text-sm">اسم حامل البطاقة</Label>
            <Input
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="الاسم كما يظهر على البطاقة"
              className="bg-secondary border-border text-foreground"
              dir="ltr"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm">رقم البطاقة</Label>
            <Input
              value={cardNumber}
              onChange={e => setCardNumber(toEnglishNumbers(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              className="bg-secondary border-border text-foreground text-center tracking-[0.3em]"
              dir="ltr"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">تاريخ الانتهاء</Label>
              <Input
                value={cardExpiry}
                onChange={e => setCardExpiry(toEnglishNumbers(e.target.value))}
                placeholder="MM/YY"
                className="bg-secondary border-border text-foreground text-center"
                dir="ltr"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">CVV</Label>
              <Input
                value={cardCvv}
                onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                placeholder="•••"
                type="password"
                className="bg-secondary border-border text-foreground text-center"
                dir="ltr"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          className="w-full mt-6 py-5 font-bold gold-gradient text-primary-foreground"
          disabled={!cardNumber || !cardExpiry || !cardCvv || !cardName}
        >
          <Lock className="h-4 w-4 ml-2" />
          ادخل
        </Button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          <span>بياناتك محمية بتشفير SSL</span>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
