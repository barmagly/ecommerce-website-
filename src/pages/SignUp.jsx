import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SignUp() {
  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6" data-aos="fade-left">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xbpelz0y_expires_30_days.png"
              alt="تسجيل حساب جديد"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6" data-aos="fade-up">
            <h2 className="fw-bold mb-3">إنشاء حساب جديد</h2>
            <p className="mb-4">أدخل بياناتك أدناه</p>
            <form>
              <div className="mb-4">
                <label className="form-label">الاسم <span style={{color: 'red'}}>*</span></label>
                <input type="text" className="form-control border-0 border-bottom" />
              </div>
              <div className="mb-4">
                <label className="form-label">العنوان <span style={{color: 'red'}}>*</span></label>
                <input type="text" className="form-control border-0 border-bottom" />
              </div>
              <div className="mb-4">
                <label className="form-label">رقم الهاتف <span style={{color: 'red'}}>*</span></label>
                <input type="text" className="form-control border-0 border-bottom" />
              </div>
              <div className="mb-4">
                <label className="form-label">البريد الإلكتروني <span style={{color: 'red'}}>*</span></label>
                <input type="text" className="form-control border-0 border-bottom" />
              </div>
              <div className="mb-4">
                <label className="form-label">كلمة المرور <span style={{color: 'red'}}>*</span></label>
                <input type="password" className="form-control border-0 border-bottom" />
              </div>
              <div className="d-flex flex-column gap-3 mb-4">
                <button type="button" className="btn btn-danger py-2 fw-bold" style={{fontSize: '18px'}}>إنشاء حساب</button>
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
                    transition: 'box-shadow 0.2s, border 0.2s'
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                    alt="Google logo"
                    style={{ width: '33px', height: '33px', marginLeft: '12px', background: '#fff' }}
                  />
                  <span style={{fontSize: '16px', fontWeight: 500}}>التسجيل بواسطة Google</span>
                </button>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <span style={{fontSize: '16px'}}>لديك حساب بالفعل؟</span>
              <a href="/login" className="fw-bold text-danger" style={{fontSize: '16px', textDecoration: 'none'}}>تسجيل الدخول</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 