import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Check, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Product } from '@/data/products';
import type { PaymentMethod } from '../types';

interface CheckoutProductProps {
  user: { name: string; email: string };
  product: Product;
  coupon: string;
  couponApplied: boolean;
  discount: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCoupon: (value: string) => void;
  applyCoupon: () => void;
  onConfirm: () => void;
  formatPrice: (price: number) => string;
}

const CheckoutProduct = ({
  user,
  product,
  coupon,
  couponApplied,
  discount,
  finalPrice,
  paymentMethod,
  setPaymentMethod,
  setCoupon,
  applyCoupon,
  onConfirm,
  formatPrice,
}: CheckoutProductProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      {/* Tamara Logo */}
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" fill="none" viewBox="0 0 44 19" className="mx-auto" style={{ color: '#000000' }}>
          <g fill="currentColor" clipPath="url(#n62ibrfvh9o__b)">
            <path d="M5.004 7.674c-.16 0-.394.165-.478.32-.255.487-.44 1.008-.685 1.5-.132.263-.072.419.116.628.502.562 1.023 1.12 1.44 1.748.498.748.43 1.546-.205 2.172a6.281 6.281 0 0 1-1.656 1.19c-.878.417-1.828.68-2.74 1.034-.125.048-.322.213-.338.32-.053.338.134.439.26.493 1.049.456 2.115.877 3.22 1.329.356-.538.717-1.039 1.031-1.567 1.697-2.853 2.07-5.793.512-8.832-.082-.16-.311-.332-.477-.335Zm37.593-3.698-.037-.037a1.293 1.293 0 0 0-2.11 1.412c.065.158.16.3.28.42l.038.039c.731.732 1.551.279 1.83 0a1.296 1.296 0 0 0 0-1.834Zm-5.379.051a1.37 1.37 0 0 0-.299.448l1.963 1.705c.1-.058.192-.13.273-.21l.04-.04c.776-.778.296-1.646 0-1.944a1.371 1.371 0 0 0-1.938 0l-.04.041ZM8.072 3.15s-.485 1.006-.703 1.521c-.094.214-.14.446-.136.68.08 1.793.152 3.589.284 5.378.134 1.823 1.03 3.154 2.714 3.923 1.178.537 2.423.781 3.702.855 1.612.093 3.228.14 4.841.154 2.683.023 5.345-.168 7.972-.696.81-.106 3.34-.762 3.78-1.001.494-.27.461-.205.96-.079 1.207.307 4.396.231 5.314-.04.614-.182 1.175-.328 1.313-.75.564.89.879 1.343 1.85 1.255.973-.087 1.054-.135 2.007-.347.795-.177 1.381-.691 1.62-1.468.148-.481.129-.711.17-1.069.148-1.271-.05-2.477-.78-3.546-.12-.172-.195-.343-.61-.316-.13.008-.323.202-.403.358-.241.474-.423.978-.663 1.457-.134.269-.073.459.137.653.447.41.859.818 1.417 1.384-1.066.112-1.432.227-2.35.299-.918.072-2.6.058-3.073-.777-.346-.61-.569-1.03-1.13-1.446-.935-.693-2.447-.689-3.71-.036-.57.292-1.172.874-1.27 1.554-.043.306-.148.559-.492.647-5.233 1.348-11.366 1.977-16.518 1.4-1.312-.148-2.617-.365-3.855-.85-1.108-.433-1.608-1.2-1.588-2.4.037-2.21.014-4.42 0-6.63a.428.428 0 0 0-.403-.467c-.17-.015-.397.4-.397.4Zm28.3 9.177-4.282-.052s.317-1.695 2.059-1.76c2.506-.091 2.221 1.812 2.221 1.812h.002Z"></path>
            <path d="M2.212 3.354a.427.427 0 0 0-.406-.466c-.174-.015-.398.398-.398.398S.924 4.294.706 4.808c-.094.214-.14.446-.136.68.04.881.077 1.762.121 2.643l.177 3.758c.037.769.08 1.538.12 2.324h.711c.175-.874.477-1.738.497-2.606.024-1.169.023-6.67.016-8.253Z"></path>
          </g>
          <defs>
            <clipPath id="n62ibrfvh9o__b"><path fill="#fff" d="M.449.5H44v18H.449z"></path></clipPath>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col space-y-6">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500">
          <ArrowRight className="h-4 w-4" />
          العودة
        </Link>

        {/* Product Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">تفاصيل المنتج</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-900">{product.name}</span>
              <span className="text-xs text-gray-600">عيار {product.karat}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatPrice(product.price)}
            </div>
            {couponApplied && (
              <>
                <div className="text-sm text-green-600">خصم: -{formatPrice(discount)}</div>
                <div className="text-xl font-bold text-green-600">{formatPrice(finalPrice)}</div>
              </>
            )}
          </div>
        </div>

        {/* Coupon Section */}
        <div>
          <p className="text-sm text-gray-600 mb-2">كود الخصم</p>
          <div className="flex gap-2">
            <Input
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="أدخل الكوبون"
              className="flex-1 bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-0"
              maxLength={30}
              disabled={couponApplied}
            />
            <Button
              onClick={applyCoupon}
              disabled={couponApplied || !coupon.trim()}
              className="bg-black hover:bg-gray-800 text-white font-semibold px-6 rounded-full"
              style={{ borderRadius: '30px' }}
            >
              {couponApplied ? <Check className="h-4 w-4" /> : 'تطبيق'}
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">طريقة الدفع</h3>

          <button
            onClick={() => setPaymentMethod('tamara')}
            className={`w-full p-4 rounded-lg border text-right transition-all ${
              paymentMethod === 'tamara'
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3" dir="rtl">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'tamara' ? 'border-black' : 'border-gray-300'}`}>
                {paymentMethod === 'tamara' && <div className="w-3 h-3 rounded-full bg-black" />}
              </div>
              <span className="font-bold text-black text-lg">Tamara</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 mr-8">تقسيم فاتورتك حتى 36 دفعة بدون فوائد!</p>
          </button>

          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>ادفع قيمة طلبك كاملة</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-bold">حلال</span>
              <span>خدمات مطابقة للشريعة الإسلامية</span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          disabled={!paymentMethod}
          className="w-full py-4 font-bold text-white transition-all duration-200"
          style={{
            backgroundColor: paymentMethod ? '#000000' : '#dddddd',
            borderRadius: '30px',
          }}
        >
          <Lock className="h-5 w-5 ml-2" />
          تأكيد الدفع
        </Button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
