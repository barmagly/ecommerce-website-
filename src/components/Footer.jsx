import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 py-md-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6 col-12">
            <div className="footer-section">
              <img src="/images/logo.png" alt="Logo" className="mb-3 mb-md-4 footer-logo" />
              <h5 className="mb-3 mb-md-4 footer-title">عن الشركة</h5>
              <p className="mb-3 mb-md-4 footer-text">نحن نقدم أفضل المنتجات بأفضل الأسعار مع خدمة عملاء متميزة على مدار الساعة.</p>
              <div className="d-flex gap-3 social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white social-link">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            <div className="footer-section">
              <h5 className="mb-3 mb-md-4 footer-title">روابط سريعة</h5>
              <ul className="list-unstyled footer-links">
                <li className="mb-2">
                  <Link to="/" className="text-white text-decoration-none footer-link">الرئيسية</Link>
                </li>
                <li className="mb-2">
                  <Link to="/shop" className="text-white text-decoration-none footer-link">المتجر</Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white text-decoration-none footer-link">اتصل بنا</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            <div className="footer-section">
              <h5 className="mb-3 mb-md-4 footer-title">حسابي</h5>
              <ul className="list-unstyled footer-links">
                <li className="mb-2">
                  <Link to="/profile" className="text-white text-decoration-none footer-link">حسابي</Link>
                </li>
                <li className="mb-2">
                  <Link to="/orders" className="text-white text-decoration-none footer-link">طلباتي</Link>
                </li>
                <li className="mb-2">
                  <Link to="/wishlist" className="text-white text-decoration-none footer-link">المفضلة</Link>
                </li>
                <li className="mb-2">
                  <Link to="/cart" className="text-white text-decoration-none footer-link">سلة المشتريات</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            <div className="footer-section">
              <h5 className="mb-3 mb-md-4 footer-title">تواصل معنا</h5>
              <ul className="list-unstyled footer-contact">
                <li className="mb-2 contact-item">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  نجع حمادي, قنا, مصر 
                </li>
                <li className="mb-2 contact-item">
                  <i className="fas fa-phone me-2"></i>
                  01276218191
                </li>
                <li className="mb-2 contact-item">
                  <i className="fas fa-envelope me-2"></i>
                  support@mizanoo.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 copyright-text">© 2025 جميع الحقوق محفوظة - برمجلى Barmagly</p>
          </div>
        </div>
      </div>
      <style>{`
        .footer-section {
          padding: 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          height: 100%;
          transition: all 0.3s ease;
        }
        
        .footer-section:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .footer-logo {
          height: 160px;
          width: 160px;
          transition: transform 0.3s ease;
        }
        
        .footer-logo:hover {
          transform: scale(1.05);
        }
        
        .footer-title {
          font-weight: 600;
          color: #fff;
          position: relative;
        }
        
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 0;
          width: 30px;
          height: 2px;
          background: #dc3545;
          border-radius: 1px;
        }
        
        .footer-text {
          line-height: 1.6;
          color: #ccc;
        }
        
        .footer-links {
          margin: 0;
        }
        
        .footer-link {
          display: block;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .footer-link:hover {
          color: #dc3545 !important;
          padding-right: 0.5rem;
        }
        
        .footer-link::before {
          content: '→';
          position: absolute;
          right: -15px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .footer-link:hover::before {
          opacity: 1;
          right: -20px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          color: #ccc;
          transition: all 0.3s ease;
        }
        
        .contact-item:hover {
          color: #dc3545;
          transform: translateX(-5px);
        }
        
        .contact-item i {
          color: #dc3545;
          width: 20px;
          text-align: center;
        }
        
        .social-links {
          margin-top: 1rem;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .social-link:hover {
          background: #dc3545;
          transform: translateY(-3px);
          color: white !important;
        }
        
        .copyright-text {
          color: #999;
          font-size: 0.9rem;
        }
        
        /* Mobile Responsive */
        @media (max-width: 991px) {
          .footer-section {
            padding: 0.75rem;
            margin-bottom: 1rem;
          }
          
          .footer-logo {
            height: 200px;
            width: 200px;
          }
        }
        
        @media (max-width: 768px) {
          footer {
            padding: 2rem 0 !important;
          }
          
          .footer-section {
            padding: 1rem;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          
          .footer-logo {
            height: 120px;
            width: 120px;
            margin: 0 auto 1rem;
            display: block;
          }
          
          .footer-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
          
          .footer-title::after {
            right: 50%;
            transform: translateX(50%);
          }
          
          .footer-text {
            font-size: 0.9rem;
            text-align: center;
          }
          
          .footer-links {
            text-align: center;
          }
          
          .footer-link {
            padding: 0.4rem 0;
            font-size: 0.9rem;
          }
          
          .footer-link:hover {
            padding-right: 0;
          }
          
          .contact-item {
            justify-content: center;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          
          .contact-item i {
            margin-left: 0.5rem;
            margin-right: 0;
          }
          
          .social-links {
            justify-content: center;
            margin-top: 1.5rem;
          }
          
          .social-link {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }
          
          .copyright-text {
            font-size: 0.8rem;
            padding: 0 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .footer-section {
            padding: 0.75rem;
            margin-bottom: 1rem;
            border-radius: 8px;
          }
          
          .footer-logo {
            height: 100px;
            width: 100px;
          }
          
          .footer-title {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }
          
          .footer-text {
            font-size: 0.85rem;
            line-height: 1.5;
          }
          
          .footer-link {
            padding: 0.3rem 0;
            font-size: 0.85rem;
          }
          
          .contact-item {
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
          }
          
          .contact-item i {
            font-size: 0.8rem;
          }
          
          .social-link {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }
          
          .copyright-text {
            font-size: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .footer-section {
            padding: 0.5rem;
            margin-bottom: 0.75rem;
          }
          
          .footer-logo {
            height: 90px;
            width: 90px;
          }
          
          .footer-title {
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
          }
          
          .footer-text {
            font-size: 0.8rem;
          }
          
          .footer-link {
            padding: 0.25rem 0;
            font-size: 0.8rem;
          }
          
          .contact-item {
            font-size: 0.8rem;
            margin-bottom: 0.3rem;
          }
          
          .social-link {
            width: 30px;
            height: 30px;
            font-size: 0.75rem;
          }
          
          .copyright-text {
            font-size: 0.7rem;
          }
        }
        
        @media (max-width: 360px) {
          .footer-section {
            padding: 0.4rem;
          }
          
          .footer-logo {
            height: 80px;
            width: 80px;
          }
          
          .footer-title {
            font-size: 0.9rem;
          }
          
          .footer-text {
            font-size: 0.75rem;
          }
          
          .footer-link {
            font-size: 0.75rem;
          }
          
          .contact-item {
            font-size: 0.75rem;
          }
          
          .social-link {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </footer>
  );
} 