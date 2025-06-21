import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FlashSalesShowcase.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCartThunk } from '../services/Slice/cart/cart';
import { frontendAPI } from '../services/api';

export default function BestSellersSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isShowingAllProducts, setIsShowingAllProducts] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollDirection, setLastScrollDirection] = useState('right'); // 'left' or 'right'

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function fetchPro() {
      try {
        const response = await frontendAPI.getBestSellers();
        console.log('Best Sellers Products:', response.data);
        // تأكد من أن البيانات موجودة
        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setIsShowingAllProducts(false);
        } else if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setIsShowingAllProducts(false);
        } else {
          // إذا لم تكن هناك منتجات في الأكثر مبيعاً، جلب جميع المنتجات
          try {
            const allProductsResponse = await frontendAPI.getAllProducts();
            console.log('All Products:', allProductsResponse.data);
            if (allProductsResponse.data && allProductsResponse.data.data) {
              setProducts(allProductsResponse.data.data);
              setIsShowingAllProducts(true);
            } else if (allProductsResponse.data && Array.isArray(allProductsResponse.data)) {
              setProducts(allProductsResponse.data);
              setIsShowingAllProducts(true);
            } else {
              setProducts([]);
              setIsShowingAllProducts(false);
            }
          } catch (allProductsError) {
            console.error("Error fetching all products:", allProductsError);
            setProducts([]);
            setIsShowingAllProducts(false);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ اثناء جلب المنتجات");
        console.error("Get error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPro();
  }, []);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.info('يرجى تسجيل الدخول لإضافة المنتج إلى السلة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      navigate('/login');
      return;
    }
    dispatch(addToCartThunk({ productId }))
      .unwrap()
      .then(() => {
        toast.success('تمت إضافة المنتج إلى السلة', {
          position: "top-center",
          rtl: true,
          autoClose: 2000
        });
      })
      .catch((error) => {
        toast.error(error || 'حدث خطأ أثناء إضافة المنتج إلى السلة', {
          position: "top-center",
          rtl: true,
          autoClose: 3000
        });
      });
  };

  const scrollToNext = useCallback(() => {
    if (scrollContainerRef.current && !isScrolling && products.length > 0) {
      setIsScrolling(true);
      const container = scrollContainerRef.current;
      const cardWidth = 300; // عرض البطاقة + المسافة بينها
      const maxScroll = container.scrollWidth - container.clientWidth;

      // استخدام آخر اتجاه تم استخدامه
      if (lastScrollDirection === 'right') {
        // التمرير للبطاقة التالية مع انيميشن
        let newScrollLeft = container.scrollLeft + cardWidth;

        // إذا وصلنا للنهاية، نعود للبداية
        if (newScrollLeft >= maxScroll) {
          newScrollLeft = 0;
        }

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      } else {
        // التمرير لليسار
        let newScrollLeft = container.scrollLeft - cardWidth;

        // إذا وصلنا للبداية، نذهب للنهاية
        if (newScrollLeft <= 0) {
          newScrollLeft = maxScroll;
        }

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }

      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, products.length, lastScrollDirection]);

  const scrollToPrev = useCallback(() => {
    if (scrollContainerRef.current && !isScrolling && products.length > 0) {
      setIsScrolling(true);
      setLastScrollDirection('left'); // تحديث اتجاه التمرير
      const container = scrollContainerRef.current;
      const cardWidth = 300;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // التمرير للبطاقة السابقة مع انيميشن
      let newScrollLeft = container.scrollLeft - cardWidth;

      // إذا وصلنا للبداية، نذهب للنهاية
      if (newScrollLeft <= 0) {
        newScrollLeft = maxScroll;
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, products.length]);

  const scrollToNextManual = useCallback(() => {
    if (scrollContainerRef.current && !isScrolling && products.length > 0) {
      setIsScrolling(true);
      setLastScrollDirection('right'); // تحديث اتجاه التمرير
      const container = scrollContainerRef.current;
      const cardWidth = 300; // عرض البطاقة + المسافة بينها
      const maxScroll = container.scrollWidth - container.clientWidth;

      // التمرير للبطاقة التالية مع انيميشن
      let newScrollLeft = container.scrollLeft + cardWidth;

      // إذا وصلنا للنهاية، نعود للبداية
      if (newScrollLeft >= maxScroll) {
        newScrollLeft = 0;
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, products.length]);

  // التمرير التلقائي كل 3 ثواني (حلقة مغلقة مستمرة)
  useEffect(() => {
    if (!isAutoScrolling || isScrolling || products.length === 0) return;

    // بدء التمرير التلقائي فوراً
    const startAutoScroll = () => {
      // التمرير الدائري المستمر
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 300;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // التمرير للأمام بشكل مستمر
        let newScrollLeft = container.scrollLeft + cardWidth;

        // إذا وصلنا للنهاية، نعود للبداية بدون توقف
        if (newScrollLeft >= maxScroll) {
          newScrollLeft = 0;
        }

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    };

    // بدء التمرير فوراً
    startAutoScroll();

    const interval = setInterval(startAutoScroll, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isScrolling, products.length]);

  // إضافة تأثير بصري للتمرير التلقائي
  useEffect(() => {
    if (isAutoScrolling && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.style.setProperty('--auto-scroll-active', 'true');
    } else if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.style.setProperty('--auto-scroll-active', 'false');
    }
  }, [isAutoScrolling]);

  // إيقاف التمرير التلقائي عند التفاعل مع الماوس
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }

    return <div className="d-flex gap-1">{stars}</div>;
  };

  return (
    <div className="bestsellers-section bestsellers-section-bg container" data-aos="fade-up">
      {error && (
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
            <br />
            <small className="text-muted">
              إذا استمرت المشكلة، يرجى التحقق من اتصال الإنترنت أو المحاولة لاحقاً
            </small>
            <br />
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo me-2"></i>
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
      {isShowingAllProducts && products.length > 0 && (
        <div className="container py-3">
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            يتم عرض جميع المنتجات المتاحة ({products.length} منتج) - لا توجد منتجات في الأكثر مبيعاً حالياً
          </div>
        </div>
      )}
      {!isShowingAllProducts && products.length > 0 && products.length <= 4 && (
        <div className="container py-3">
          <div className="alert alert-success" role="alert">
            <i className="fas fa-fire me-2"></i>
            عرض {products.length} منتج من الأكثر مبيعاً
          </div>
        </div>
      )}
      {isLoading && (
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-start mb-5 ms-lg-5 gap-5 position-relative">
        <div className="d-flex flex-column flex-shrink-0 align-items-start me-5 gap-3">
          <div className="d-flex align-items-center pe-1 gap-3">
            <div className="bg-danger rounded flashsales-bar"></div>
            <span className="text-danger fw-bold fs-6">هذا الشهر</span>
          </div>
          <span className="text-black fw-bold display-5">
            {isShowingAllProducts ? 'جميع المنتجات' : 'الأكثر مبيعًا'}
          </span>
          {products.length > 0 && (
            <span className="text-muted fs-6">
              ({products.length} منتج{isShowingAllProducts ? ' - جميع المنتجات المتاحة' : ''})
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 slider-arrows-best-sellers">
          <button
            className="btn btn-light rounded-circle p-3 scroll-btn scroll-left"
            onClick={scrollToPrev}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-light rounded-circle p-3 scroll-btn scroll-right"
            onClick={scrollToNextManual}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <style>{`
          @media (max-width: 600px) {
            .slider-arrows-best-sellers {
              position: absolute !important;
              top: 50%;
              left: 0;
              right: 0;
              width: 100%;
              justify-content: space-between !important;
              transform: translateY(-50%);
              z-index: 20;
              padding: 0 10px;
              gap: 0 !important;
            }
            .slider-arrows-best-sellers .scroll-btn {
              width: 44px !important;
              height: 44px !important;
              font-size: 1.1rem !important;
              background: rgba(255, 255, 255, 0.95) !important;
              border: 2px solid #db4444 !important;
              color: #db4444 !important;
              box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
              border-radius: 50% !important;
              z-index: 30;
              position: static !important;
            }
          }
        `}</style>
      </div>

      {/* قائمة قابلة للتمرير */}
      <div
        className="scrollable-products-container ms-lg-5 mb-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {products.length === 0 && !isLoading ? (
          <div className="text-center py-5">
            <div className="alert alert-info" role="alert">
              لا توجد منتجات متاحة حالياً
              <br />
              <button
                className="btn btn-outline-primary mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="scrollable-products-wrapper" ref={scrollContainerRef}>
              {products?.map((product, index) => (
                <div
                  key={product?._id || product?.id}
                  className="scrollable-product-card"
                  data-aos="zoom-in"
                  style={{
                    animation: `slideInUpDown ${0.6 + index * 0.1}s ease-out`
                  }}
                >
                  <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center">
                    <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      <img
                        src={product?.imageCover || product?.image || product?.images?.[0] || '/images/Placeholder.png'}
                        alt={product?.name || 'Product'}
                        className="img-fluid mb-3"
                        width="200"
                        height="200"
                        loading="lazy"
                        style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto', maxWidth: '100%' }}
                      />
                    </Link>
                    <div className="text-center w-100">
                      <h6 className="fw-bold mb-2">{product?.name || 'Product Name'}</h6>
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        <span className="text-danger fw-bold">{product?.price || 0} ج.م</span>
                        {product?.originalPrice && product?.originalPrice > product?.price && (
                          <span className="text-muted text-decoration-line-through">{product?.originalPrice} ج.م</span>
                        )}
                      </div>
                      <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
                        <StarRating rating={product.ratings?.average || 0} />
                        {product.ratings?.count > 0 && (
                          <small className="text-muted ms-1">({product.ratings.count})</small>
                        )}

                      </div>
                    </div>
                    <button
                      className="btn btn-danger w-100 mt-auto"
                      onClick={() => handleAddToCart(product?._id)}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      أضف إلى السلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUpDown {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-15px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes floatAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glowEffect {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(219, 68, 68, 0.1);
          }
          50% {
            box-shadow: 0 12px 48px rgba(219, 68, 68, 0.3);
          }
        }
        
        .scroll-btn:hover {
          background: #db4444 !important;
          color: white !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 8px 24px rgba(219, 68, 68, 0.3) !important;
          animation: glowEffect 2s ease-in-out infinite;
        }
        
        .flashsales-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: floatAnimation 3s ease-in-out infinite;
        }
        
        .flashsales-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
          animation: none;
        }

        .scrollable-product-card {
          transition: all 0.3s ease;
        }

        .scrollable-product-card:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
} 