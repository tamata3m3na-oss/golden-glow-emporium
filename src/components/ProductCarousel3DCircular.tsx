import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getProducts, type Product } from '@/data/products';
import { postCheckoutEvent } from '@/lib/api';
import { getCheckoutSessionId } from '@/lib/checkoutSession';

const CARD_WIDTH = 222;
const CARD_HEIGHT = 331;

const CarouselCard = ({ product }: { product: Product }) => {
  const { user } = useAuth();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price) + ' ر.س';

  const handleBuyNow = () => {
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
    }).catch(() => {});
  };

  return (
    <div
      className="relative rounded-xl border overflow-hidden flex-shrink-0"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        background: '#0F172A',
        borderColor: 'rgba(212, 175, 55, 0.3)',
      }}
    >
      <div
        className="h-1"
        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #F6E27A 100%)' }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          height: `${CARD_HEIGHT - 120}px`,
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-[#D4AF37]/30 mx-auto mb-2" />
              <div
                className="w-16 h-16 rounded-full border mx-auto flex items-center justify-center"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                }}
              >
                <span className="font-bold text-xl" style={{ color: '#D4AF37' }}>{product.karat}K</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 text-center">
        <h3
          className="font-bold mb-1 line-clamp-1 text-sm"
          style={{ color: '#E6ECF8' }}
        >
          {product.name}
        </h3>

        <div
          className="font-extrabold mb-2"
          style={{ fontSize: '1rem', color: '#D4AF37' }}
        >
          {formattedPrice}
        </div>

        <Link
          to={user ? `/checkout/${product.id}` : `/login?redirect=/checkout/${product.id}`}
          onClick={handleBuyNow}
          className="block w-full text-center py-2 rounded-lg font-bold text-sm transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #F6E27A 0%, #FFD700 40%, #D4AF37 100%)',
            color: '#0B1020',
          }}
        >
          اشترِ الآن
        </Link>
      </div>
    </div>
  );
};

const ProductCarousel3DCircular = () => {
  const products = getProducts();
  const count = products.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (count === 0) return null;

  const getVisibleProducts = (): Product[] => {
    const prev = (currentIndex - 1 + count) % count;
    const curr = currentIndex;
    const next = (currentIndex + 1) % count;
    return [products[prev], products[curr], products[next]];
  };

  const visibleProducts = getVisibleProducts();

  return (
    <section className="py-6">
      <div className="text-center mb-3 px-4">
        <h2 className="text-2xl font-extrabold gold-text mb-1">سبائك الذهب المتاحة</h2>
        <div className="w-16 h-0.5 gold-gradient mx-auto rounded-full" />
      </div>

      <div className="px-4">
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex justify-center gap-3 items-stretch"
            style={{ minHeight: `${CARD_HEIGHT}px` }}
          >
            {visibleProducts.map((product, i) => (
              <CarouselCard key={`${product.id}-${i}`} product={product} />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#D4AF37',
            }}
            aria-label="السابق"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#D4AF37',
            }}
            aria-label="التالي"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-8 gold-gradient'
                : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50'
            }`}
            aria-label={`المنتج ${i + 1}`}
          />
        ))}
      </div>

      <div className="text-center mt-3">
        <span className="text-sm text-[#E6ECF8]/60">
          {currentIndex + 1} / {count}
        </span>
      </div>
    </section>
  );
};

export default ProductCarousel3DCircular;
