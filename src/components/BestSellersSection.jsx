import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FlashSalesShowcase.css';

const products = [
  {
    id: 1,
    name: 'معطف شتوي فاخر',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/17vqoupq_expires_30_days.png',
    price: '٢٦٠ ر.س',
    oldPrice: '٣٦٠ ر.س',
    rating: 4.5,
    reviews: 65,
    discount: '-30%'
  },
  {
    id: 2,
    name: 'حقيبة قماشية فاخرة',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/dkmtv0sn_expires_30_days.png',
    price: '٩٦٠ ر.س',
    oldPrice: '١١٦٠ ر.س',
    rating: 4.7,
    reviews: 80,
    discount: '-17%'
  },
  {
    id: 3,
    name: 'مبرد معالج RGB',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aaeq5ziz_expires_30_days.png',
    price: '١٦٠ ر.س',
    oldPrice: '١٧٠ ر.س',
    rating: 4.3,
    reviews: 50,
    discount: '-6%'
  },
  {
    id: 4,
    name: 'مكتبة صغيرة',
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/3dj2nxa1_expires_30_days.png',
    price: '٣٦٠ ر.س',
    oldPrice: '',
    rating: 4.8,
    reviews: 99,
    discount: ''
  }
];

export default function BestSellersSection() {
  const navigate = useNavigate();
  return (
    <div className="bestsellers-section bestsellers-section-bg" data-aos="fade-up">
      <div className="d-flex justify-content-between align-items-start mb-5 ms-lg-5 gap-5">
        <div className="d-flex flex-column flex-shrink-0 align-items-start me-5 gap-3">
          <div className="d-flex align-items-center pe-1 gap-3">
            <div className="bg-danger rounded flashsales-bar"></div>
            <span className="text-danger fw-bold fs-6">هذا الشهر</span>
          </div>
          <span className="text-black fw-bold display-5">الأكثر مبيعًا</span>
        </div>
        <button className="btn btn-danger px-5 py-3 fw-bold mt-4" onClick={()=>navigate('/shop')}>عرض الكل</button>
      </div>
      <div className="row g-4 ms-lg-5 mb-5">
        {products.map((product, idx) => (
          <div key={product.id} className="col-12 col-md-3" data-aos="zoom-in">
            <div className="flashsales-card card h-100 p-3 d-flex flex-column align-items-center justify-content-center">
              <Link to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <img src={product.image} alt={product.name} className="mb-3" style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer'}} />
              </Link>
              <Link to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <span className="fw-bold fs-5 mt-2" style={{cursor: 'pointer'}}>{product.name}</span>
              </Link>
              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="text-danger fw-bold">{product.price}</span>
                {product.oldPrice && <span className="fw-bold text-decoration-line-through">{product.oldPrice}</span>}
              </div>
              <div className="d-flex align-items-center gap-2 mt-2">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0rblkmcb_expires_30_days.png" style={{width: '100px', height: '20px'}} alt="rating" />
                <span className="fw-bold">({product.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flashsales-divider mx-lg-5 mb-5"></div>
    </div>
  );
} 