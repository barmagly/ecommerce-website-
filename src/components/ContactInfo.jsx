import React from "react";
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactInfo() {
  return (
    <div className="contact-info bg-white p-5 rounded-3 shadow-sm h-100">
      <h3 className="mb-4 fw-bold">معلومات التواصل</h3>
      
      <div className="contact-item mb-4" data-aos="fade-right">
        <div className="d-flex align-items-center mb-3">
          <div className="icon-wrapper me-3">
            <FaPhone className="text-primary" size={24} />
          </div>
          <h5 className="mb-0 fw-bold">اتصل بنا</h5>
        </div>
        <div className="ps-5">
          <p className="mb-2 text-muted">نحن متاحون على مدار الساعة طوال أيام الأسبوع</p>
          <p className="mb-0 fw-bold">+20 123 456 789</p>
        </div>
      </div>

      <div className="contact-item mb-4" data-aos="fade-left">
        <div className="d-flex align-items-center mb-3">
          <div className="icon-wrapper me-3">
            <FaEnvelope className="text-primary" size={24} />
          </div>
          <h5 className="mb-0 fw-bold">اكتب لنا</h5>
        </div>
        <div className="ps-5">
          <p className="mb-2 text-muted">سنرد عليك خلال 24 ساعة</p>
          <p className="mb-1 fw-bold">support@mizanoo.com</p>
          <p className="mb-0 fw-bold">support@example.com</p>
        </div>
      </div>

      <div className="contact-item mb-4" data-aos="fade-right">
        <div className="d-flex align-items-center mb-3">
          <div className="icon-wrapper me-3">
            <FaClock className="text-primary" size={24} />
          </div>
          <h5 className="mb-0 fw-bold">ساعات العمل</h5>
        </div>
        <div className="ps-5">
          <p className="mb-1 fw-bold">السبت - الخميس: 9 صباحاً - 5 مساءً</p>
          <p className="mb-0 fw-bold">الجمعة: مغلق</p>
        </div>
      </div>

      <div className="contact-item" data-aos="fade-left">
        <div className="d-flex align-items-center mb-3">
          <div className="icon-wrapper me-3">
            <FaMapMarkerAlt className="text-primary" size={24} />
          </div>
          <h5 className="mb-0 fw-bold">موقعنا</h5>
        </div>
        <div className="ps-5">
          <p className="mb-0 fw-bold">123 شارع الرئيسي، القاهرة، مصر</p>
        </div>
      </div>

      <style jsx>{`
        .contact-info {
          transition: all 0.3s ease;
        }
        .contact-info:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .contact-item {
          transition: all 0.3s ease;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .contact-item:hover {
          background-color: #f8f9fa;
        }
        .icon-wrapper {
          width: 48px;
          height: 48px;
          background-color: rgba(13,110,253,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
} 