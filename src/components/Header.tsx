import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getProducts, type Product } from '@/data/products';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ر.س';
};

const Header = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

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
            <SheetContent side="right" className="bg-card border-border w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-bold gold-text">المنتجات</h2>
                </div>

                <ScrollArea className="flex-1">
                  <div className="flex flex-col">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-4 border-b border-border hover:bg-secondary transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm gold-text font-bold mt-0.5">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center py-2.5 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    لوحة التحكم
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
