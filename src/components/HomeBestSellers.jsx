import React from 'react';

export default function HomeBestSellers() {
  const products = [
    {
      name: 'سماعة بلوتوث لاسلكية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 100,
      rating: 4.5,
      reviews: 65,
      discount: 20
    },
    {
      name: 'كاميرا رقمية احترافية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png',
      price: 1500,
      rating: 4.8,
      reviews: 120,
      discount: 15
    },
    {
      name: 'ساعة ذكية متطورة',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png',
      price: 300,
      rating: 4.3,
      reviews: 89,
      discount: 10
    },
    {
      name: 'حاسوب محمول للألعاب',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 2000,
      rating: 4.9,
      reviews: 45,
      discount: 5
    }
  ];

  return (
    <div className="container my-5" style={{direction: 'rtl'}}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger" style={{width: '20px', height: '40px', borderRadius: '4px'}}></div>
            <span className="text-danger fw-bold">المنتجات الأكثر مبيعاً</span>
          </div>
          <h2 className="fw-bold" style={{fontSize: '2.5rem'}}>أفضل المنتجات</h2>
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
        {products.map((product, index) => (
          <div key={index} className="col-12 col-md-3">
            <div className="card border h-100">
              <div className="position-relative">
                <div className="position-absolute top-0 start-0 m-2">
                  <span className="badge bg-danger">-{product.discount}%</span>
                </div>
                <img 
                  src={product.image}
                  alt={product.name}
                  className="card-img-top p-4"
                  style={{height: '200px', objectFit: 'contain'}}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <button className="btn btn-light rounded-circle p-2">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title fw-bold">{product.name}</h5>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="text-warning">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i}
                        className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-muted">({product.reviews})</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-danger fw-bold">${product.price - (product.price * product.discount / 100)}</span>
                  <span className="text-muted text-decoration-line-through">${product.price}</span>
                </div>
              </div>
              <div className="card-footer bg-white border-0">
                <button className="btn btn-danger w-100">أضف إلى السلة</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 