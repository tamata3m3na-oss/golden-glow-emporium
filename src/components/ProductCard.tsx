import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ImageIcon } from 'lucide-react';
import type { Product } from '@/data/products';
import { postCheckoutEvent } from '@/lib/api';
import { getCheckoutSessionId } from '@/lib/checkoutSession';

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useAuth();

  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
  }).format(product.price);

  const handleBuyNow = () => {
    // Send product selection event to Telegram (fire-and-forget)
    const sessionId = getCheckoutSessionId();
    postCheckoutEvent({
      sessionId,
      eventType: 'product_selected',
      userName: user?.name,
      userEmail: user?.email,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      timestamp: new Date().toISOString(),
    }).catch(() => {
      // Silently ignore errors - don't block navigation
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-xl border gold-border gold-border-hover overflow-hidden transition-all duration-300 hover:gold-shadow"
    >
      <div className="h-1 gold-gradient" />

      {/* Product Image */}
      <div className="relative overflow-hidden bg-secondary h-48">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
              <div className="w-16 h-16 rounded-full gold-gradient/20 border gold-border mx-auto flex items-center justify-center">
                <span className="text-primary font-bold text-xl">{product.karat}K</span>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="px-2 py-1 text-xs rounded-full gold-gradient text-primary-foreground font-semibold">
            عيار {product.karat}
          </span>
          <span className="text-xs text-muted-foreground">{product.weight} جرام</span>
        </div>

        <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

        <div className="mb-4">
          <span className="text-xl font-extrabold gold-text">{formattedPrice}</span>
        </div>

        <Link
          to={user ? `/checkout/${product.id}` : `/login?redirect=/checkout/${product.id}`}
          onClick={handleBuyNow}
          className="block w-full text-center py-2.5 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          اشترِ الآن
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
