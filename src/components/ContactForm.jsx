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
    <div className="bg-white p-4 rounded shadow-sm" data-aos="fade-left">
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="الاسم *"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="البريد الإلكتروني *"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="رقم الهاتف *"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <textarea
            name="message"
            className="form-control"
            rows="6"
            placeholder="رسالتك *"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-danger px-5 py-2">
            إرسال الرسالة
          </button>
        </div>
      </form>
    </div>
  );
} 