import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordThunk, clearPasswordState } from "../services/Slice/password/password";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.password);

  useEffect(() => {
    // Clear any previous state when component mounts
    dispatch(clearPasswordState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPasswordThunk(email));
  };

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="bg-white p-4 rounded-4 shadow-sm" style={{ border: '1px solid #eee' }}>
              <h4 className="mb-4 text-center fw-bold" style={{ color: '#333' }}>
                <i className="fas fa-lock text-danger ms-2"></i>
                نسيت كلمة المرور؟
              </h4>

              {success ? (
                <div className="text-center py-4">
                  <div className="alert alert-success mb-4" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                  </div>
                  <p className="text-muted mb-4">
                    يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة المرور
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/login')}
                  >
                    <i className="fas fa-arrow-right ms-2"></i>
                    العودة لصفحة تسجيل الدخول
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold" style={{ color: '#555' }}>
                      البريد الإلكتروني
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ borderRight: 'none' }}
                      />
                    </div>
                    <div className="form-text text-muted mt-2">
                      سنرسل لك رابطاً لإعادة تعيين كلمة المرور
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-2"
                    disabled={loading}
                    style={{ borderRadius: '8px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane ms-2"></i>
                        إرسال رابط إعادة التعيين
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 