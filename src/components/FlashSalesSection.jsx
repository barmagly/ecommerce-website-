import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FlashSalesShowcase.css';

const products = [
  {
    id: 1,
    name: 'ذراع تحكم ألعاب HAVIT HV-G92',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
    price: 120,
    oldPrice: 160,
    rating: 5,
    reviews: 88,
    discount: 40
  },
  {
    id: 2,
    name: 'لوحة مفاتيح AK-900 سلكية',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/peewgpo7_expires_30_days.png',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 75,
    discount: 35
  },
  {
    id: 3,
    name: 'شاشة ألعاب IPS LCD',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/u3sr8u8k_expires_30_days.png',
    price: 370,
    oldPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 30
  },
  {
    id: 4,
    name: 'كرسي مريح S-Series',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ml7dbshd_expires_30_days.png',
    price: 375,
    oldPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 25
  }
];

function getNext7Days() {
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return end;
}

function getTimeLeft(endDate) {
  const now = new Date();
  let diff = Math.max(0, endDate - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

export default function FlashSalesSection() {
  const [endDate, setEndDate] = useState(getNext7Days());
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft(endDate);
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setEndDate(getNext7Days());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flashsales-section-bg py-5" style={{ minHeight: 400 }} data-aos="fade-up">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 ms-lg-5 gap-4 gap-md-5">
          <div className="d-flex flex-column flex-shrink-0 align-items-center align-items-md-start me-0 me-md-5 gap-3  w-md-auto">
            <div className="d-flex align-items-center pe-1 gap-3">
              <div className="bg-danger rounded flashsales-bar"></div>
              <span className="text-danger fw-bold fs-6">عروض سريعة</span>
            </div>
            <span className="text-black fw-bold display-5">عروض اليوم السريعة</span>
            {/* التايمر يظهر تحت العنوان على الموبايل */}
            <div className="flashsales-timer-row d-flex flex-row align-items-center gap-3 justify-content-center mt-3 d-md-none">
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
            </div>
          </div>
          {/* التايمر يظهر بجانب العنوان على الديسكتوب */}
          <div className="flashsales-timer-row d-none d-md-flex flex-row align-items-center gap-3 justify-content-center">
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
          </div>
          <button className="btn btn-danger px-4 py-2 fw-bold mt-3 mt-md-0" onClick={() => navigate('/shop')}>عرض جميع المنتجات</button>
        </div>
        <div className="row g-4 ms-lg-5 mb-5">
          {products.map((product, idx) => (
            <div key={product.id} className="col-12 col-md-3" data-aos="zoom-in-up">
              <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center position-relative">
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">-{product.discount}%</span>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={product.image} alt={product.name} className="mb-3" style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '12px', cursor: 'pointer' }} />
                </Link>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="fw-bold fs-5 mt-2" style={{ cursor: 'pointer' }}>{product.name}</span>
                </Link>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="text-danger fw-bold">{product.price} ر.س</span>
                  <span className="fw-bold text-decoration-line-through">{product.oldPrice} ر.س</span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span>{'⭐'.repeat(product.rating)}</span>
                  <span className="fw-bold">({product.reviews})</span>
                </div>
                <button className="btn btn-dark w-100 mt-3" onClick={() => alert('تمت الإضافة للسلة!')}>أضف إلى السلة</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flashsales-divider mx-lg-5 mb-5"></div>
      </div>
    </div>
  );
} 