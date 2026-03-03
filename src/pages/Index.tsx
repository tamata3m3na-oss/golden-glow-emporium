import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/data/products';
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Award, Truck, Clock } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const BNPLBanner = () => (
  <section className="px-4 py-4">
    <div className="max-w-xl mx-auto rounded-2xl overflow-hidden relative">
      <img src="/logo2.jpg" alt="بانر الأقساط" className="w-full h-full object-cover" />
    </div>
  </section>
);

const features = [
  { icon: ShieldCheck, label: 'ضمان الجودة', sub: 'ذهب خالص معتمد' },
  { icon: Award, label: 'عيار 24 قيراط', sub: 'أعلى نقاء' },
  { icon: Truck, label: 'توصيل سريع', sub: 'لجميع المناطق' },
  { icon: Clock, label: 'خدمة 24/7', sub: 'دعم متواصل' },
];

const staticReviews = [
  {
    name: 'سارة الأحمدي',
    city: 'الرياض',
    rating: 5,
    text: 'تجربة ممتازة! المنتج أصلي والتوصيل سريع جداً. سأتسوق مجدداً بكل تأكيد.',
    date: 'منذ أسبوع',
    avatar: 'س',
  },
  {
    name: 'نورة المطيري',
    city: 'جدة',
    rating: 5,
    text: 'سبيكة الذهب وصلت بحالة ممتازة مع شهادة الجودة. خدمة العملاء محترفة ومتجاوبة.',
    date: 'منذ أسبوعين',
    avatar: 'ن',
  },
  {
    name: 'منى الغامدي',
    city: 'الدمام',
    rating: 5,
    text: 'أفضل متجر للذهب في المملكة! الأسعار تنافسية والجودة عالية جداً.',
    date: 'منذ شهر',
    avatar: 'م',
  },
  {
    name: 'هند العتيبي',
    city: 'مكة المكرمة',
    rating: 5,
    text: 'اشتريت سبيكة هدية لوالدي وكان سعيداً جداً. التغليف أنيق والمنتج أصلي 100%.',
    date: 'منذ شهر',
    avatar: 'هـ',
  },
  {
    name: 'رنا الشهري',
    city: 'أبها',
    rating: 5,
    text: 'خدمة استثنائية وسرعة في التوصيل. المنتج مطابق تماماً للوصف. شكراً!',
    date: 'منذ شهرين',
    avatar: 'ر',
  },
  {
    name: 'أميرة القحطاني',
    city: 'الطائف',
    rating: 5,
    text: 'تعاملت معهم أكثر من مرة ودائماً راضية. الذهب أصلي والسعر مناسب.',
    date: 'منذ شهرين',
    avatar: 'أ',
  },
];

const paymentLogos = [
  { name: 'طريقة دفع 1', img: 'https://checkout.tamara.center/pay/pay1.jpg' },
  { name: 'طريقة دفع 2', img: 'https://checkout.tamara.center/pay/pay2.jpg' },
  { name: 'طريقة دفع 3', img: 'https://checkout.tamara.center/pay/pay3.jpg' },
  { name: 'طريقة دفع 4', img: 'https://checkout.tamara.center/pay/pay4.jpg' },
  { name: 'طريقة دفع 5', img: 'https://checkout.tamara.center/pay/pay5.jpg' },
  { name: 'طريقة دفع 6', img: 'https://checkout.tamara.center/pay/pay6.jpg' },
  { name: 'طريقة دفع 7', img: 'https://checkout.tamara.center/pay/pay12.jpg' },
  { name: 'طريقة دفع 8', img: 'https://checkout.tamara.center/pay/pay11.jpg' },
  { name: 'طريقة دفع 9', img: 'https://checkout.tamara.center/pay/pay9.jpg' },
  { name: 'طريقة دفع 10', img: 'https://checkout.tamara.center/pay/pay8.jpg' },
];

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
      />
    ))}
  </div>
);

const Index = () => {
  const products = getProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentReview, setCurrentReview] = useState(0);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir === 'left' ? amount : -amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % staticReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <BNPLBanner />

      {/* Products Section */}
      <section id="products" className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5 px-4"
        >
          <h2 className="text-2xl font-extrabold gold-text mb-1">سبائك الذهب المتاحة</h2>
          <div className="w-16 h-0.5 gold-gradient mx-auto rounded-full" />
        </motion.div>

        <div className="relative px-2">
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border gold-border flex items-center justify-center text-primary hover:bg-primary/10 transition-colors shadow-lg"
            aria-label="التالي"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 pb-4 snap-x snap-mandatory"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex-shrink-0 w-[300px] snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border gold-border flex items-center justify-center text-primary hover:bg-primary/10 transition-colors shadow-lg"
            aria-label="السابق"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mt-4 px-4">
          <Link
            to="#products"
            className="inline-block px-8 py-2.5 rounded-full gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      </section>

      {/* Features Strip */}
      <section className="px-4 py-6 border-t border-b gold-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {features.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="px-4 py-8 text-center">
        <h3 className="text-xl font-bold gold-text mb-2">طرق دفع آمنة</h3>
        <div className="w-12 h-0.5 gold-gradient mx-auto rounded-full mb-6" />
        <div className="flex flex-wrap justify-center items-center gap-4 max-w-2xl mx-auto">
          {paymentLogos.map((p) => (
            <div
              key={p.name}
              className="w-20 h-14 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-md"
            >
              <img src={p.img} alt={p.name} className="h-9 w-auto object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* About / Story Section */}
      <section className="px-4 py-6 border-t gold-border">
        <div className="max-w-md mx-auto rounded-2xl overflow-hidden border gold-border" style={{ background: 'linear-gradient(135deg, hsl(43 74% 49% / 0.12), hsl(225 35% 14%))' }}>
          <div className="p-6 text-center">
            <img src="/se3ar.svg" alt="شعار مؤسسة حسين إبراهيم حسين" className="mx-auto h-40 w-auto object-contain mb-3" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              متجر متخصص في قطاع المجوهرات والذهب، نقدم أفضل المنتجات بأعلى جودة وعيار 24 قيراط معتمد. نحرص على رضا عملائنا وتقديم تجربة تسوق استثنائية.
            </p>
            <div className="mt-4 flex gap-3 justify-center">
              <a
                href="https://wa.me/966594241060"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                تواصل معنا
              </a>
              <Link
                to="/about"
                className="px-5 py-2 rounded-full border gold-border text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
              >
                من نحن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="px-4 py-8 border-t gold-border">
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold gold-text mb-1">آراء عملائنا</h2>
          <div className="w-12 h-0.5 gold-gradient mx-auto rounded-full" />
          <p className="text-sm text-muted-foreground mt-2">ماذا يقول عملاؤنا الكرام</p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {staticReviews.map((review, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="navy-card rounded-xl p-4 h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.city} · {review.date}</p>
                    </div>
                  </div>
                  <StarRating count={review.rating} />
                  <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{review.text}</p>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </Carousel>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {staticReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentReview(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentReview ? 'w-6 gold-gradient' : 'bg-muted-foreground/30'
              }`}
              aria-label={`الانتقال إلى الرأي ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Bottom spacing for mobile bottom nav */}
      <div className="h-16 md:h-0" />
    </Layout>
  );
};

export default Index;
