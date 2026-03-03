import { toEnglishNumbers } from '@/lib/utils';

interface ConfirmMethodProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmMethod = ({ phoneNumber, setPhoneNumber, onBack, onSubmit }: ConfirmMethodProps) => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6">
      {/* شعار Tamara */}
      <div className="mb-8">
        <img src="/tamara-logo.webp" alt="Tamara" className="h-10 mx-auto" />
      </div>
      
      {/* العنوان */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: '#111827' }}>أدخل رقم الجوال</h2>
      
      {/* الوصف */}
      <p className="text-gray-500 text-sm mb-8" style={{ color: '#6B7280' }}>سيتم إرسال رمز تحقق للمتابعة</p>
      
      {/* النموذج */}
      <div className="w-full max-w-sm space-y-6">
        {/* حقل رقم الجوال */}
        <div>
          <label className="block text-right text-gray-700 font-medium mb-2" style={{ color: '#374151' }}>
            رقم الجوال
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden" style={{ borderColor: '#D1D5DB' }}>
            {/* حقل الإدخال */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(toEnglishNumbers(e.target.value))}
              placeholder="اكتب رقمك"
              inputMode="numeric"
              className="flex-1 px-4 py-3 text-right text-lg outline-none bg-white"
              dir="rtl"
              style={{ color: '#111827' }}
            />
            {/* كود الدولة */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-r border-gray-300" style={{ backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }}>
              <span className="text-gray-700 font-medium" style={{ color: '#374151' }}>+966</span>
              <img 
                src="https://flagcdn.com/w20/sa.png" 
                alt="SA" 
                className="w-5 h-4 object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
        
        {/* زر الإرسال */}
        <button
          onClick={onSubmit}
          disabled={!phoneNumber || phoneNumber.length < 10}
          className="w-full py-3.5 font-bold rounded-lg transition-colors text-white"
          style={{
            backgroundColor: phoneNumber && phoneNumber.length >= 10 ? '#000000' : '#9CA3AF'
          }}
        >
          أرسل الرمز
        </button>
      </div>
    </div>
  );
};

export default ConfirmMethod;
