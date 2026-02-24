import { BarChart2, Package, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Stats } from './types';

interface StatsTabProps {
  stats: Stats | null;
  statsLoading: boolean;
  hasBackend: boolean;
  onRefresh: () => void;
  formatPrice: (price: number) => string;
}

const StatsTab = ({ stats, statsLoading, hasBackend, onRefresh, formatPrice }: StatsTabProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">الإحصائيات</h2>
        <Button variant="ghost" size="icon" onClick={onRefresh} className="text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {!hasBackend ? (
        <div className="bg-card rounded-2xl border gold-border p-12 text-center">
          <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">الإحصائيات تتطلب ربط Backend</p>
          <p className="text-sm text-muted-foreground/60 mt-2">أضف VITE_API_URL في متغيرات البيئة</p>
        </div>
      ) : statsLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-400' },
            { label: 'طلبات اليوم', value: stats.todayOrders, icon: ShoppingBag, color: 'text-green-400' },
            { label: 'طلبات الشهر', value: stats.monthOrders, icon: ShoppingBag, color: 'text-yellow-400' },
            { label: 'طلبات معلقة', value: stats.pendingOrders, icon: ShoppingBag, color: 'text-orange-400' },
            { label: 'إجمالي المنتجات', value: stats.totalProducts, icon: Package, color: 'text-primary' },
            { label: 'إجمالي العملاء', value: stats.totalUsers, icon: Users, color: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card rounded-xl border gold-border p-5">
              <Icon className={`h-6 w-6 ${color} mb-3`} />
              <p className="text-2xl font-extrabold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 bg-card rounded-xl border gold-border p-5">
            <BarChart2 className="h-6 w-6 text-primary mb-3" />
            <p className="text-3xl font-extrabold gold-text">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-sm text-muted-foreground mt-1">إجمالي الإيرادات (صافي التحويل)</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">تعذر تحميل الإحصائيات</div>
      )}
    </div>
  );
};

export default StatsTab;
