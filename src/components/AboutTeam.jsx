import React from "react";

export default function AboutTeam() {
  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-5 text-center" data-aos="fade-up">فريقنا</h2>
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-md-4 text-center" data-aos="flip-left" data-aos-delay="100">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/9wn11zsm_expires_30_days.png" alt="مؤسس" className="img-fluid rounded mb-3" style={{height: '260px', objectFit: 'cover'}} />
          <h4 className="fw-bold">محمد علي</h4>
          <p>المؤسس والمدير التنفيذي</p>
        </div>
        <div className="col-12 col-md-4 text-center" data-aos="flip-left" data-aos-delay="200">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/zocc8c0t_expires_30_days.png" alt="مدير" className="img-fluid rounded mb-3" style={{height: '260px', objectFit: 'cover'}} />
          <h4 className="fw-bold">سارة أحمد</h4>
          <p>مدير العمليات</p>
        </div>
        <div className="col-12 col-md-4 text-center" data-aos="flip-left" data-aos-delay="300">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/zn10fl7q_expires_30_days.png" alt="مصمم" className="img-fluid rounded mb-3" style={{height: '260px', objectFit: 'cover'}} />
          <h4 className="fw-bold">خالد مصطفى</h4>
          <p>مصمم المنتجات</p>
        </div>
      </div>
    </section>
  );
} 