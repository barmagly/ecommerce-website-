import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../services/Slice/cart/cart";
import { addUserWishlistThunk } from "../services/Slice/wishlist/wishlist";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa";

const API_URL = "http://localhost:5000" + "/api/products";
const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=No+Image";

export default function ShopProducts({ products = [] }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.userWishlist.wishlist);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      await dispatch(addToCartThunk({ productId, quantity: 1 }));
      toast.success("تمت إضافة المنتج إلى السلة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
    }
  };

  const handleWishlistClick = async (e, productId) => {
    e.stopPropagation();
    try {
      await dispatch(addUserWishlistThunk(productId));
      toast.success("تمت إضافة المنتج إلى المفضلة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المنتج إلى المفضلة");
    }
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

  const AvailabilityBadge = ({ stock }) => {
    if (stock > 0) {
      return (
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-success">متوفر</span>
        </div>
      );
    }
    return (
      <div className="position-absolute top-0 end-0 m-2">
        <span className="badge bg-danger">غير متوفر</span>
      </div>
    );
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        لا توجد منتجات متاحة حالياً
      </div>
    );
  }

  return (
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
                <button className="btn btn-sm btn-danger" onClick={(e) => handleAddToCart(e, item._id)}><i className="fas fa-shopping-cart"></i></button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => handleWishlistClick(e, item._id)}
                >
                  <i className={`${wishlist?.some(w => w._id === item._id) ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
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
      `}</style>
    </div>
  );
} 