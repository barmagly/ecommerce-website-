import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaChevronRight, FaChevronLeft, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../services/Slice/cart/cart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const products = [
  {
    name: 'سماعة بلوتوث لاسلكية',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
    price: 100,
    oldPrice: 120,
    rating: 4.5,
    reviews: 65,
    discount: '-20%'
  },
  {
    name: 'كاميرا رقمية احترافية',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png',
    price: 1500,
    oldPrice: 1700,
    rating: 4.8,
    reviews: 120,
    discount: '-12%'
  },
  {
    name: 'ساعة ذكية متطورة',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png',
    price: 300,
    oldPrice: 350,
    rating: 4.3,
    reviews: 89,
    discount: '-14%'
  },
  {
    name: 'حاسوب محمول للألعاب',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
    price: 2000,
    oldPrice: 2200,
    rating: 4.9,
    reviews: 45,
    discount: '-9%'
  },
  {
    name: 'لوحة مفاتيح ميكانيكية',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
    price: 250,
    oldPrice: 300,
    rating: 4.2,
    reviews: 33,
    discount: '-17%'
  }
];

export default function HomeFlashSalesSlider() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const [page, setPage] = useState(0);
  const productsPerPage = 4;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const startIdx = page * productsPerPage;
  const endIdx = startIdx + productsPerPage;
  const currentProducts = products.slice(startIdx, endIdx);
  const [favorite, setFavorite] = useState(Array(products.length).fill(false));

  const handleFavorite = idx => {
    setFavorite(fav => fav.map((f, i) => (i === idx + startIdx ? !f : f)));
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

  const handlePrev = () => setPage(prev => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setPage(prev => (prev < pageCount - 1 ? prev + 1 : prev));

  return (
    <div className="container my-5" style={{ direction: 'rtl' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div style={{ color: '#E94560', fontWeight: 'bold', fontSize: 24 }}>
          عروض اليوم السريعة
        </div>
        <div>
          <Button variant="light" className="rounded-circle mx-1" onClick={handlePrev} disabled={page <= 0}>
            <FaChevronRight />
          </Button>
          <Button variant="light" className="rounded-circle mx-1" onClick={handleNext} disabled={page >= pageCount - 1}>
            <FaChevronLeft />
          </Button>
        </div>
      </div>
      {/* Countdown */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: 24 }}>03</div>
          <div>الأيام</div>
        </div>
        <div className="fw-bold" style={{ fontSize: 24 }}>:</div>
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: 24 }}>23</div>
          <div>الساعات</div>
        </div>
        <div className="fw-bold" style={{ fontSize: 24 }}>:</div>
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: 24 }}>19</div>
          <div>الدقائق</div>
        </div>
        <div className="fw-bold" style={{ fontSize: 24 }}>:</div>
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: 24 }}>56</div>
          <div>الثواني</div>
        </div>
      </div>
      {/* Product Cards */}
      <div className="row g-4 mb-4">
        {currentProducts.map((product, idx) => (
          <div key={idx} className="col-12 col-md-3">
            <div className="card h-100 position-relative p-2" style={{ background: '#fafafa', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
              <span style={{ position: 'absolute', top: 12, right: 12, background: '#E94560', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 14 }}>{product.discount}</span>
              <Button variant="link" style={{ position: 'absolute', top: 12, left: 12, color: '#E94560' }} onClick={() => handleFavorite(idx)}>
                {favorite[idx + startIdx] ? <FaHeart /> : <FaRegHeart />}
              </Button>
              <Button variant="link" style={{ position: 'absolute', top: 52, left: 12, color: '#222' }}>
                <FaEye />
              </Button>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'contain', marginBottom: 12, borderRadius: 8 }} />
              <div className="fw-bold mb-2" style={{ fontSize: 16 }}>{product.name}</div>
              <div className="mb-2">
                <span style={{ color: '#E94560', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>{product.price} ج.م</span>
                <span style={{ textDecoration: 'line-through', color: '#888', fontSize: 16 }}>{product.oldPrice} ج.م</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span>{'⭐'.repeat(Math.floor(product.rating))}{product.rating % 1 ? '⭐️' : ''}</span>
                <span style={{ color: '#888', fontSize: 14 }}>({product.reviews})</span>
              </div>
              <Button
                style={{ marginTop: 12, width: '100%', background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 16 }}
                onClick={() => handleAddToCart(product.id)}
              >
                أضف إلى السلة
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button style={{ background: '#E94560', color: '#fff', border: 'none', padding: '12px 32px', fontSize: 18, borderRadius: 8 }}>
          عرض جميع المنتجات
        </Button>
      </div>
    </div>
  );
} 