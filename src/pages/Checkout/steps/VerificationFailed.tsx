import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface VerificationFailedProps {
  verificationError: string | null;
}

const VerificationFailed = ({ verificationError }: VerificationFailedProps) => {
  return (
    <div className="bg-card rounded-2xl border gold-border p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-red-500 mb-3">فشل التحقق</h2>
      <p className="text-muted-foreground mb-6">{verificationError || 'حدث خطأ أثناء التحقق من الكود'}</p>
      <Link to="/">
        <Button className="w-full py-5 font-bold gold-gradient text-primary-foreground">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};

export default VerificationFailed;
