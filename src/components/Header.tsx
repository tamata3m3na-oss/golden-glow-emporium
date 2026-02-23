import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'الرئيسية', path: '/' },
  { label: 'من نحن', path: '/about' },
  { label: 'مقاس الخاتم', path: '/ring-size' },
  { label: 'شروط التوصيل', path: '/delivery' },
  { label: 'الأحكام الشرعية', path: '/shariah' },
  { label: 'سياسة الخصوصية', path: '/privacy' },
  { label: 'الشروط والأحكام', path: '/terms' },
  { label: 'الاسترجاع والاستبدال', path: '/returns' },
];

const Header = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-dark border-b gold-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-bold gold-text leading-tight">مؤسسة حسين إبراهيم حسين</span>
            <span className="text-xs text-muted-foreground leading-tight">للمجوهرات الذهبية</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 4).map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-2 text-sm text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth + Mobile */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                <User className="h-4 w-4 ml-1" />
                {user.name}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gold-gradient text-primary-foreground font-semibold">
                تسجيل الدخول
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-72">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm text-primary hover:bg-secondary rounded-md transition-colors mt-4 border-t border-border pt-4"
                >
                  لوحة التحكم
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
