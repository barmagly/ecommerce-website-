import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../services/Slice/product/product";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=No+Image";

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

const AvailabilityBadge = ({ stock }) => {
  const statusConfig = {
    true: { label: "متوفر", className: "bg-success" },
    false: { label: "غير متوفر", className: "bg-danger" }
  };

  const config = statusConfig[stock > 0] || statusConfig[false];

  return (
    <span className={`badge ${config.className} position-absolute`} style={{ top: 10, right: 10 }}>
      {config.label}
    </span>
  );
};

export default function ShopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

  // تحديث تلقائي كل دقيقة
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = () => {
      setLoading(true);
      fetch('https://ecommerce-website-backend-nine.vercel.app/api/products')
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            // تحقق من شكل البيانات المستلمة
            let productsArray = [];
            if (Array.isArray(data)) {
              productsArray = data;
            } else if (data && Array.isArray(data.products)) {
              productsArray = data.products;
            } else if (data && Array.isArray(data.data)) {
              productsArray = data.data;
            }
            setProducts(productsArray);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Error fetching products:', err);
            setError('حدث خطأ في جلب المنتجات');
            setLoading(false);
          }
        });
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 60000); // كل دقيقة
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        لا توجد منتجات متاحة حالياً
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .product-card-pro {
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            border-radius: 18px;
            border: 1px solid #eee;
            background: #fff;
            min-height: 420px;
            position: relative;
          }
          .product-card-pro.active, .product-card-pro:active, .product-card-pro:focus {
            box-shadow: 0 8px 32px rgba(219,68,68,0.18) !important;
            border: 1.5px solid #DB4444 !important;
          }
          .product-card-pro .product-img-main {
            transition: transform 0.3s;
          }
          .product-card-pro.active .product-img-main,
          .product-card-pro:hover .product-img-main {
            transform: scale(1.08) rotate(-2deg);
          }
          .product-actions {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
          }
          .product-card-pro.active .product-actions,
          .product-card-pro:hover .product-actions {
            opacity: 1;
            pointer-events: auto;
          }
        `}
      </style>
      <div className="row g-4">
        {products.map(item => (
          <div
            className="col-12 col-md-6 col-lg-4 col-xl-3"
            key={item._id}
            data-aos="fade-up"
          >
            <div
              className={`product-card-pro h-100 position-relative bg-white rounded p-3 d-flex flex-column ${hoveredProduct === item._id ? 'active' : ''}`}
              tabIndex={0}
              role="button"
              onClick={() => navigate(`/product/${item._id}`)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/product/${item._id}`)}
              onMouseEnter={() => setHoveredProduct(item._id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{
                boxShadow: hoveredProduct === item._id ? "0 8px 32px rgba(219,68,68,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
                border: hoveredProduct === item._id ? "1.5px solid #DB4444" : "1px solid #eee",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                minHeight: 420,
                direction: "rtl"
              }}
            >
              <div className="product-img-wrapper mb-2 position-relative w-100 d-flex justify-content-center align-items-center" style={{ height: 180, overflow: 'hidden' }}>
                <img
                  src={item.images?.[0]?.url || item.imageCover || PLACEHOLDER_IMG}
                  alt={item.name}
                  className="product-img-main"
                  style={{ height: 170, objectFit: 'contain', borderRadius: 12, background: '#f6f6f6', width: '100%', transition: 'transform 0.3s' }}
                  onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                />
                <AvailabilityBadge stock={item.stock} />
              </div>
              <div className="flex-grow-1 d-flex flex-column align-items-center">
                <span className="text-muted small">{item.brand || 'بدون ماركة'}</span>
                <h6 className="fw-bold text-center mb-1" style={{ minHeight: 32 }}>{item.name}</h6>
                <div className="mb-1">
                  <StarRating rating={item.ratings?.average || 0} />
                  {item.ratings?.count > 0 && (
                    <small className="text-muted ms-1">({item.ratings.count})</small>
                  )}
                </div>
                <div className="mb-2">
                  <span className="text-danger fw-bold">
                    {item.price} ج.م
                  </span>
                </div>
                {item.attributes?.map((attr, idx) => (
                  <div key={idx} className="d-flex gap-1 mb-2 flex-wrap">
                    {attr.values.map((value, vIdx) => (
                      <span key={vIdx} className="badge bg-light text-dark border" style={{ fontSize: '0.85em', margin: 1 }}>
                        {value}
                      </span>
                    ))}
                  </div>
                ))}
                <div className={`product-actions mt-auto gap-2 ${hoveredProduct === item._id ? 'show' : ''}`} style={{ display: 'flex', opacity: hoveredProduct === item._id ? 1 : 0, pointerEvents: hoveredProduct === item._id ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                  <button className="btn btn-sm btn-danger"><i className="fas fa-shopping-cart"></i></button>
                  <button className="btn btn-sm btn-outline-danger"><i className="fas fa-heart"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 