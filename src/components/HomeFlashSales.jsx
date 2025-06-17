import React from 'react';
import AutoScrollProducts from './AutoScrollProducts';

export default function HomeFlashSales() {
  const flashSalesProducts = [
    {
      name: 'HAVIT HV-G92 Gamepad',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
      price: 160,
      discount: 40,
      rating: 5,
      reviews: 88
    },
    {
      name: 'سماعة بلوتوث لاسلكية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 120,
      discount: 30,
      rating: 4.5,
      reviews: 65
    },
    {
      name: 'كاميرا رقمية احترافية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png',
      price: 1500,
      discount: 25,
      rating: 4.8,
      reviews: 120
    },
    {
      name: 'ساعة ذكية متطورة',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png',
      price: 300,
      discount: 20,
      rating: 4.3,
      reviews: 89
    },
    {
      name: 'حاسوب محمول للألعاب',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 2000,
      discount: 15,
      rating: 4.9,
      reviews: 45
    },
    {
      name: 'هاتف ذكي حديث',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
      price: 800,
      discount: 35,
      rating: 4.7,
      reviews: 156
    }
  ];

  return (
    <div className="flashsales-section">
      <AutoScrollProducts 
        products={flashSalesProducts}
        title="عروض سريعة"
        subtitle="عروض اليوم"
        showDiscount={true}
      />
      
      {/* Countdown Timer */}
      <div className="container">
        <div className="d-flex gap-3 mb-4 justify-content-center">
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

        {/* View All Button */}
        <div className="text-center mt-5">
          <button className="btn btn-danger px-5 py-3 fw-bold flashsales-viewall">
            عرض جميع المنتجات
          </button>
        </div>
      </div>
    </div>
  );
} 