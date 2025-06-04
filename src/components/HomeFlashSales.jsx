import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserWishlistThunk } from "../services/Slice/wishlist/wishlist";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function HomeFlashSales() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.userWishlist);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('يرجى تسجيل الدخول لإضافة المنتج إلى المفضلة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      navigate('/login');
      return;
    }
    dispatch(addUserWishlistThunk({ prdId: productId }))
      .unwrap()
      .then(() => {
        toast.success('تمت إضافة المنتج إلى المفضلة', {
          position: "top-center",
          rtl: true,
          autoClose: 2000
        });
      })
      .catch((error) => {
        toast.error(error || 'حدث خطأ أثناء إضافة المنتج إلى المفضلة', {
          position: "top-center",
          rtl: true,
          autoClose: 3000
        });
      });
  };

  return (
    <div className="container my-5" style={{ direction: 'rtl' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger" style={{ width: '20px', height: '40px', borderRadius: '4px' }}></div>
            <span className="text-danger fw-bold">عروض اليوم</span>
          </div>
          <h2 className="fw-bold" style={{ fontSize: '2.5rem' }}>عروض سريعة</h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light rounded-circle p-3">
            <i className="fas fa-chevron-right"></i>
          </button>
          <button className="btn btn-light rounded-circle p-3">
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="d-flex gap-3 mb-4">
        <div className="d-flex flex-column align-items-center">
          <span className="text-muted small">أيام</span>
          <span className="fw-bold" style={{ fontSize: '2rem' }}>03</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span className="text-muted small">ساعات</span>
          <span className="fw-bold" style={{ fontSize: '2rem' }}>23</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span className="text-muted small">دقائق</span>
          <span className="fw-bold" style={{ fontSize: '2rem' }}>19</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span className="text-muted small">ثواني</span>
          <span className="fw-bold" style={{ fontSize: '2rem' }}>56</span>
        </div>
      </div>

      {/* Product Cards */}
      <div className="row g-4">
        {/* Product Card 1 */}
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body p-3">
              <div className="position-absolute top-0 start-0 m-3">
                <span className="badge bg-danger">-40%</span>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <button
                  className="btn btn-light rounded-circle p-2"
                  onClick={(e) => handleWishlistClick(e, 'product-id-1')}
                >
                  <i className={`${wishlist?.some(w => w._id === 'product-id-1') ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
              <div className="text-center mb-3">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png"
                  alt="Gamepad"
                  className="img-fluid"
                  style={{ height: '180px', objectFit: 'contain' }}
                />
              </div>
              <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-light rounded-circle p-2">
                  <i className="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <h5 className="fw-bold mb-2">HAVIT HV-G92 Gamepad</h5>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="text-danger fw-bold">$120</span>
                <span className="text-decoration-line-through">$160</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-warning"></i>
                  ))}
                </div>
                <span className="text-muted">(88)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add more product cards here */}
      </div>

      {/* View All Button */}
      <div className="text-center mt-5">
        <button className="btn btn-danger px-5 py-3 fw-bold">
          عرض جميع المنتجات
        </button>
      </div>
    </div>
  );
} 