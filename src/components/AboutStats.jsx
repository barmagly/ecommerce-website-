import React from "react";

export default function AboutStats() {
  return (
    <section className="container py-5">
      <div className="row text-center g-4">
        <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="100">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/lfa9v4dn_expires_30_days.png" alt="البائعين" className="mb-2" style={{height: '60px'}} />
          <h3 className="fw-bold">10,500+</h3>
          <p>بائع نشط</p>
        </div>
        <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="200">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/gvi4zhcg_expires_30_days.png" alt="العملاء" className="mb-2" style={{height: '60px'}} />
          <h3 className="fw-bold">45,500+</h3>
          <p>عميل نشط</p>
        </div>
        <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="300">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/y3p2hu7d_expires_30_days.png" alt="المنتجات" className="mb-2" style={{height: '60px'}} />
          <h3 className="fw-bold">1,000,000+</h3>
          <p>منتج متنوع</p>
        </div>
        <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="400">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/rsq2d8mq_expires_30_days.png" alt="المبيعات" className="mb-2" style={{height: '60px'}} />
          <h3 className="fw-bold">25,000+</h3>
          <p>مبيعات سنوية</p>
        </div>
      </div>
    </section>
  );
} 