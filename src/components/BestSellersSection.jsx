import React, { useEffect, useState } from 'react';
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
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function fetchPro() {
      try {
        const response = await frontendAPI.getBestSellers();
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
    <div className="bestsellers-section bestsellers-section-bg container" data-aos="fade-up">
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
      <div className="d-flex justify-content-between align-items-start mb-5 ms-lg-5 gap-5">
        <div className="d-flex flex-column flex-shrink-0 align-items-start me-5 gap-3">
          <div className="d-flex align-items-center pe-1 gap-3">
            <div className="bg-danger rounded flashsales-bar"></div>
            <span className="text-danger fw-bold fs-6">هذا الشهر</span>
          </div>
          <span className="text-black fw-bold display-5">الأكثر مبيعًا</span>
        </div>
        <button className="btn btn-danger px-5 py-3 fw-bold mt-4" onClick={() => navigate('/shop')}>عرض الكل</button>
      </div>
      <div className="row g-4 ms-lg-5 mb-5">
        {products?.map((product) => (
          <div key={product?._id || product?.id} className="col-12 col-md-3" data-aos="zoom-in">
            <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center">
              <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={product?.image} alt={product?.name} className="mb-3" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer' }} />
              </Link>
              <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fw-bold mt-2" style={{ cursor: 'pointer' }}>{product?.name}</span>
              </Link>
              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="text-danger fw-bold">{product?.price} ج.م</span>
                {/* {product?.oldPrice && <span className="fw-bold text-decoration-line-through">{product?.oldPrice}</span>} */}
              </div>
              <div className="d-flex align-items-center gap-2 mt-2">
                {/* <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0rblkmcb_expires_30_days.png" style={{ width: '100px', height: '20px' }} alt="rating" /> */}
                {/* <span className="fw-bold">({product?.totalSold})</span> */}
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