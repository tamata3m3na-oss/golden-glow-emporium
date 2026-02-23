import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/data/products';

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useAuth();

  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
  }).format(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-xl border gold-border gold-border-hover overflow-hidden transition-all duration-300 hover:gold-shadow"
    >
      {/* Gold accent top bar */}
      <div className="h-1 gold-gradient" />

      <div className="p-6">
        {/* Karat badge */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 text-xs rounded-full gold-gradient text-primary-foreground font-semibold">
            عيار {product.karat}
          </span>
          <span className="text-xs text-muted-foreground">{product.weight} جرام</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-extrabold gold-text">{formattedPrice}</span>
        </div>

        {/* Buy Button */}
        <Link
          to={user ? `/checkout/${product.id}` : `/login?redirect=/checkout/${product.id}`}
          className="block w-full text-center py-3 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          اشترِ الآن
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
