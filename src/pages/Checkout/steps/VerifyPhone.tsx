import { useRef, useEffect, useState, ClipboardEvent, KeyboardEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toEnglishNumbers } from '@/lib/utils';

interface VerifyPhoneProps {
  phoneNumber: string;
  activationCode: string;
  setActivationCode: (value: string) => void;
  agreedTerms: boolean;
  setAgreedTerms: (value: boolean) => void;
  codeError: string | null;
  resendTimer: number;
  formatTimer: (seconds: number) => string;
  isVerifyingCode: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onClearError: () => void;
}

const OTP_LENGTH = 6;

const VerifyPhone = ({
  phoneNumber,
  activationCode,
  setActivationCode,
  agreedTerms,
  setAgreedTerms,
  codeError,
  resendTimer,
  formatTimer,
  isVerifyingCode,
  onBack,
  onSubmit,
  onClearError,
}: VerifyPhoneProps) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    if (activationCode === '') {
      setDigits(Array(OTP_LENGTH).fill(''));
    }
  }, [activationCode]);

  const syncToParent = (newDigits: string[]) => {
    const code = newDigits.join('');
    setActivationCode(code);
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = toEnglishNumbers(value).replace(/\D/g, '');
    if (!cleaned) return;
    const digit = cleaned[cleaned.length - 1];

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    syncToParent(newDigits);
    onClearError();

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        setDigits(newDigits);
        syncToParent(newDigits);
        onClearError();
      } else if (index > 0) {
        newDigits[index - 1] = '';
        setDigits(newDigits);
        syncToParent(newDigits);
        onClearError();
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      if (index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight') {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = toEnglishNumbers(e.clipboardData.getData('text')).replace(/\D/g, '');
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newDigits[i] = pasted[i] ?? '';
    }
    setDigits(newDigits);
    syncToParent(newDigits);
    onClearError();
    const nextEmpty = newDigits.findIndex(d => !d);
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const isCodeComplete = digits.every(d => d !== '');
  const isSubmitDisabled = !isCodeComplete || !agreedTerms || isVerifyingCode;

  const displayPhone = phoneNumber.startsWith('0')
    ? `+966 ${phoneNumber.slice(1)}`
    : phoneNumber;

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
              aria-label="رجوع"
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
        <div className="h-px bg-[#eee]" />

        {/* Content */}
        <div className="px-5 py-6 flex flex-col flex-1">
          <h1 className="text-[22px] font-bold text-black mb-1 text-right">
            أدخل رمز التحقق
          </h1>
          <p className="text-[13px] text-[#555] mb-5 text-right">
            تم إرسال رمز التحقق عبر الرسائل القصيرة
          </p>

          {/* Phone card */}
          <div
            className="flex items-center gap-3 p-4 rounded-[10px] mb-6"
            style={{ border: '1px solid #eee', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#f0e8fc' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 11.5c-.4-.4-1-.4-1.4 0l-.8.8c-.6-.3-1.9-1.3-2.8-2.2C7.6 9.2 6.6 7.9 6.3 7.3l.8-.8c.4-.4.4-1 0-1.4L5.6 3.6c-.4-.4-1-.4-1.4 0L3.1 4.7c-.4.4-.6.9-.5 1.5.4 2.1 1.8 4.7 3.7 6.6 1.9 1.9 4.5 3.3 6.6 3.7.5.1 1.1-.1 1.5-.5l1.1-1.1c.4-.4.4-1 0-1.4l-1.5-1.5z" fill="#6C1DD6"/>
              </svg>
            </div>
            <div className="flex-1 text-right">
              <span
                className="text-[15px] font-bold text-black underline"
                dir="ltr"
              >
                {displayPhone}
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-[13px] font-medium"
              style={{ color: '#6C1DD6' }}
            >
              تبي تغير الرقم؟
            </button>
          </div>

          {/* OTP boxes */}
          <div className="flex justify-center gap-2 mb-3" dir="ltr">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-[44px] h-[52px] text-center text-[20px] font-bold rounded-[10px] outline-none transition-all"
                style={{
                  border: codeError
                    ? '2px solid #ef4444'
                    : digit
                    ? '2px solid #6C1DD6'
                    : '2px solid #dcdcdc',
                  color: '#000',
                  backgroundColor: digit ? '#f6f0fe' : '#fff',
                  boxShadow: digit ? '0 0 0 3px rgba(108,29,214,0.08)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Error message */}
          {codeError && (
            <p className="text-red-500 text-[13px] text-center mb-3">{codeError}</p>
          )}

          {/* Timer / resend */}
          <div className="mb-6 text-center">
            {resendTimer > 0 ? (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-[#555]"
                style={{ backgroundColor: '#f5f6f9' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="6" stroke="#888" strokeWidth="1.4"/>
                  <path d="M7 4v3.5l2 1.2" stroke="#888" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span>إعادة الإرسال خلال {formatTimer(resendTimer)}</span>
              </div>
            ) : (
              <button
                className="text-[14px] font-bold underline"
                style={{ color: '#6C1DD6' }}
                onClick={() => {}}
              >
                إعادة إرسال الرمز
              </button>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 text-right">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: agreedTerms ? '#6C1DD6' : '#fff',
                  border: agreedTerms ? '2px solid #6C1DD6' : '2px solid #ccc',
                }}
                onClick={() => setAgreedTerms(!agreedTerms)}
              >
                {agreedTerms && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[13px] text-[#444] leading-relaxed">
              أوافق على{' '}
              <a
                href="https://tamara.co/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#6C1DD6' }}
                className="underline font-medium"
              >
                شروط وأحكام تمارا
              </a>
            </span>
          </label>

          {/* Submit button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="w-full py-[14px] text-[16px] font-bold rounded-[30px] transition-colors flex items-center justify-center gap-2"
            style={{
              backgroundColor: isSubmitDisabled ? '#ddd' : '#000',
              color: isSubmitDisabled ? '#999' : '#fff',
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {isVerifyingCode ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              'تأكيد'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
