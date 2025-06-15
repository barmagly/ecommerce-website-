import React, { useEffect, useState } from 'react';
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
        setProducts(response.data.data);
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

  return (
    <div className="flashsales-section-bg py-5 container" style={{ minHeight: 400 }} data-aos="fade-up">
      {error && (
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
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
          <span className="text-black fw-bold display-5">الأعلي تقييما</span>
          {/* التايمر يظهر تحت العنوان على الموبايل */}
          {/* <div className="flashsales-timer-row d-flex flex-row align-items-center gap-3 justify-content-center mt-3 d-md-none">
              <div className="text-center">
                <span className="text-black small fw-bold">أيام</span><br />
                <span className="text-black fw-bold fs-2">{String(timeLeft.days).padStart(2, '0')}</span>
              </div>
              <span className="fw-bold fs-2">:</span>
              <div className="text-center">
                <span className="text-black small fw-bold">ساعات</span><br />
                <span className="text-black fw-bold fs-2">{String(timeLeft.hours).padStart(2, '0')}</span>
              </div>
              <span className="fw-bold fs-2">:</span>
              <div className="text-center">
                <span className="text-black small fw-bold">دقائق</span><br />
                <span className="text-black fw-bold fs-2">{String(timeLeft.minutes).padStart(2, '0')}</span>
              </div>
              <span className="fw-bold fs-2">:</span>
              <div className="text-center">
                <span className="text-black small fw-bold">ثواني</span><br />
                <span className="text-black fw-bold fs-2">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div> */}
        </div>
        {/* التايمر يظهر بجانب العنوان على الديسكتوب */}
        {/* <div className="flashsales-timer-row d-none d-md-flex flex-row align-items-center gap-3 justify-content-center">
            <div className="text-center">
              <span className="text-black small fw-bold">أيام</span><br />
              <span className="text-black fw-bold fs-2">{String(timeLeft.days).padStart(2, '0')}</span>
            </div>
            <span className="fw-bold fs-2">:</span>
            <div className="text-center">
              <span className="text-black small fw-bold">ساعات</span><br />
              <span className="text-black fw-bold fs-2">{String(timeLeft.hours).padStart(2, '0')}</span>
            </div>
            <span className="fw-bold fs-2">:</span>
            <div className="text-center">
              <span className="text-black small fw-bold">دقائق</span><br />
              <span className="text-black fw-bold fs-2">{String(timeLeft.minutes).padStart(2, '0')}</span>
            </div>
            <span className="fw-bold fs-2">:</span>
            <div className="text-center">
              <span className="text-black small fw-bold">ثواني</span><br />
              <span className="text-black fw-bold fs-2">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div> */}
        <button className="btn btn-danger px-4 py-2 fw-bold mt-3 mt-md-0" onClick={() => navigate('/shop')}>عرض جميع المنتجات</button>
      </div>
      <div className="row g-4 ms-lg-5 mb-5">
        {products?.map((product) => (
          <div key={product?._id || product?.id} className="col-12 col-md-3" data-aos="zoom-in-up">
            <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center position-relative">
              {/* <span className="badge bg-danger position-absolute top-0 start-0 m-2">-{product.discount}%</span> */}
              <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={product?.imageCover} alt={product?.name} className="mb-3" style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '12px', cursor: 'pointer' }} />
              </Link>
              <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fw-bold mt-2" style={{ cursor: 'pointer', textAlign: 'center' }}>{product.name}</span>
              </Link>
              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="text-danger fw-bold">{product.price} ج.م</span>
                {/* <span className="fw-bold text-decoration-line-through">{product.oldPrice} ر.س</span> */}
              </div>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span>{'⭐'.repeat(product?.ratings?.average)}</span>
                <span className="fw-bold">({product.ratings?.count})</span>
              </div>
              <button className="btn btn-dark w-100 mt-3" onClick={() => handleAddToCart(product.id)}>أضف إلى السلة</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flashsales-divider mb-5"></div>
    </div>
  );
} 