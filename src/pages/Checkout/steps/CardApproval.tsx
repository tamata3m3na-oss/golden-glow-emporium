import { Loader2 } from 'lucide-react';

const CardApproval = () => {
  return (
    <div className="bg-card rounded-2xl border gold-border p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-extrabold gold-text mb-3">بانتظار الموافقة</h2>
      <p className="text-muted-foreground mb-6">جاري مراجعة طلبك من قبل الإدارة</p>
      <p className="text-sm text-muted-foreground">سيتم تحديث الصفحة تلقائياً بعد الموافقة</p>
    </div>
  );
};

export default CardApproval;
