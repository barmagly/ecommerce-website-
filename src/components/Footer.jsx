import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <img src="/images/logo.png" alt="Logo" className="mb-4" style={{height: '80px', width: '80px'}} />
            <h5 className="mb-4">عن الشركة</h5>
            <p className="mb-4">نحن نقدم أفضل المنتجات بأفضل الأسعار مع خدمة عملاء متميزة على مدار الساعة.</p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="mb-4">روابط سريعة</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">الرئيسية</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">من نحن</Link>
              </li>
              <li className="mb-2">
                <Link to="/shop" className="text-white text-decoration-none">المتجر</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">اتصل بنا</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="mb-4">حسابي</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/profile" className="text-white text-decoration-none">حسابي</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-white text-decoration-none">طلباتي</Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" className="text-white text-decoration-none">المفضلة</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-white text-decoration-none">سلة المشتريات</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="mb-4">تواصل معنا</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                القاهرة، مصر
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                +20 123 456 789
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                info@example.com
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">© 2025 جميع الحقوق محفوظة - برمجلى Barmagly</p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .footer-card, .col-lg-3, .col-md-6, .col-12 {
            text-align: center !important;
          }
          footer .row.g-4 > div {
            background: #232323;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 24px 16px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </footer>
  );
} 