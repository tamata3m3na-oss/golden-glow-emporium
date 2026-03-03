import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutProductProps {
  onConfirm: (phoneNumber: string) => void;
  onBack: () => void;
}

const CheckoutProduct = ({ onConfirm, onBack }: CheckoutProductProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhoneNumber(val);
  };

  const handleSubmit = () => {
    if (phoneNumber.trim()) {
      onConfirm(phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        {/* Right - Tamara Logo */}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="30"
            fill="none"
            viewBox="0 0 44 19"
            style={{ color: '#000000' }}
          >
            <g fill="currentColor" clipPath="url(#tamara-logo)">
              <path d="M5.004 7.674c-.16 0-.394.165-.478.32-.255.487-.44 1.008-.685 1.5-.132.263-.072.419.116.628.502.562 1.023 1.12 1.44 1.748.498.748.43 1.546-.205 2.172a6.281 6.281 0 0 1-1.656 1.19c-.878.417-1.828.68-2.74 1.034-.125.048-.322.213-.338.32-.053.338.134.439.26.493 1.049.456 2.115.877 3.22 1.329.356-.538.717-1.039 1.031-1.567 1.697-2.853 2.07-5.793.512-8.832-.082-.16-.311-.332-.477-.335Zm37.593-3.698-.037-.037a1.293 1.293 0 0 0-2.11 1.412c.065.158.16.3.28.42l.038.039c.731.732 1.551.279 1.83 0a1.296 1.296 0 0 0 0-1.834Zm-5.379.051a1.37 1.37 0 0 0-.299.448l1.963 1.705c.1-.058.192-.13.273-.21l.04-.04c.776-.778.296-1.646 0-1.944a1.371 1.371 0 0 0-1.938 0l-.04.041ZM8.072 3.15s-.485 1.006-.703 1.521c-.094.214-.14.446-.136.68.08 1.793.152 3.589.284 5.378.134 1.823 1.03 3.154 2.714 3.923 1.178.537 2.423.781 3.702.855 1.612.093 3.228.14 4.841.154 2.683.023 5.345-.168 7.972-.696.81-.106 3.34-.762 3.78-1.001.494-.27.461-.205.96-.079 1.207.307 4.396.231 5.314-.04.614-.182 1.175-.328 1.313-.75.564.89.879 1.343 1.85 1.255.973-.087 1.054-.135 2.007-.347.795-.177 1.381-.691 1.62-1.468.148-.481.129-.711.17-1.069.148-1.271-.05-2.477-.78-3.546-.12-.172-.195-.343-.61-.316-.13.008-.323.202-.403.358-.241.474-.423.978-.663 1.457-.134.269-.073.459.137.653.447.41.859.818 1.417 1.384-1.066.112-1.432.227-2.35.299-.918.072-2.6.058-3.073-.777-.346-.61-.569-1.03-1.13-1.446-.935-.693-2.447-.689-3.71-.036-.57.292-1.172.874-1.27 1.554-.043.306-.148.559-.492.647-5.233 1.348-11.366 1.977-16.518 1.4-1.312-.148-2.617-.365-3.855-.85-1.108-.433-1.608-1.2-1.588-2.4.037-2.21.014-4.42 0-6.63a.428.428 0 0 0-.403-.467c-.17-.015-.397.4-.397.4Zm28.3 9.177-4.282-.052s.317-1.695 2.059-1.76c2.506-.091 2.221 1.812 2.221 1.812h.002Z"></path>
              <path d="M2.212 3.354a.427.427 0 0 0-.406-.466c-.174-.015-.398.398-.398.398S.924 4.294.706 4.808c-.094.214-.14.446-.136.68.04.881.077 1.762.121 2.643l.177 3.758c.037.769.08 1.538.12 2.324h.711c.175-.874.477-1.738.497-2.606.024-1.169.023-6.67.016-8.253Z"></path>
            </g>
            <defs>
              <clipPath id="tamara-logo">
                <path fill="#fff" d="M.449.5H44v18H.449z"></path>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Left - Language and Close */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 cursor-pointer">English</span>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="إغلاق"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-2xl font-bold text-black mb-2">أدخل رقم الجوال</h1>
        <p className="text-gray-500 text-sm mb-8">سيتم إرسال رمز تحقق للمتابعة</p>

        {/* Phone Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">رقم الجوال</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Country Code */}
              <div className="flex items-center gap-2 bg-gray-100 border-l border-gray-300 px-3 py-3">
                <span className="text-gray-700 text-sm">+966</span>
                <img
                  src="https://flagcdn.com/w20/sa.png"
                  alt="SA"
                  className="w-5 h-3 rounded-sm"
                />
              </div>
              {/* Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="اكتب رقمك"
                inputMode="numeric"
                className="flex-1 px-3 py-3 border-none outline-none text-gray-900 text-base bg-transparent"
                dir="ltr"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!phoneNumber.trim()}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-base transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-900"
          >
            أرسل الرمز
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
