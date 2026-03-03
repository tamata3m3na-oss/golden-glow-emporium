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
          <img 
            src="/se3ar.jpg" 
            alt="مؤسسة حسين إبراهيم حسين للمجوهرات الذهبية" 
            className="h-12 w-auto object-contain mix-blend-multiply" 
          />
          <span className="text-xs font-bold gold-text leading-tight text-center font-cairo">
            مؤسسة حسين إبراهيم حسين للمجوهرات
          </span>
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
