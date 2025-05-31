import React from "react";
import { TileLayer } from "react-leaflet";

export default function ContactInfo() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="mb-5" data-aos="fade-right">
        <div className="d-flex align-items-center mb-4">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/8fw22gxw_expires_30_days.png" alt="اتصل بنا" className="me-3" style={{width: '40px', height: '40px'}} />
          <h5 className="mb-0 fw-bold">اتصل بنا</h5>
        </div>
        <div className="ps-5">
          <p className="mb-2">نحن متاحون على مدار الساعة طوال أيام الأسبوع.</p>
          <p className="mb-0">هاتف: +20 123 456 789</p>
        </div>
      </div>

      <hr className="my-4" />

      <div data-aos="fade-left">
        <div className="d-flex align-items-center mb-4">
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/q3kcus2e_expires_30_days.png" alt="اكتب لنا" className="me-3" style={{width: '40px', height: '40px'}} />
          <h5 className="mb-0 fw-bold">اكتب لنا</h5>
        </div>
        <div className="ps-5">
          <p className="mb-2">املأ النموذج وسنرد عليك خلال 24 ساعة.</p>
          <p className="mb-1">البريد الإلكتروني: info@example.com</p>
          <p className="mb-0">الدعم الفني: support@example.com</p>
        </div>
      </div>
    </div>
  );
} 