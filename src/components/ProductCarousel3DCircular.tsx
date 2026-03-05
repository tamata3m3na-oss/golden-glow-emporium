import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts, type Product } from '@/data/products';

// Google Earth-style 3D Circular Carousel
// Products are arranged in a circular/cylindrical formation around a center point
// Navigation rotates the entire carousel around the Y-axis

const ProductCarousel3DCircular = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load products
  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
  }, []);

  // Calculate rotation angle based on product count
  const anglePerProduct = products.length > 0 ? 360 / products.length : 0;

  // Navigate to next product (rotate counter-clockwise)
  const nextSlide = useCallback(() => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % products.length;
      return newIndex;
    });
    setRotation((prev) => prev - anglePerProduct);
  }, [products.length, anglePerProduct]);

  // Navigate to previous product (rotate clockwise)
  const prevSlide = useCallback(() => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + products.length) % products.length;
      return newIndex;
    });
    setRotation((prev) => prev + anglePerProduct);
  }, [products.length, anglePerProduct]);

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    if (products.length === 0) return;
    const diff = index - currentIndex;
    setCurrentIndex(index);
    setRotation((prev) => prev - diff * anglePerProduct);
  }, [products.length, currentIndex, anglePerProduct]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, products.length]);

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Calculate 3D position for each product
  const getProductStyle = (index: number): React.CSSProperties => {
    if (products.length === 0) return {};
    
    // Calculate the angle for this product relative to current rotation
    const baseAngle = index * anglePerProduct;
    const currentAngle = baseAngle + rotation;
    const radian = (currentAngle * Math.PI) / 180;
    
    // Radius of the circular arrangement
    const radius = 320;
    
    // Calculate position in 3D space
    const x = Math.sin(radian) * radius;
    const z = Math.cos(radian) * radius - radius; // Offset so center is at z=0
    
    // Calculate scale and opacity based on z position (depth)
    const normalizedZ = (z + radius) / (2 * radius); // 0 to 1
    const scale = 0.6 + normalizedZ * 0.4; // Scale from 0.6 to 1.0
    const opacity = 0.3 + normalizedZ * 0.7; // Opacity from 0.3 to 1.0
    
    // Calculate rotation Y to face outward from center
    const rotateY = -currentAngle;
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: Math.round(normalizedZ * 100),
    };
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-3 px-4"
      >
        <h2 className="text-2xl font-extrabold gold-text mb-1">سبائك الذهب المتاحة</h2>
        <div className="w-16 h-0.5 gold-gradient mx-auto rounded-full" />
      </motion.div>

      {/* 3D Carousel Container */}
      <div 
        className="px-4"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* 3D Scene */}
        <div 
          ref={containerRef}
          className="relative flex items-center justify-center overflow-hidden py-8"
          style={{ 
            height: '400px',
            perspective: '1000px',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D Carousel Track */}
          <div 
            className="relative flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={getProductStyle(index)}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1],
                    layout: { duration: 0.8 }
                  }}
                  className="absolute w-[265px]"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Center glow effect */}
          <div 
            className="absolute pointer-events-none"
            style={{
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 70%)',
              transform: 'translateZ(-100px)',
            }}
          />
        </div>

        {/* Navigation Buttons - Below Carousel */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ 
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#D4AF37'
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
              color: '#D4AF37'
            }}
            aria-label="التالي"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'w-8 gold-gradient' 
                : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50'
            }`}
            aria-label={`المنتج ${i + 1}`}
          />
        ))}
      </div>

      {/* Current Product Indicator */}
      <div className="text-center mt-3">
        <span className="text-sm text-[#E6ECF8]/60">
          {currentIndex + 1} / {products.length}
        </span>
      </div>
    </section>
  );
};

export default ProductCarousel3DCircular;
