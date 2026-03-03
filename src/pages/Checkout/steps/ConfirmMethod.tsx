import { toEnglishNumbers } from '@/lib/utils';

interface ConfirmMethodProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmMethod = ({ phoneNumber, setPhoneNumber, onBack, onSubmit }: ConfirmMethodProps) => {
  const isValid = phoneNumber.length >= 9;

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4L4 14M4 4L14 14" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <img
            src="/tamara-logo.webp"
            alt="تمارا"
            className="h-8 object-contain"
          />
        </div>

        {/* Separator */}
        <div className="h-px bg-[#eee] mx-0" />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          <h1 className="text-[22px] font-bold text-black mb-1 text-right">
            ادخل رقم جوالك
          </h1>
          <p className="text-[13px] text-[#555] mb-6 text-right">
            راح نرسل لك رمز تحقق عشان نتأكد من هويتك
          </p>

          {/* Phone input */}
          <div
            className="flex items-center border rounded-[10px] overflow-hidden mb-2"
            style={{ borderColor: '#dcdcdc' }}
          >
            {/* Country code - right side for RTL */}
            <div
              className="flex items-center gap-2 px-3 py-3 border-l"
              style={{ borderColor: '#dcdcdc', backgroundColor: '#fafafa' }}
            >
              <span className="text-lg leading-none">🇸🇦</span>
              <span className="text-[14px] font-bold text-black" dir="ltr">+966</span>
            </div>

            {/* Phone number input */}
            <input
              value={phoneNumber}
              onChange={e => setPhoneNumber(toEnglishNumbers(e.target.value))}
              placeholder="اكتب رقمك"
              className="flex-1 px-3 py-3 text-[15px] text-black bg-white outline-none placeholder-[#aaa]"
              style={{ direction: 'ltr', textAlign: 'right' }}
              maxLength={10}
              type="tel"
              inputMode="numeric"
            />
          </div>

          <p className="text-[12px] text-[#888] mb-8 text-right">
            يجب أن يكون الرقم مسجل باسمك في البنك
          </p>

          {/* Submit button */}
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full py-[14px] text-[16px] font-bold text-white rounded-[30px] transition-colors"
            style={{
              backgroundColor: isValid ? '#000000' : '#ddd',
              color: isValid ? '#fff' : '#999',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            أرسل الرمز
          </button>

          {/* Bottom note */}
          <p className="text-[11px] text-[#aaa] text-center mt-6">
            بالمتابعة، أنت توافق على{' '}
            <a
              href="https://tamara.co/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6C1DD6] underline"
            >
              شروط وأحكام تمارا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMethod;
