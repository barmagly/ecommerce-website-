import React from 'react';

export default function HomeCategories() {
  const categories = [
    {
      name: 'هواتف',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0u2hlqli_expires_30_days.png',
      active: false
    },
    {
      name: 'حواسيب',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      active: false
    },
    {
      name: 'ساعات ذكية',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png',
      active: false
    },
    {
      name: 'كاميرات',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png',
      active: true
    },
    {
      name: 'سماعات',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vu3lbdpy_expires_30_days.png',
      active: false
    },
    {
      name: 'ألعاب',
      icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vtb8b3iz_expires_30_days.png',
      active: false
    }
  ];

  return (
    <div className="container my-5" style={{direction: 'rtl'}}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger" style={{width: '20px', height: '40px', borderRadius: '4px'}}></div>
            <span className="text-danger fw-bold">الأقسام</span>
          </div>
          <h2 className="fw-bold" style={{fontSize: '2.5rem'}}>تصفح حسب القسم</h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light rounded-circle p-3">
            <i className="fas fa-chevron-right"></i>
          </button>
          <button className="btn btn-light rounded-circle p-3">
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>

      <div className="row g-4">
        {categories.map((category, index) => (
          <div key={index} className="col-12 col-md-2">
            <div 
              className={`card border h-100 text-center p-4 ${category.active ? 'bg-danger text-white' : 'bg-white'}`}
              style={{cursor: 'pointer'}}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3">
                <img 
                  src={category.icon}
                  alt={category.name}
                  className="img-fluid"
                  style={{width: '56px', height: '56px', objectFit: 'contain'}}
                />
                <span className="fw-bold">{category.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 