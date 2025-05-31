import React from 'react';
import './FlashSalesShowcase.css';
import './CategoriesSection.css';

const categories = [
  { name: 'إلكترونيات', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0u2hlqli_expires_30_days.png' },
  { name: 'أزياء', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png' },
  { name: 'أجهزة منزلية', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png' },
  { name: 'رياضة', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vtb8b3iz_expires_30_days.png' },
  { name: 'ألعاب أطفال', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vu3lbdpy_expires_30_days.png' },
  { name: 'الصحة والجمال', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png' },
];

export default function CategoriesSection() {
  return (
    <div className="flashsales-section container-fluid px-0">
      <div className="d-flex align-items-center mb-5 ms-lg-5 gap-5">
        <div className="d-flex flex-shrink-0 align-items-center me-lg-5">
          <div className="d-flex flex-column flex-shrink-0 align-items-start me-5 gap-3">
            <div className="d-flex align-items-center pe-1 gap-3">
              <div className="bg-danger rounded flashsales-bar"></div>
              <span className="text-danger fw-bold fs-6">التصنيفات</span>
            </div>
            <span className="text-black fw-bold display-5">تصفح حسب التصنيف</span>
          </div>
        </div>
        <div className="d-flex flex-shrink-0 align-items-center mt-4 gap-2">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0se98esy_expires_30_days.png" className="cat-arrow" alt="arrow" />
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/q3yod9xq_expires_30_days.png" className="cat-arrow" alt="arrow" />
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap gap-4 ms-lg-5 mb-5 justify-content-start">
        <div className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center">
          <div className="cat-img-bg mb-2" style={{backgroundImage: 'url(https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/in2k69sg_expires_30_days.png)'}}>
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/9l1q3vpg_expires_30_days.png" className="cat-icon" alt="هواتف" />
            <div className="cat-dot"></div>
          </div>
          <span className="fw-bold fs-5 mt-2">هواتف</span>
        </div>
        <button className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center cat-btn" onClick={()=>alert('Pressed!')}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/p7wsgy9c_expires_30_days.png" className="cat-icon" alt="حواسيب" />
          <span className="fw-bold fs-5 mt-2">حواسيب</span>
        </button>
        <button className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center cat-btn" onClick={()=>alert('Pressed!')}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/8hijv0m4_expires_30_days.png" className="cat-icon" alt="ساعة ذكية" />
          <span className="fw-bold fs-5 mt-2">ساعة ذكية</span>
        </button>
        <button className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center cat-btn" onClick={()=>alert('Pressed!')}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/eig3vc5p_expires_30_days.png" className="cat-icon" alt="كاميرا" />
          <span className="fw-bold fs-5 mt-2">كاميرا</span>
        </button>
        <button className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center cat-btn" onClick={()=>alert('Pressed!')}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ag16a6g1_expires_30_days.png" className="cat-icon" alt="سماعات" />
          <span className="fw-bold fs-5 mt-2">سماعات</span>
        </button>
        <button className="cat-card card p-3 d-flex flex-column align-items-center justify-content-center cat-btn" onClick={()=>alert('Pressed!')}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/zi8r2ce8_expires_30_days.png" className="cat-icon" alt="ألعاب" />
          <span className="fw-bold fs-5 mt-2">ألعاب</span>
        </button>
      </div>
      <div className="flashsales-divider mx-lg-5 mb-5"></div>
    </div>
  );
} 