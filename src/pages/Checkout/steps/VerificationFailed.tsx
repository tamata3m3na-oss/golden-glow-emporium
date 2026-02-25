import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationFailedProps {
  verificationError: string | null;
  onRetry: () => void;
}

const VerificationFailed = ({ verificationError, onRetry }: VerificationFailedProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
      <div className="mb-6">
        <img
          src="/tamara-logo.webp"
          alt="Tamara"
          className="h-10 mx-auto object-contain"
        />
      </div>

      <div className="w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6 flex items-center justify-center">
        <AlertCircle className="h-10 w-10 text-orange-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">فشل التحقق</h2>
      <p className="text-gray-500 mb-2">لم نتمكن من إتمام عملية التحقق</p>

      {verificationError && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-700">{verificationError}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-500">
          إذا كنت تعتقد أن هناك خطأ، يرجى التواصل مع خدمة العملاء
        </p>
      </div>

      <Button onClick={onRetry} className="w-full bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white font-bold py-4 rounded-lg">
        <RefreshCw className="h-4 w-4 ml-2" />
        المحاولة مرة أخرى
      </Button>
    </div>
  );
};

export default VerificationFailed;
