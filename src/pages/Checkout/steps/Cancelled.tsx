import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Cancelled = () => {
  return (
    <div className="bg-card rounded-2xl border gold-border p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-red-500 mb-3">تم إلغاء الطلب</h2>
      <p className="text-muted-foreground mb-6">تم رفض بيانات البطاقة من قبل الإدارة</p>
      <Link to="/">
        <Button className="w-full py-5 font-bold gold-gradient text-primary-foreground">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};

export default Cancelled;
