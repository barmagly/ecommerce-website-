import React from 'react';
import './FlashSalesShowcase.css';

const features = [
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/5952/5952766.png',
    title: 'توصيل سريع',
    desc: 'نضمن لك توصيل سريع لجميع طلباتك'
  },
  {
    icon: 'https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?semt=ais_hybrid&w=740',
    title: 'خدمة عملاء 24/7',
    desc: 'دعم فني متواصل وودود على مدار الساعة'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/5506/5506524.png',
    title: 'ضمان استرجاع الأموال',
    desc: 'استرجاع أموالك خلال ٣٠ يومًا'
  }
];

export default function ServiceFeaturesSection() {
  return (
    <div className="service-features-section servicefeatures-section-bg" data-aos="fade-up">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center g-5">
          {features.map((f, idx) => (
            <div key={idx} className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay={idx * 200}>
              <div className="service-feature-card d-flex flex-column align-items-center text-center p-4 h-100">
                <div className="service-icon-wrapper mb-4 d-flex justify-content-center align-items-center" style={{ width: 180, height: 180, borderRadius: '50%', backgroundColor: '#f6f6f6', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <img 
                    src={f.icon} 
                    alt={f.title} 
                    style={{
                      width: 180, 
                      height: 180, 
                      objectFit: 'contain',
                      transition: 'all 0.3s ease'
                    }} 
                    className="service-icon"
                  />
                </div>
                <h4 className="fw-bold fs-4 text-center mb-3 text-dark">{f.title}</h4>
                <p className="text-muted text-center mb-0 fs-6">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 