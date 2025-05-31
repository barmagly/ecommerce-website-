import React from 'react';
import './FlashSalesShowcase.css';

const features = [
  {
    icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/bqlwzzr2_expires_30_days.png',
    title: 'توصيل سريع ومجاني',
    desc: 'توصيل مجاني لجميع الطلبات فوق ١٤٠ ر.س'
  },
  {
    icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/swx9cswz_expires_30_days.png',
    title: 'خدمة عملاء 24/7',
    desc: 'دعم فني متواصل وودود على مدار الساعة'
  },
  {
    icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/p0b3okwg_expires_30_days.png',
    title: 'ضمان استرجاع الأموال',
    desc: 'استرجاع أموالك خلال ٣٠ يومًا'
  }
];

export default function ServiceFeaturesSection() {
  return (
    <div className="service-features-section servicefeatures-section-bg" data-aos="fade-up">
      <div className="container my-5">
        <div className="row justify-content-center align-items-center g-5">
          {features.map((f, idx) => (
            <div key={idx} className="col-12 col-md-4 d-flex flex-column align-items-center gap-3">
              <img src={f.icon} alt={f.title} style={{width: 80, height: 80, objectFit: 'contain'}} />
              <span className="fw-bold fs-4 text-center">{f.title}</span>
              <span className="text-muted text-center">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 