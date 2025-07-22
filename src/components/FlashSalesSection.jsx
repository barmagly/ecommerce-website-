import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../services/Slice/cart/cart';
import { toast } from 'react-toastify';
import './FlashSalesShowcase.css';
import { frontendAPI } from '../services/api';
import { Box, Skeleton } from '@mui/material';

export default function FlashSalesSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isShowingAllProducts, setIsShowingAllProducts] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function fetchPro() {
      try {
        const response = await frontendAPI.getMostReviewed();
        console.log('Most Reviewed Products:', response.data);
        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setIsShowingAllProducts(false);
        } else if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setIsShowingAllProducts(false);
        } else {
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

  // Helper function to calculate card width based on screen size
  const getCardWidth = useCallback((container) => {
    if (!container) return 300;

    if (window.innerWidth <= 600) {
      // On mobile: card width = container width - margins
      return container.clientWidth - 40; // 20px margin on each side
    } else {
      // On larger screens: fixed width
      return 300;
    }
  }, []);

  const scrollToNext = useCallback(() => {
    console.log('scrollToNext called', {
      hasRef: !!scrollContainerRef.current,
      isScrolling,
      productsLength: products.length
    });

    if (scrollContainerRef.current && !isScrolling && products.length > 0) {
      setIsScrolling(true);
      const container = scrollContainerRef.current;
      const cardWidth = getCardWidth(container);
      const maxScroll = container.scrollWidth - container.clientWidth;

      let newScrollLeft = container.scrollLeft + cardWidth;

      console.log('Scroll details:', {
        currentScroll: container.scrollLeft,
        newScrollLeft,
        maxScroll,
        cardWidth,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth
      });

      // إذا وصلنا للنهاية، نعود للبداية
      if (newScrollLeft >= maxScroll) {
        newScrollLeft = 0;
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, products.length, getCardWidth]);

  const scrollToPrev = useCallback(() => {
    console.log('scrollToPrev called', {
      hasRef: !!scrollContainerRef.current,
      isScrolling,
      productsLength: products.length
    });

    if (scrollContainerRef.current && !isScrolling && products.length > 0) {
      setIsScrolling(true);
      const container = scrollContainerRef.current;
      const cardWidth = getCardWidth(container);
      const maxScroll = container.scrollWidth - container.clientWidth;

      let newScrollLeft = container.scrollLeft - cardWidth;

      console.log('Scroll details:', {
        currentScroll: container.scrollLeft,
        newScrollLeft,
        maxScroll,
        cardWidth,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth
      });

      // إذا وصلنا للبداية، نذهب للنهاية
      if (newScrollLeft <= 0) {
        newScrollLeft = maxScroll;
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, products.length, getCardWidth]);

  // التمرير التلقائي
  useEffect(() => {
    if (!isAutoScrolling || isScrolling || products.length === 0) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = getCardWidth(container);
        const maxScroll = container.scrollWidth - container.clientWidth;
        let newScrollLeft = container.scrollLeft + cardWidth;

        // إذا وصلنا للنهاية، نعود للبداية
        if (newScrollLeft >= maxScroll) {
          newScrollLeft = 0;
        }

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isScrolling, products.length, getCardWidth]);

  // إضافة مستمع لتغيير حجم النافذة
  useEffect(() => {
    const handleResize = () => {
      // إعادة حساب عرض البطاقات عند تغيير حجم النافذة
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // يمكن إضافة منطق إضافي هنا إذا لزم الأمر
        console.log('Window resized, container width:', container.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="flashsales-section-bg py-5 container" style={{ minHeight: 400 }} data-aos="fade-up">
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
            يتم عرض جميع المنتجات المتاحة ({products.length} منتج) - لا توجد منتجات في الأعلى تقييماً حالياً
          </div>
        </div>
      )}
      {!isShowingAllProducts && products.length > 0 && products.length <= 4 && (
        <div className="container py-3">
          <div className="alert alert-success" role="alert">
            <i className="fas fa-star me-2"></i>
            عرض {products.length} منتج من الأعلى تقييماً
          </div>
        </div>
      )}
      {isLoading && (
        <div className="container py-5 text-center">
          <Skeleton width={250} height={60} />
          <Skeleton width={250} height={60} />
          <Skeleton width={250} height={60} />
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <Skeleton variant="rounded" width='25%' height='300px' />
            <Skeleton variant="rounded" width='25%' height='300px' />
            <Skeleton variant="rounded" width='25%' height='300px' />
            <Skeleton variant="rounded" width='25%' height='300px' />
          </Box>
        </div>
      )}
      <div className="d-flex flex-column flex-md-row mb-5 ms-lg-5 gap-4 gap-md-5">
        <div className="d-flex flex-column flex-shrink-0 me-0 me-md-5 gap-3  w-md-auto">
          <div className="d-flex align-items-center pe-1 gap-3">
            <div className="bg-danger rounded flashsales-bar"></div>
            <span className="text-danger fw-bold fs-6">هذا الشهر</span>
          </div>
          <span className="text-black fw-bold display-5">
            {isShowingAllProducts ? 'جميع المنتجات' : 'الأعلي تقييما'}
          </span>
          {products.length > 0 && (
            <span className="text-muted fs-6">
              ({products.length} منتج{!isShowingAllProducts ? ' - جميع المنتجات المتاحة' : ''})
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
            <i className="fas fa-chevron-right"></i>
          </button>
          <button
            className="btn btn-light rounded-circle p-3 scroll-btn scroll-right"
            onClick={scrollToNext}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>

      {/* قائمة قابلة للتمرير */}
      <div
        className="scrollable-products-container ms-lg-5 mb-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* أزرار التمرير */}
        {/* <button
          className="btn btn-light rounded-circle p-3 scroll-btnm scroll-left flashsales-arrow-mobile"
          onClick={scrollToPrev}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            zIndex: 10
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          className="btn btn-light rounded-circle p-3 scroll-btnm scroll-right flashsales-arrow-mobile"
          onClick={scrollToNext}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            zIndex: 10
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button> */}

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
                    animation: `slideInUpDown ${1.6 + index * 0.1}s ease-out`
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
                      className="btn btn-danger w-75 mt-auto"
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
        .scrollable-products-container {
          position: relative;
          overflow: hidden;
          padding: 0 30px;
          width: 100%;
          max-width: 100%;
        }
        
        .scrollable-products-wrapper {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 10px 0;
          direction: ltr;
          width: 100%;
          max-width: 100%;
        }
        
        .scrollable-products-wrapper::-webkit-scrollbar {
          display: none;
        }
        
        .scrollable-product-card {
          flex: 0 0 280px;
          min-width: 280px;
          max-width: 280px;
          margin: 0;
          direction: ltr;
        }
        
        .scroll-btnm {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #db4444;
          color: #db4444;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          border-radius: 50%;
          z-index: 30;
          width: 50px;
          height: 50px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .scroll-left { 
          left: -25px;
        }
        
        .scroll-right { 
          right: -25px;
        }
        
        .scroll-btnm:hover {
          background: #db4444 !important;
          color: white !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 8px 24px rgba(219, 68, 68, 0.3) !important;
          animation: glowEffect 2s ease-in-out infinite;
        }

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

        @media (max-width: 600px) {
          .flashsales-arrow-mobile.scroll-btnm {
            width: 44px !important;
            height: 44px !important;
            font-size: 1.1rem !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border: 2px solid #db4444 !important;
            color: #db4444 !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
            border-radius: 50% !important;
            z-index: 30;
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
          }
          .flashsales-arrow-mobile.scroll-left {
            left: 10px !important;
            right: auto !important;
          }
          .flashsales-arrow-mobile.scroll-right {
            right: 10px !important;
            left: auto !important;
          }
          
          /* Mobile card styling */
          .scrollable-product-card {
            flex: 0 0 calc(100vw - 80px) !important;
            min-width: calc(100vw - 80px) !important;
            max-width: calc(100vw - 80px) !important;
            margin: 0 20px !important;
          }
          
          .scrollable-products-wrapper {
            gap: 0 !important;
            padding: 0 !important;
            scroll-snap-type: x mandatory !important;
          }
          
          .scrollable-product-card {
            scroll-snap-align: center !important;
          }
          
          .flashsales-card {
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
} 