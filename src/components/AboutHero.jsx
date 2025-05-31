import React from "react";

export default function AboutHero() {
  return (
    <section className="container py-5">
      <div className="row align-items-center mt-4">
        <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right" data-aos-delay="200">
          <h1 className="fw-bold mb-4" style={{fontSize: '48px'}}>قصتنا</h1>
          <p style={{fontSize: '18px'}}>
            تأسست منصتنا في عام 2015، وأصبحت اليوم من أكبر منصات التسوق الإلكتروني في المنطقة العربية. نقدم ملايين المنتجات من آلاف البائعين والعلامات التجارية، ونخدم مئات الآلاف من العملاء يومياً. هدفنا هو تقديم تجربة تسوق سهلة وآمنة مع أفضل الأسعار والخدمات.
          </p>
        </div>
        <div className="col-md-6 text-center" data-aos="fade-left" data-aos-delay="400">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/97uv22ue_expires_30_days.png" alt="قصتنا" className="img-fluid rounded" style={{maxHeight: '400px'}} />
        </div>
      </div>
    </section>
  );
} 