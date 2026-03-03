import { useState } from "react";

// SVG Components
function SaFlag1() {
  return (
    <div
      className="relative h-[15px] w-[22px] rounded-[3px] overflow-hidden"
      data-name="SA Flag"
    >
      <img
        alt="SA Flag"
        className="w-full h-full object-cover"
        src="https://flagcdn.com/w40/sa.png"
      />
    </div>
  );
}

function TamaraLogo() {
  return (
    <div className="absolute h-[26px] right-[41px] top-[20px] w-[60px]" data-name="svg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="26"
        fill="none"
        viewBox="0 0 60 26"
        style={{ color: '#000000' }}
      >
        <g fill="currentColor" clipPath="url(#tamara-logo)">
          <path d="M6.824 10.487c-.218 0-.537.225-.651.436-.347.663-.6 1.374-.934 2.044-.18.358-.098.571.158.856.684.765 1.394 1.525 1.962 2.382.678 1.019.586 2.106-.28 2.959a8.562 8.562 0 0 1-2.258 1.623c-1.198.569-2.495.927-3.738 1.41-.17.066-.44.29-.461.434-.072.461.183.598.355.667 1.43.623 2.884 1.197 4.391 1.814.486-.734.978-1.417 1.406-2.137 2.315-3.893 2.824-7.904.698-12.048-.112-.217-.424-.451-.651-.456Zm51.223-5.038-.05-.051a1.762 1.762 0 0 0-2.878 1.924c.089.215.218.409.382.572l.052.053c.996.998 2.115.381 2.495 0a1.765 1.765 0 0 0 0-2.498Zm-7.335.07a1.867 1.867 0 0 0-.407.608l2.677 2.325c.137-.079.262-.177.373-.287l.054-.054c1.058-1.06.405-2.245 0-2.65a1.868 1.868 0 0 0-2.643 0l-.054.058ZM11.004 4.285s-.662 1.372-.959 2.076c-.128.292-.191.608-.186.927.109 2.447.207 4.9.387 7.343.183 2.49 1.405 4.305 3.703 5.355 1.608.733 3.306 1.066 5.05 1.167 2.199.127 4.405.191 6.607.21 3.663.031 7.3-.229 10.89-.951 1.106-.145 4.56-1.04 5.162-1.366.675-.369.63-.28 1.312-.108 1.648.42 6.002.316 7.255-.054.839-.248 1.605-.448 1.793-1.025.77 1.214 1.199 1.832 2.525 1.714 1.33-.118 1.44-.184 2.74-.474 1.086-.242 1.887-.944 2.213-2.005.202-.657.176-.971.233-1.459.202-1.735-.068-3.383-1.063-4.844-.164-.235-.266-.468-.834-.432-.177.011-.441.276-.55.489-.329.647-.577 1.335-.905 1.989-.183.367-.1.627.187.893.61.56 1.173 1.115 1.935 1.889-1.454.153-1.953.31-3.206.408-1.252.098-3.548.08-4.194-1.062-.472-.833-.777-1.406-1.543-1.974-1.276-.946-3.339-.94-5.065-.049-.779.399-1.602 1.193-1.736 2.12-.059.418-.202.763-.672.884-7.142 1.84-15.514 2.7-22.542 1.91-1.79-.202-3.572-.498-5.262-1.161-1.514-.591-2.197-1.639-2.17-3.277.051-3.017.019-6.034 0-9.052a.585.585 0 0 0-.551-.637c-.232-.021-.542.546-.542.546Zm38.637 12.528-5.839-.07s.433-2.311 2.808-2.4c3.419-.124 3.03 2.471 3.03 2.471h.001Z" />
          <path d="M3.016 4.565a.583.583 0 0 0-.553-.636c-.237-.02-.543.544-.543.544s-1.27 1.275-1.567 1.976c-.128.292-.191.608-.186.927.054 1.203.105 2.404.164 3.604l.242 5.128c.05 1.047.109 2.097.164 3.169h.97c.239-1.192.651-2.37.678-3.555.033-1.596.031-9.098.021-11.167Z" />
        </g>
        <defs>
          <clipPath id="tamara-logo">
            <path fill="#fff" d="M.613.684h59.455v24.684H.613z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Props Interface
interface CheckoutProductProps {
  onConfirm: () => void;
  onBack: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isLoading?: boolean;
}

export default function CheckoutProduct({
  onConfirm,
  onBack,
  phoneNumber,
  setPhoneNumber,
  isLoading = false,
}: CheckoutProductProps) {
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (phoneNumber.length !== 9) {
      setError("يجب إدخال 9 أرقام");
      return;
    }
    onConfirm();
  };

  const isButtonEnabled = phoneNumber.length === 9 && !isLoading;

  return (
    <div className="bg-white relative size-full" data-name="phone-verification">
      {/* Header */}
      <div className="absolute border-[#eee] border-b border-solid h-[69px] left-0 right-0 top-0" data-name="Header">
        {/* Language Toggle */}
        <button
          onClick={onBack}
          className="absolute font-['Tajawal',sans-serif] h-[26px] leading-[normal] left-[41px] not-italic top-[20px] w-[62px] whitespace-nowrap flex items-center gap-1 hover:opacity-70 transition-opacity"
          data-name="LanguageButton"
        >
          <p className="text-[#444] text-[22px]">×</p>
          <p className="text-[#555] text-[14px]">English</p>
        </button>
        {/* Tamara Logo */}
        <TamaraLogo />
      </div>

      {/* Main Content */}
      <div className="absolute left-1/2 top-[153px] -translate-x-1/2 w-[600px] flex flex-col items-center">
        {/* Title */}
        <h1
          className="font-['Tajawal',sans-serif] font-bold text-[24px] text-black text-right mb-2 w-[360px]"
          dir="auto"
        >
          أدخل رقم الجوال
        </h1>

        {/* Subtitle */}
        <p
          className="font-['Tajawal',sans-serif] text-[14px] text-[#666] text-right mb-6 w-[360px]"
          dir="auto"
        >
          سيتم إرسال رمز تحقق للمتابعة
        </p>

        {/* Input Label */}
        <div className="w-[360px] text-right mb-1">
          <label
            className="font-['Tajawal',sans-serif] text-[14px] text-[#333]"
            dir="auto"
          >
            رقم الجوال
          </label>
        </div>

        {/* Phone Input Container */}
        <div className="relative w-[360px] h-[45px] bg-white border border-[#dcdcdc] rounded-[10px] overflow-hidden mb-4">
          {/* Input Field */}
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="اكتب رقمك"
            dir="rtl"
            className="absolute left-0 top-0 h-full w-[271px] px-[10px] font-['Inter','Noto Sans Arabic',sans-serif] text-[12px] text-black bg-white border-0 outline-none"
          />

          {/* Country Code Section */}
          <div className="absolute bg-[#f7f7f7] border-[#ddd] border-r border-solid h-full right-0 w-[87px] flex items-center justify-center gap-1 px-2">
            <div className="relative h-[15px] w-[22px]">
              <SaFlag1 />
            </div>
            <p className="font-['Tajawal',sans-serif] text-[16px] text-black">
              966+
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="font-['Tajawal',sans-serif] text-[12px] text-red-500 mb-2 text-right w-[360px]">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className={`w-[360px] h-[46px] rounded-[30px] font-['Inter','Noto Sans Arabic',sans-serif] text-[16px] text-center transition-all ${
            isButtonEnabled
              ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
              : "bg-[#ddd] text-[#999] cursor-not-allowed"
          }`}
          dir="auto"
        >
          {isLoading ? "جاري الإرسال..." : "أرسل الرمز"}
        </button>
      </div>
    </div>
  );
}
