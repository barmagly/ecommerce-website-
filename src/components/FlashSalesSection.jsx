import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../services/Slice/cart/cart';
import { toast } from 'react-toastify';
import './FlashSalesShowcase.css';
import { frontendAPI } from '../services/api';

// function getNext7Days() {
//   const now = new Date();
//   const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//   return end;
// }

// function getTimeLeft(endDate) {
//   const now = new Date();
//   let diff = Math.max(0, endDate - now);
//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   diff -= days * (1000 * 60 * 60 * 24);
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   diff -= hours * (1000 * 60 * 60);
//   const minutes = Math.floor(diff / (1000 * 60));
//   diff -= minutes * (1000 * 60);
//   const seconds = Math.floor(diff / 1000);
//   return { days, hours, minutes, seconds };
// }

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

  // const [endDate, setEndDate] = useState(getNext7Days());
  // const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));
  // const { products, loading, error } = useSelector(state => state.home)
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const t = getTimeLeft(endDate);
  //     setTimeLeft(t);
  //     if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
  //       setEndDate(getNext7Days());
  //     }
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, [endDate]);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function fetchPro() {
      try {
        const response = await frontendAPI.getMostReviewed();
        console.log('Most Reviewed Products:', response.data);
        // تأكد من أن البيانات موجودة
        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setIsShowingAllProducts(false);
        } else if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setIsShowingAllProducts(false);
        } else {
          // إذا لم تكن هناك منتجات في الأعلى تقييماً، جلب جميع المنتجات
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

  const scrollProducts = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // مقدار التمرير
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
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
      {!isShowingAllProducts && products.length > 4 && (
        <div className="container py-3">
          <div className="alert alert-info" role="alert">
            <i className="fas fa-thumbs-up me-2"></i>
            عرض {products.length} منتج من الأعلى تقييماً - استخدم أزرار التمرير للتنقل
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 ms-lg-5 gap-4 gap-md-5">
        <div className="d-flex flex-column flex-shrink-0 align-items-center align-items-md-start me-0 me-md-5 gap-3  w-md-auto">
          <div className="d-flex align-items-center pe-1 gap-3">
            <div className="bg-danger rounded flashsales-bar"></div>
            <span className="text-danger fw-bold fs-6">هذا الشهر</span>
          </div>
          <span className="text-black fw-bold display-5">
            {isShowingAllProducts ? 'جميع المنتجات' : 'الأعلي تقييما'}
          </span>
          {products.length > 0 && (
            <span className="text-muted fs-6">
              ({products.length} منتج{isShowingAllProducts ? ' - جميع المنتجات المتاحة' : ''})
            </span>
          )}
        </div>
        <button className="btn btn-danger px-4 py-2 fw-bold mt-3 mt-md-0" onClick={() => navigate('/shop')}>عرض جميع المنتجات</button>
      </div>
      
      {/* قائمة قابلة للتمرير */}
      <div className="scrollable-products-container ms-lg-5 mb-5">
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
              {products?.map((product) => (
                <div key={product?._id || product?.id} className="scrollable-product-card" data-aos="zoom-in-up">
                  <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center position-relative">
                    <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      <img 
                        src={product?.imageCover} 
                        alt={product?.name} 
                        className="mb-3 flashsales-product-img" 
                        style={{ 
                          width: '100%', 
                          height: '220px', 
                          objectFit: 'contain', 
                          borderRadius: '16px', 
                          cursor: 'pointer',
                          backgroundColor: '#f8f9fa',
                          padding: '20px'
                        }} 
                      />
                    </Link>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center w-100">
                      <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h6 className="fw-bold mt-2 mb-3" style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1.1rem' }}>{product.name}</h6>
                      </Link>
                      <div className="d-flex align-items-center gap-3 mt-2 mb-2">
                        <span className="text-danger fw-bold fs-5">{product.price} ج.م</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2 mb-3">
                        <span className="fs-6">{'⭐'.repeat(product?.ratings?.average)}</span>
                        <span className="fw-bold text-muted">({product.ratings?.count})</span>
                      </div>
                      <button className="btn btn-dark w-100 mt-auto" onClick={() => handleAddToCart(product.id)}>أضف إلى السلة</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* أزرار التمرير */}
            {products.length > 4 && (
              <>
                <button className="scroll-btn scroll-left" onClick={() => scrollProducts('left')}>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <button className="scroll-btn scroll-right" onClick={() => scrollProducts('right')}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="flashsales-divider mb-5"></div>
    </div>
  );
} 