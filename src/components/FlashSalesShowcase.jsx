import React from 'react';
import './FlashSalesShowcase.css';
import { useNavigate } from 'react-router-dom';

export default function FlashSalesShowcase() {
  const navigate = useNavigate();

  return (
    <div className="flashsales-section container-fluid px-0">
      <div className="flashsales-header d-flex align-items-start mb-5 ms-lg-5 gap-5">
        <div className="d-flex flex-shrink-0 align-items-start me-lg-5">
          <div className="d-flex flex-column flex-shrink-0 align-items-start me-5 gap-3">
            <div className="d-flex align-items-center pe-1 gap-3">
              <div className="bg-danger rounded flashsales-bar"></div>
              <span className="text-danger fw-bold fs-6">اليوم</span>
            </div>
            <span className="text-black fw-bold display-5">عروض سريعة</span>
          </div>
          <div className="d-flex flex-shrink-0 align-items-start mt-5 gap-3">
            {/* Countdown */}
            <div className="d-flex flex-column align-items-start gap-1">
              <span className="text-black fw-bold small">أيام</span>
              <span className="text-black fw-bold fs-2">03</span>
            </div>
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/pz29zyyi_expires_30_days.png" className="flashsales-colon" alt=":" />
            <div className="d-flex flex-column align-items-center gap-1">
              <span className="text-black fw-bold small">ساعات</span>
              <span className="text-black fw-bold fs-2">23</span>
            </div>
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vs080g5w_expires_30_days.png" className="flashsales-colon" alt=":" />
            <div className="d-flex flex-column align-items-start gap-1">
              <span className="text-black fw-bold small">دقائق</span>
              <span className="text-black fw-bold fs-2">19</span>
            </div>
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/v9e7gs4v_expires_30_days.png" className="flashsales-colon" alt=":" />
            <div className="d-flex flex-column align-items-start gap-1">
              <span className="text-black fw-bold small">ثواني</span>
              <span className="text-black fw-bold fs-2">56</span>
            </div>
          </div>
        </div>
        <div className="d-flex flex-shrink-0 align-items-start mt-5 gap-2">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/76wfuyft_expires_30_days.png" className="flashsales-arrow" alt="arrow" />
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/2x170gk5_expires_30_days.png" className="flashsales-arrow" alt="arrow" />
        </div>
      </div>
      <div className="flashsales-products d-flex flex-row flex-nowrap gap-4 ms-lg-5 mb-5">
        {/* Product Card 1 */}
        <div className="flashsales-card card p-3 me-4">
          <button className="btn btn-danger flashsales-discount mb-2">-40%</button>
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0u5q8j78_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png" className="flashsales-product-img mx-auto mb-2" alt="product" />
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/3d0kszxa_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <div className="mt-2">
            <span className="fw-bold">ذراع تحكم ألعاب HAVIT HV-G92</span>
            <div className="d-flex align-items-center gap-3 mt-2">
              <span className="text-danger fw-bold">١٢٠ ج.م</span>
              <span className="fw-bold">١٦٠ ج.م</span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/5bb131cw_expires_30_days.png" className="flashsales-rating" alt="rating" />
              <span className="fw-bold">(٨٨)</span>
            </div>
          </div>
        </div>
        {/* Product Card 2 */}
        <div className="flashsales-card card p-3 me-4">
          <button className="btn btn-danger flashsales-discount mb-2">-35%</button>
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/hvdt3xk4_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/peewgpo7_expires_30_days.png" className="flashsales-product-img mx-auto mb-2" alt="product" />
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/jw4i870w_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <div className="mt-2">
            <span className="fw-bold">لوحة مفاتيح AK-900 سلكية</span>
            <div className="d-flex align-items-center gap-3 mt-2">
              <span className="text-danger fw-bold">٩٦٠ ج.م</span>
              <span className="fw-bold">١١٦٠ ج.م</span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/agxt7a5e_expires_30_days.png" className="flashsales-rating" alt="rating" />
              <span className="fw-bold">(٧٥)</span>
            </div>
          </div>
        </div>
        {/* Product Card 3 */}
        <div className="flashsales-card card p-3 me-4">
          <button className="btn btn-danger flashsales-discount mb-2">-30%</button>
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/pd63bhn1_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/u3sr8u8k_expires_30_days.png" className="flashsales-product-img mx-auto mb-2" alt="product" />
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/gohxgwrh_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <div className="mt-2">
            <span className="fw-bold">شاشة ألعاب IPS LCD</span>
            <div className="d-flex align-items-center gap-3 mt-2">
              <span className="text-danger fw-bold">٣٧٠ ج.م</span>
              <span className="fw-bold">٤٠٠ ج.م</span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/gf1axtvb_expires_30_days.png" className="flashsales-rating" alt="rating" />
              <span className="fw-bold">(٩٩)</span>
            </div>
          </div>
        </div>
        {/* Product Card 4 */}
        <div className="flashsales-card card p-3">
          <button className="btn btn-danger flashsales-discount mb-2">-25%</button>
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/qjbp9d2e_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ml7dbshd_expires_30_days.png" className="flashsales-product-img mx-auto mb-2" alt="product" />
          <div className="d-flex flex-column align-items-end w-100">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0mt9hch4_expires_30_days.png" className="flashsales-icon mb-2" alt="icon" />
          </div>
          <div className="mt-2">
            <span className="fw-bold">كرسي مريح S-Series</span>
            <div className="d-flex align-items-center gap-3 mt-2">
              <span className="text-danger fw-bold">٣٧٥ ج.م</span>
              <span className="fw-bold">٤٠٠ ج.م</span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/vd722l4x_expires_30_days.png" className="flashsales-rating" alt="rating" />
              <span className="fw-bold">(٩٩)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <button className="btn btn-danger flashsales-viewall px-5 py-3 fw-bold" onClick={() => navigate('/shop')}>عرض جميع المنتجات</button>
      </div>
      <div className="flashsales-divider mx-lg-5 mb-5"></div>
    </div>
  );
} 