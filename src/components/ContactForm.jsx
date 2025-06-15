import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="contact-form bg-white p-5 rounded-3 shadow-sm" data-aos="fade-left">
      <h3 className="mb-4 fw-bold">أرسل لنا رسالة</h3>
      <form onSubmit={handleSubmit}>
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="form-floating">
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                placeholder="الاسم"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="name">الاسم *</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-floating">
              <input
                type="email"
                name="email"
                className="form-control"
                id="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">البريد الإلكتروني *</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-floating">
              <input
                type="tel"
                name="phone"
                className="form-control"
                id="phone"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label htmlFor="phone">رقم الهاتف *</label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="form-floating">
            <textarea
              name="message"
              className="form-control"
              id="message"
              placeholder="رسالتك"
              style={{ height: '150px' }}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="message">رسالتك *</label>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill fw-bold">
            إرسال الرسالة
          </button>
        </div>
      </form>

      <style jsx>{`
        .contact-form {
          transition: all 0.3s ease;
        }
        .contact-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .form-control {
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
        }
        .btn-primary {
          background: linear-gradient(45deg, #0d6efd, #0a58ca);
          border: none;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(13,110,253,0.3);
        }
      `}</style>
    </div>
  );
} 