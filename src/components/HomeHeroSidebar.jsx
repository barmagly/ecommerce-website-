import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeHeroSidebar() {
  const navigate = useNavigate();

  return (
    <div className="container my-4" style={{direction: 'rtl'}}>
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 mb-3 mb-md-0">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">أزياء نسائية</li>
            <li className="list-group-item">أزياء رجالية</li>
            <li className="list-group-item">إلكترونيات</li>
            <li className="list-group-item">المنزل والحياة</li>
            <li className="list-group-item">الصحة والجمال</li>
            <li className="list-group-item">الرياضة والهواء الطلق</li>
            <li className="list-group-item">الأطفال والألعاب</li>
            <li className="list-group-item">البقالة والحيوانات</li>
            <li className="list-group-item">الطب</li>
          </ul>
        </div>
        {/* Hero */}
        <div className="col-12 col-md-9 d-flex align-items-center bg-dark rounded-4 p-4 position-relative" style={{minHeight: 320}}>
          <div className="text-white">
            <div className="d-flex align-items-center gap-3 mb-2">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/qjlc87hw_expires_30_days.png" alt="iPhone" style={{width: 40, height: 49}} />
              <span style={{fontSize: '1.1em'}}>سلسلة iPhone 14</span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '2.5em'}}>خصم حتى 10% كوبون</h2>
            <button className="btn btn-danger px-4 py-2 fw-bold" onClick={() => navigate('/shop')}>تسوق الآن <i className="fas fa-arrow-left ms-2"></i></button>
          </div>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/7p9wi62g_expires_30_days.png" alt="iPhone Hero" className="position-absolute end-0 bottom-0" style={{width: 320, maxWidth: '60%', zIndex: 1}} />
        </div>
      </div>
    </div>
  );
} 