import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/data/products';
import heroImage from '@/assets/hero-gold.jpg';

const Index = () => {
  const products = getProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="مجوهرات ذهبية فاخرة"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold gold-text mb-4 leading-tight">
            مؤسسة حسين إبراهيم حسين
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-2">للمجوهرات الذهبية</p>
          <p className="text-muted-foreground max-w-lg mx-auto mt-4">
            متخصصون في بيع الذهب والمجوهرات والسبائك بأفضل الأسعار
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a href="#products" className="px-8 py-3 rounded-lg gold-gradient text-primary-foreground font-bold hover:opacity-90 transition-opacity">
              تسوق الآن
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg border gold-border text-primary hover:bg-primary/10 font-semibold transition-colors"
            >
              تواصل معنا
            </a>
          </div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold gold-text mb-2">منتجاتنا</h2>
          <p className="text-muted-foreground">اختر من مجموعتنا المميزة من السبائك الذهبية</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-card border-t border-b gold-border">
        <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <h2 className="text-3xl font-extrabold gold-text mb-6">قصتنا</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            نحن متجر متخصص في تقديم أفضل المنتجات بأعلى جودة. نحرص على اختيار منتجاتنا بعناية لضمان رضا عملائنا. نسعى دائماً لتقديم تجربة تسوق فريدة ومميزة.
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-xl font-bold text-foreground mb-6">طرق الدفع المتاحة</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['Visa', 'Mastercard', 'مدى', 'Apple Pay', 'STC Pay', 'تحويل بنكي'].map(method => (
            <span
              key={method}
              className="px-5 py-2.5 rounded-lg bg-card border gold-border text-muted-foreground text-sm font-medium"
            >
              {method}
            </span>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
