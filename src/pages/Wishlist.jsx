import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { getUserWishlistThunk, removeWishlistThunk } from "../services/Slice/wishlist/wishlist";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.userWishlist);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserWishlistThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeWishlistThunk({prdId:productId}));
    console.log("Remove product from wishlist:", productId);
  };

  const handleAddToCart = (productId) => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", productId);
  };

  return (
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
                      e.target.src = "/images/placeholder.png";
                    }}
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
        {/* Recommendations Section */}
        <div className="mt-5" data-aos="fade-up">
          <h4 className="fw-bold mb-4">منتجات مقترحة لك</h4>
          <div className="row g-4">
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/9ame2m8t_expires_30_days.png"
                  alt="منتج مقترح"
                  className="card-img-top p-3"
                  style={{ height: 180, objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">لاب توب ألعاب ASUS FHD</h6>
                  <span className="text-danger fw-bold">960 ج.م</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/jbwbttnu_expires_30_days.png"
                  alt="منتج مقترح"
                  className="card-img-top p-3"
                  style={{ height: 180, objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">شاشة ألعاب IPS LCD</h6>
                  <span className="text-danger fw-bold">1160 ج.م</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/1k62ml59_expires_30_days.png"
                  alt="منتج مقترح"
                  className="card-img-top p-3"
                  style={{ height: 180, objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">ذراع ألعاب HAVIT HV-G92</h6>
                  <span className="text-danger fw-bold">560 ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 