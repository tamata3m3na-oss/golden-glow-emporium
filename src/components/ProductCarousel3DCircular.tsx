import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getProducts, type Product } from '@/data/products';
import { postCheckoutEvent } from '@/lib/api';
import { getCheckoutSessionId } from '@/lib/checkoutSession';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;
const RADIUS = 320;
const VISIBLE_RANGE = 2;

const CarouselCard = ({
  product,
  isCenter,
}: {
  product: Product;
  isCenter: boolean;
}) => {
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
      className="relative rounded-xl border overflow-hidden flex-shrink-0 transition-shadow duration-500"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        background: '#0F172A',
        borderColor: isCenter ? 'rgba(212, 175, 55, 0.7)' : 'rgba(212, 175, 55, 0.25)',
        boxShadow: isCenter
          ? '0 0 40px rgba(212, 175, 55, 0.35), 0 8px 30px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        willChange: 'transform',
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
          height: `${CARD_HEIGHT - 108}px`,
        }}
      >
        {isCenter && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
            }}
          />
        )}
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
                <span className="font-bold text-xl" style={{ color: '#D4AF37' }}>
                  {product.karat}K
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5 text-center">
        <h3 className="font-bold mb-1 line-clamp-1 text-xs" style={{ color: '#E6ECF8' }}>
          {product.name}
        </h3>

        <div className="font-extrabold mb-2" style={{ fontSize: '0.9rem', color: '#D4AF37' }}>
          {formattedPrice}
        </div>

        <Link
          to={user ? `/checkout/${product.id}` : `/login?redirect=/checkout/${product.id}`}
          onClick={handleBuyNow}
          className="block w-full text-center py-1.5 rounded-lg font-bold text-xs transition-opacity hover:opacity-90"
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
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number>(0);
  const isDragging = useRef(false);

  const rotationY = useMotionValue(0);
  const controls = useAnimation();

  const angleStep = count > 0 ? 360 / count : 0;

  const nextSlide = useCallback(() => {
    if (isAnimating || count === 0) return;
    setIsAnimating(true);
    const next = (currentIndex + 1) % count;
    const target = rotationY.get() - angleStep;
    controls
      .start({
        rotateY: target,
        transition: { type: 'spring', stiffness: 60, damping: 18, mass: 0.8 },
      })
      .then(() => {
        rotationY.set(target);
        setCurrentIndex(next);
        setIsAnimating(false);
      });
  }, [isAnimating, count, currentIndex, angleStep, rotationY, controls]);

  const prevSlide = useCallback(() => {
    if (isAnimating || count === 0) return;
    setIsAnimating(true);
    const prev = (currentIndex - 1 + count) % count;
    const target = rotationY.get() + angleStep;
    controls
      .start({
        rotateY: target,
        transition: { type: 'spring', stiffness: 60, damping: 18, mass: 0.8 },
      })
      .then(() => {
        rotationY.set(target);
        setCurrentIndex(prev);
        setIsAnimating(false);
      });
  }, [isAnimating, count, currentIndex, angleStep, rotationY, controls]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    controls.stop();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const dx = e.touches[0].clientX - dragStartX.current;
    dragCurrentX.current = dx;
    const dragAngle = (dx / window.innerWidth) * 180;
    rotationY.set(rotationY.get() + dragAngle / 60);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartX.current === null) return;
    isDragging.current = false;

    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    const dt = Date.now() - (touchStartTime.current ?? Date.now());
    const velocity = Math.abs(dx) / dt;

    if (Math.abs(dx) > 40 || velocity > 0.4) {
      if (dx < 0) nextSlide();
      else prevSlide();
    } else {
      controls.start({
        rotateY: -currentIndex * angleStep,
        transition: { type: 'spring', stiffness: 80, damping: 20 },
      });
    }

    touchStartX.current = null;
    touchStartTime.current = null;
    dragStartX.current = null;
    dragCurrentX.current = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (count === 0) return null;

  const getCardStyle = (index: number) => {
    const rawDiff = index - currentIndex;
    const diff = ((rawDiff + count / 2 + count) % count) - count / 2;
    const cardAngle = diff * angleStep;
    const radians = (cardAngle * Math.PI) / 180;
    const z = Math.cos(radians) * RADIUS - RADIUS;
    const opacity = Math.abs(diff) <= VISIBLE_RANGE ? Math.max(0.15, 1 - Math.abs(diff) * 0.35) : 0;
    const scale = Math.abs(diff) === 0 ? 1 : Math.max(0.65, 1 - Math.abs(diff) * 0.18);
    const visible = Math.abs(diff) <= VISIBLE_RANGE;

    return {
      angle: cardAngle,
      opacity,
      scale,
      visible,
      zIndex: Math.round(100 - Math.abs(diff) * 20),
      z,
    };
  };

  return (
    <section
      className="py-6"
      role="region"
      aria-roledescription="carousel"
      aria-label="سبائك الذهب المتاحة"
    >
      <div className="text-center mb-4 px-4">
        <h2 className="text-2xl font-extrabold gold-text mb-1">سبائك الذهب المتاحة</h2>
        <div className="w-16 h-0.5 gold-gradient mx-auto rounded-full" />
      </div>

      <div
        className="relative select-none"
        style={{ height: `${CARD_HEIGHT + 40}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1100px', perspectiveOrigin: 'center center' }}
        >
          <motion.div
            animate={controls}
            style={{
              rotateY,
              transformStyle: 'preserve-3d',
              position: 'relative',
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
            }}
          >
            {products.map((product, index) => {
              const { angle, opacity, scale, visible, zIndex } = getCardStyle(index);
              if (!visible) return null;

              const isCenter = index === currentIndex;

              return (
                <div
                  key={product.id}
                  aria-hidden={!isCenter}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    opacity,
                    scale,
                    zIndex,
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    pointerEvents: isCenter ? 'auto' : 'none',
                    transition: 'opacity 0.4s ease, scale 0.4s ease',
                  }}
                >
                  <CarouselCard product={product} isCenter={isCenter} />
                </div>
              );
            })}
          </motion.div>
        </div>

        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
          style={{
            background: 'rgba(212, 175, 55, 0.18)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#D4AF37',
          }}
          aria-label="السابق"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
          style={{
            background: 'rgba(212, 175, 55, 0.18)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#D4AF37',
          }}
          aria-label="التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (isAnimating) return;
              const diff = i - currentIndex;
              const normalized = ((diff % count) + count) % count;
              const direction = normalized <= count / 2 ? 'next' : 'prev';
              setIsAnimating(true);
              const steps = direction === 'next' ? normalized : count - normalized;
              const target = rotationY.get() + (direction === 'next' ? -steps * angleStep : steps * angleStep);
              controls
                .start({
                  rotateY: target,
                  transition: { type: 'spring', stiffness: 50, damping: 16, mass: 0.8 },
                })
                .then(() => {
                  rotationY.set(target);
                  setCurrentIndex(i);
                  setIsAnimating(false);
                });
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 gold-gradient' : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50'
            }`}
            aria-label={`المنتج ${i + 1}`}
            aria-current={i === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <div className="text-center mt-2">
        <span className="text-sm text-[#E6ECF8]/60">
          {currentIndex + 1} / {count}
        </span>
      </div>
    </section>
  );
};

export default ProductCarousel3DCircular;
