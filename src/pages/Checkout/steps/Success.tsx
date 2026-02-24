import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { Product } from '@/data/products';

interface SuccessProps {
  userName: string;
  orderId: string;
  product: Product;
  activeTotalAmount: number;
  activeInstallments: number;
  activePerInstallment: number;
  formatPrice: (price: number) => string;
}

const Success = ({
  userName,
  orderId,
  product,
  activeTotalAmount,
  activeInstallments,
  activePerInstallment,
  formatPrice,
}: SuccessProps) => {
  return (
    <div className="bg-card rounded-2xl border gold-border p-10 text-center">
      <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
        <Check className="h-10 w-10 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-extrabold gold-text mb-3">تم الشراء بنجاح! 🎉</h2>
      <p className="text-muted-foreground mb-6">شكراً لك {userName}، تم تأكيد طلبك</p>

      <div className="bg-secondary rounded-xl p-5 text-right space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-mono text-xs">{orderId}</span>
          <span className="text-muted-foreground">رقم الطلب</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">{product.name}</span>
          <span className="text-muted-foreground">المنتج</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-primary font-bold">{formatPrice(activeTotalAmount)}</span>
          <span className="text-muted-foreground">المبلغ الإجمالي</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">تمارا</span>
          <span className="text-muted-foreground">طريقة الدفع</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">{activeInstallments} دفعة</span>
          <span className="text-muted-foreground">الدفعات</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">{formatPrice(activePerInstallment)}</span>
          <span className="text-muted-foreground">كل دفعة</span>
        </div>
      </div>

      <Link to="/">
        <Button className="w-full gold-gradient text-primary-foreground font-bold py-5">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};

export default Success;
