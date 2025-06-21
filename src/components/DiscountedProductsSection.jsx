import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DiscountedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products?discounted=true')
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(() => setError('حدث خطأ أثناء جلب المنتجات المخفضة'))
      .finally(() => setLoading(false));
  }, []);

  // إعدادات السلايدر
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    rtl: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 991,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">جاري التحميل...</span></div></div>;
  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger">{error}</div></div>;

  return (
    products.length !== 0 ? (
      <div className="container py-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <i className="fas fa-tags fa-2x text-danger"></i>
          <h2 className="fw-bold mb-0 text-danger">عروض وخصومات</h2>
        </div>

        <Slider ref={sliderRef} {...settings}>
          {products.map(product => (
            <div key={product._id} className="px-2">
              <div className="product-card-pro h-100 position-relative bg-white rounded p-3 d-flex flex-column" style={{ minHeight: 420, cursor: 'pointer', border: '1px solid #eee' }}>
                <div className="product-img-wrapper mb-2 position-relative w-100 d-flex justify-content-center align-items-center" style={{ height: 180, overflow: 'hidden' }}>
                  <img
                    src={product.imageCover || product.images?.[0]?.url || '/images/Placeholder.png'}
                    alt={product.name}
                    className="product-img-main"
                    width="170"
                    height="170"
                    loading="lazy"
                    style={{ height: 170, objectFit: 'contain', borderRadius: 12, background: '#f6f6f6', width: '100%' }}
                    onError={e => { e.target.onerror = null; e.target.src = '/images/Placeholder.png'; }}
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 2, fontSize: '0.95em', borderRadius: '12px', padding: '6px 12px' }}>
                      خصم {Math.round(100 - (product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex-grow-1 d-flex flex-column align-items-center">
                  <span className="text-muted small">{product.brand || ' '}</span>
                  <h6 className="fw-bold text-center mb-1" style={{ minHeight: 32 }}>{product.name}</h6>
                  <div className="mb-2 d-flex align-items-center justify-content-center gap-2">
                    <span className="text-danger fw-bold fs-5">{product.price} ج.م</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-muted text-decoration-line-through" style={{ fontSize: '1em' }}>{product.originalPrice} ج.م</span>
                    )}
                  </div>
                  <a href={`/product/${product._id}`} className="btn btn-outline-danger w-100 mt-auto">عرض التفاصيل</a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    ) : null
  );
} 