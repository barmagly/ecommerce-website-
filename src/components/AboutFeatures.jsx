import React from "react";

export default function AboutFeatures() {
  return (
    <section className="container py-5">
      <div className="row g-4 text-center">
        <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="100">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vxj6p8og_expires_30_days.png" alt="توصيل سريع" style={{height: '60px'}} className="mb-3" />
          <h5 className="fw-bold">توصيل سريع ومجاني</h5>
          <p>توصيل مجاني لجميع الطلبات فوق 140 دولار.</p>
        </div>
        <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="200">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/v2otfewn_expires_30_days.png" alt="دعم 24/7" style={{height: '60px'}} className="mb-3" />
          <h5 className="fw-bold">دعم فني 24/7</h5>
          <p>دعم فني متواصل على مدار الساعة طوال أيام الأسبوع.</p>
        </div>
        <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="300">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/05y6w2sh_expires_30_days.png" alt="ضمان استرجاع الأموال" style={{height: '60px'}} className="mb-3" />
          <h5 className="fw-bold">ضمان استرجاع الأموال</h5>
          <p>نضمن لك استرجاع أموالك خلال 30 يومًا إذا لم تكن راضيًا.</p>
        </div>
      </div>
    </section>
  );
} 