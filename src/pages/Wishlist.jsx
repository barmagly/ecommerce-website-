import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { getUserWishlistThunk, removeWishlistThunk } from "../services/Slice/wishlist/wishlist";
import { addToCartThunk } from "../services/Slice/cart/cart";
import { getProductsThunk } from "../services/Slice/product/product";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute';

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=No+Image";

function StarRating({ rating }) {
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
}

export default function Wishlist() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.userWishlist);
  const { products } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const carouselRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserWishlistThunk());
      dispatch(getProductsThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeWishlistThunk({ prdId: productId }));
  };

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

  // Carousel drag handling
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setScrollStart(carouselRef.current.scrollLeft);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const walk = dragStartX - x;
    carouselRef.current.scrollLeft = scrollStart + walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Get similar products (products not in wishlist)
  const similarProducts = products?.filter(p =>
    !wishlist?.some(w => w._id === p._id)
  ) || [];

  return (
    <ProtectedRoute>
      <div className="bg-white" dir="rtl" style={{ textAlign: 'right' }}>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "المفضلة", to: "/wishlist" }
          ]} />
          <h2 className="fw-bold mb-4" data-aos="fade-up">المفضلة</h2>
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="col-12 text-center">
                <p>يرجى تسجيل الدخول لعرض قائمة المفضلة</p>
              </div>
            ) : wishlist?.length === 0 ? (
              <div className="col-12 text-center">قائمة المفضلة فارغة</div>
            ) : (
              wishlist?.map(item => (
                <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={item._id} data-aos="fade-up">
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={item.imageCover || (item.images?.[0]?.url)}
                      alt={item.name}
                      className="card-img-top p-3"
                      style={{ height: 180, objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                      onClick={() => navigate(`/product/${item._id}`)}
                    />
                    <div className="card-body d-flex flex-column align-items-center">
                      <h5 className="card-title fw-bold mb-2 text-center">{item.name}</h5>
                      <div className="mb-3">
                        <span className="text-danger fw-bold ms-2">{item.price} ج.م</span>
                      </div>
                      <div className="d-flex gap-2 w-100 justify-content-center">
                        <button
                          className="btn btn-dark flex-fill"
                          onClick={() => handleAddToCart(item._id)}
                        >
                          <i className="fas fa-shopping-cart ms-2"></i>أضف إلى السلة
                        </button>
                        <button
                          className="btn btn-outline-danger flex-fill"
                          onClick={() => handleRemove(item._id)}
                          title="حذف من المفضلة"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <h4 className="fw-bold mb-4 text-center">منتجات مقترحة لك</h4>
                <div
                  ref={carouselRef}
                  className={`similar-carousel position-relative d-flex justify-content-center ${isDragging ? 'dragging' : ''}`}
                  style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingBottom: 8,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none'
                  }}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  <div style={{
                    display: 'flex',
                    gap: 24,
                    minWidth: 320,
                    justifyContent: 'center',
                    width: '100%',
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(.4,1.3,.6,1)'
                  }}>
                    {similarProducts.slice(0, 8).map(item => (
                      <div
                        key={item._id}
                        className={`card shadow-sm border-0 d-inline-block product-similar-card${isDragging ? ' dragging-card' : ''}`}
                        style={{
                          width: 260,
                          minWidth: 240,
                          borderRadius: 16,
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, transform 0.2s',
                          verticalAlign: 'top',
                          transform: isDragging ? 'scale(0.97)' : 'scale(1)'
                        }}
                        onClick={() => {
                          if (!isDragging) {
                            navigate(`/product/${item._id}`);
                          }
                        }}
                      >
                        <div style={{
                          background: '#f6f6f6',
                          borderRadius: 16,
                          padding: 12,
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <img
                            src={item.images?.[0]?.url || item.imageCover || PLACEHOLDER_IMG}
                            alt={item.name}
                            style={{
                              height: 140,
                              objectFit: 'contain',
                              borderRadius: 12
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PLACEHOLDER_IMG;
                            }}
                          />
                        </div>
                        <div className="card-body text-center p-2">
                          <h6 className="fw-bold mb-1" style={{ fontSize: '1.08em', minHeight: 36 }}>
                            {item.name}
                          </h6>
                          <div className="mb-1">
                            <StarRating rating={item.ratings?.average || 0} />
                          </div>
                          <div className="text-danger fw-bold mb-1" style={{ fontSize: '1.1em' }}>
                            {item.price} ج.م
                          </div>
                          <div className="text-muted mb-1" style={{ fontSize: '0.98em' }}>
                            {item.brand}
                          </div>
                          <div className="text-muted mb-2" style={{
                            fontSize: '0.97em',
                            minHeight: 36,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
        <style>{`
          .similar-carousel::-webkit-scrollbar {
            display: none !important;
          }
          .similar-carousel {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .product-similar-card:hover {
            box-shadow: 0 8px 32px #db444455 !important;
            transform: scale(1.04) translateY(-4px);
          }
          .dragging .product-similar-card {
            transition: none !important;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
} 