import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>

        <Link to="/" className="flex flex-col items-center gap-1">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 95,35 95,65 50,95 5,65 5,35" fill="none" stroke="hsl(43,74%,49%)" strokeWidth="3"/>
            <polygon points="50,20 80,38 80,62 50,80 20,62 20,38" fill="none" stroke="hsl(43,74%,49%)" strokeWidth="2" opacity="0.6"/>
            <line x1="50" y1="5" x2="50" y2="20" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            <line x1="95" y1="35" x2="80" y2="38" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            <line x1="95" y1="65" x2="80" y2="62" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            <line x1="50" y1="95" x2="50" y2="80" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            <line x1="5" y1="65" x2="20" y2="62" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            <line x1="5" y1="35" x2="20" y2="38" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
          </svg>
          <span className="text-xs font-bold gold-text leading-tight text-center">مؤسسة حسين إبراهيم حسين</span>
          <span className="text-[10px] text-muted-foreground leading-tight">للمجوهرات الذهبية</span>
        </Link>

        <div className="flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
