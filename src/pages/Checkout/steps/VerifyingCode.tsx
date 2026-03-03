import { Loader2, ShieldCheck, KeyRound } from 'lucide-react';

const VerifyingCode = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
      <div className="mb-6">
        <img
          src="/tamara-logo.webp"
          alt="Tamara"
          className="h-10 mx-auto object-contain"
        />
      </div>

      <div className="w-20 h-20 rounded-full bg-[hsl(340,80%,55%,0.1)] mx-auto mb-6 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[hsl(340,80%,55%)] animate-spin" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">جاري التحقق من الرمز</h2>
      <p className="text-gray-500 mb-4">نقوم بالتحقق من رمز التأكيد</p>
      
      <div className="bg-gray-50 rounded-xl p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 justify-center">
          <KeyRound className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(340,80%,55%)] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[hsl(340,80%,55%)] animate-pulse animation-delay-200" />
            <div className="w-2 h-2 rounded-full bg-[hsl(340,80%,55%)] animate-pulse animation-delay-400" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">الرجاء الانتظار...</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="h-3 w-3" />
          <span>معتمد من هيئة السعودية للبيانات والذكاء الاصطناعي</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyingCode;
