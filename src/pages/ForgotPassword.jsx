import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{background: '#f8f9fa'}}>
      <div className="bg-white p-4 rounded shadow" style={{maxWidth: 400, width: '100%'}} data-aos="zoom-in">
        <h4 className="mb-4 text-center fw-bold">نسيت كلمة المرور؟</h4>
        {submitted ? (
          <div className="alert alert-success text-center" data-aos="fade-up">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger w-100">إرسال</button>
          </form>
        )}
      </div>
    </div>
  );
} 