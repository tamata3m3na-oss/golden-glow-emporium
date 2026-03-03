import { Check, ShoppingBag } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
      <div className="mb-6">
        <img
          src="/tamara-logo.webp"
          alt="Tamara"
          className="h-10 mx-auto object-contain"
        />
      </div>

      <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الشراء بنجاح! 🎉</h2>
      <p className="text-gray-500 mb-6">شكراً لك {userName}، تم تأكيد طلبك</p>

      <div className="bg-gray-50 rounded-xl p-5 text-right space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-mono text-xs">{orderId}</span>
          <span className="text-gray-500">رقم الطلب</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">{product.name}</span>
          <span className="text-gray-500">المنتج</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(340,80%,55%)] font-bold">{formatPrice(activeTotalAmount)}</span>
          <span className="text-gray-500">المبلغ الإجمالي</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">تمارا</span>
          <span className="text-gray-500">طريقة الدفع</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">{activeInstallments} دفعة</span>
          <span className="text-gray-500">الدفعات</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">{formatPrice(activePerInstallment)}</span>
          <span className="text-gray-500">كل دفعة</span>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-700">
          ✅ ستصلك رسالة تأكيد على جوالك مع تفاصيل الدفع
        </p>
      </div>

      <Link to="/">
        <Button className="w-full bg-[#d4af37] hover:bg-[#c9a030] text-white font-bold py-4 rounded-lg">
          <ShoppingBag className="h-4 w-4 ml-2" />
          العودة للتسوق
        </Button>
      </Link>
    </div>
  );
};

export default Success;
