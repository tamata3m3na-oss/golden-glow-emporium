import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getProducts } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const products = getProducts();
  const product = products.find(p => p.id === Number(id));
  const { user } = useAuth();

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">المنتج غير موجود</h1>
          <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
        </div>
      </Layout>
    );
  }

  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency', currency: 'SAR', minimumFractionDigits: 2,
  }).format(product.price);

  const handleBuy = () => {
    toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowRight className="h-4 w-4" />
            العودة للمنتجات
          </Link>

          <div className="bg-card rounded-2xl border gold-border p-8 gold-shadow">
            <div className="h-1 gold-gradient rounded-full mb-6" />

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs rounded-full gold-gradient text-primary-foreground font-semibold">
                عيار {product.karat}
              </span>
              <span className="text-sm text-muted-foreground">{product.weight} جرام</span>
            </div>

            <h1 className="text-3xl font-extrabold text-foreground mb-4">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold gold-text">{formattedPrice}</span>
            </div>

            {user ? (
              <Link
                to={`/checkout/${product.id}`}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                اشترِ الآن
              </Link>
            ) : (
              <Link
                to={`/login?redirect=/checkout/${product.id}`}
                className="block w-full py-4 rounded-xl gold-gradient text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity text-center"
              >
                سجل دخول للشراء
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
