import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/data/products';
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Award, Truck, Clock } from 'lucide-react';

const BNPLBanner = () => (
  <section className="px-4 py-4">
    <div className="max-w-xl mx-auto rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a1060 0%, #2d1b8a 40%, #1e0a5c 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-yellow-400/10" />
        <div className="absolute top-2 left-1/3 text-yellow-400 text-lg">✦</div>
        <div className="absolute bottom-4 right-8 text-yellow-300 text-sm">✦</div>
        <div className="absolute top-6 right-1/4 text-yellow-200 text-xs">✦</div>
      </div>
      <div className="relative z-10 flex items-center gap-4 p-5">
        <div className="flex-1">
          <p className="text-white font-bold text-lg leading-tight mb-3">
            قسّم طلبك مع تابي أو تمارا
            <br />
            <span className="text-yellow-400">على 4 أو 6 دفعات</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">tamara</span>
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">tabby</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-5xl">🪂</div>
      </div>
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
  { name: 'Google Pay', bg: 'bg-white', text: 'text-gray-800 font-bold text-sm', label: 'G Pay' },
  { name: 'مدى', bg: 'bg-white', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mada_Logo.svg/200px-Mada_Logo.svg.png' },
  { name: 'Tabby', bg: 'bg-purple-600', text: 'text-white font-bold text-sm', label: 'tabby' },
  { name: 'Tamara', bg: 'bg-green-500', text: 'text-white font-bold text-sm', label: 'tamara' },
  { name: 'Apple Pay', bg: 'bg-black', text: 'text-white font-bold text-sm', label: '🍎 Pay' },
  { name: 'STC Pay', bg: 'bg-purple-700', text: 'text-white font-bold text-sm', label: 'STC Pay' },
  { name: 'Visa', bg: 'bg-blue-700', text: 'text-white font-bold text-sm', label: 'VISA' },
  { name: 'تحويل بنكي', bg: 'bg-secondary', text: 'text-foreground text-xs', label: 'تحويل بنكي' },
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

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir === 'left' ? amount : -amount, behavior: 'smooth' });
    }
  };

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
        <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
          {paymentLogos.map((p) => (
            <div
              key={p.name}
              className={`w-16 h-12 rounded-xl flex items-center justify-center ${p.bg} border border-white/10 shadow-md`}
            >
              {p.img ? (
                <img src={p.img} alt={p.name} className="h-7 w-auto object-contain" />
              ) : (
                <span className={p.text}>{p.label}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About / Story Section */}
      <section className="px-4 py-6 border-t gold-border">
        <div className="max-w-md mx-auto rounded-2xl overflow-hidden border gold-border" style={{ background: 'linear-gradient(135deg, hsl(43 74% 49% / 0.12), hsl(225 35% 14%))' }}>
          <div className="p-6 text-center">
            <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
              <polygon points="50,5 95,35 95,65 50,95 5,65 5,35" fill="none" stroke="hsl(43,74%,49%)" strokeWidth="3"/>
              <polygon points="50,20 80,38 80,62 50,80 20,62 20,38" fill="none" stroke="hsl(43,74%,49%)" strokeWidth="2" opacity="0.6"/>
              <line x1="50" y1="5" x2="50" y2="20" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
              <line x1="95" y1="35" x2="80" y2="38" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
              <line x1="95" y1="65" x2="80" y2="62" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
              <line x1="50" y1="95" x2="50" y2="80" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
              <line x1="5" y1="65" x2="20" y2="62" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
              <line x1="5" y1="35" x2="20" y2="38" stroke="hsl(43,74%,49%)" strokeWidth="2"/>
            </svg>
            <h2 className="text-lg font-extrabold gold-text mb-1">مؤسسة حسين إبراهيم حسين</h2>
            <p className="text-sm text-muted-foreground mb-3">للمجوهرات الذهبية</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {staticReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="navy-card rounded-xl p-4"
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
          ))}
        </div>
      </section>

      {/* Bottom spacing for mobile bottom nav */}
      <div className="h-16 md:h-0" />
    </Layout>
  );
};

export default Index;
