import { Link, useLocation } from 'react-router-dom';
import { Home, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t gold-border" style={{ background: 'hsl(225 40% 8% / 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-around py-2 px-4">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className={`p-1.5 rounded-lg ${isActive('/') ? 'gold-gradient' : ''}`}>
            <Home className={`h-5 w-5 ${isActive('/') ? 'text-primary-foreground' : ''}`} />
          </div>
          <span className="text-[10px] font-semibold">الرئيسية</span>
        </Link>

        <Link
          to="#products"
          className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="p-1.5 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-semibold">المنتجات</span>
        </Link>

        <Link
          to={user ? '/dashboard' : '/login'}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${isActive('/dashboard') || isActive('/login') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className={`p-1.5 rounded-lg ${isActive('/dashboard') || isActive('/login') ? 'gold-gradient' : ''}`}>
            <User className={`h-5 w-5 ${isActive('/dashboard') || isActive('/login') ? 'text-primary-foreground' : ''}`} />
          </div>
          <span className="text-[10px] font-semibold">{user ? 'حسابي' : 'دخول'}</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
