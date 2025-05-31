import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleForgot = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEmail("");
    setSubmitted(false);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6" data-aos="fade-left">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i07tl18a_expires_30_days.png"
              alt="تسجيل الدخول"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6" data-aos="fade-up">
            <h2 className="fw-bold mb-3">تسجيل الدخول</h2>
            <p className="mb-4">أدخل بياناتك أدناه</p>
            
            <form>
              <div className="mb-4">
                <label className="form-label">البريد الإلكتروني أو رقم الهاتف</label>
                <input type="text" className="form-control border-0 border-bottom" />
              </div>
              
              <div className="mb-4">
                <label className="form-label">كلمة المرور</label>
                <input type="password" className="form-control border-0 border-bottom" />
              </div>

              <div className="d-flex align-items-center mb-4">
                <button type="button" className="btn btn-danger px-5 me-4">
                  تسجيل الدخول
                </button>
                <a href="#" className="text-danger text-decoration-none" style={{paddingRight: '20px'}} onClick={handleForgot}>
                  نسيت كلمة المرور؟
                </a>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <span style={{fontSize: '16px'}}>ليس لديك حساب؟</span>
              <a href="/signup" className="fw-bold text-danger" style={{fontSize: '16px', textDecoration: 'none'}}>سجل الآن</a>
            </div>
            <button
              type="button"
              className="btn d-flex align-items-center justify-content-center w-100"
              style={{
                background: '#fff',
                color: '#444',
                fontWeight: 500,
                fontSize: '18px',
                border: '1px solid #dadce0',
                borderRadius: '24px',
                boxShadow: 'none',
                padding: '8px 0',
                marginTop: '20px',
                transition: 'box-shadow 0.2s, border 0.2s'
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png "
                alt="Google logo"
                style={{ width: '33px', height: '33px', marginLeft: '12px', background: '#fff' }}
              />
              <span style={{fontSize: '16px', fontWeight: 500}}>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{display: 'block', background: 'rgba(0,0,0,0.35)'}}>
          <div className="modal-dialog modal-dialog-centered" data-aos="zoom-in">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">نسيت كلمة المرور؟</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                {submitted ? (
                  <div className="alert alert-success text-center" data-aos="fade-up">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit}>
                    <div className="mb-3">
                      <label htmlFor="forgot-email" className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-control"
                        id="forgot-email"
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
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
} 