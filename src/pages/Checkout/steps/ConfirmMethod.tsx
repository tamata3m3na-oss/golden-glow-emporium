import { toEnglishNumbers } from '@/lib/utils';

interface ConfirmMethodProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmMethod = ({ phoneNumber, setPhoneNumber, onSubmit }: ConfirmMethodProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-10">
        <img
          src="/tamara-logo.webp"
          alt="Tamara"
          className="h-12 w-auto mx-auto"
        />
      </div>

      <h1 className="text-2xl font-bold text-center mb-3" style={{ color: '#111827' }}>
        أدخل رقم الجوال
      </h1>

      <p className="text-sm text-center mb-10" style={{ color: '#6B7280' }}>
        سيتم إرسال رمز تحقق للمتابعة
      </p>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-right text-sm font-medium" style={{ color: '#374151' }}>
            رقم الجوال
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(toEnglishNumbers(e.target.value))}
              placeholder="اكتب رقمك"
              inputMode="numeric"
              className="flex-1 px-4 py-3.5 text-right text-base outline-none bg-transparent"
              dir="rtl"
            />
            <div className="flex items-center gap-2 px-4 py-3.5 border-r border-gray-200" style={{ backgroundColor: '#F9FAFB' }}>
              <span className="text-sm font-medium" style={{ color: '#374151' }}>+966</span>
              <img
                src="https://flagcdn.com/w20/sa.png"
                alt="SA"
                className="w-5 h-3.5 object-cover rounded-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!phoneNumber || phoneNumber.length < 10}
          className="w-full py-4 font-bold rounded-lg transition-all duration-200 text-white"
          style={{
            backgroundColor: phoneNumber && phoneNumber.length >= 10 ? '#000000' : '#9CA3AF',
          }}
        >
          أرسل الرمز
        </button>
      </div>
    </div>
  );
};

export default ConfirmMethod;
