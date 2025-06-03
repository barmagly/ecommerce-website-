import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, googleLoginThunk } from "../services/Slice/auth/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile?.profile) || [];

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
    // هنا ممكن تضيف إرسال الإيميل للسيرفر مثلاً
    setSubmitted(true);
    toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
  };

  const handleLogin = async () => {
    if (!loginEmail || !password) {
      toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      const res = await dispatch(loginThunk({ email: loginEmail, password: password }));
      console.log(res);
      if (res.payload.status == "success") {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      } else {
        toast.error(res.payload.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await dispatch(googleLoginThunk({
        idToken: idToken,
        email: user?.email,
        name: user?.name
      }));
      console.log(res);
      if (res.payload.status === "success") {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      } else {
        toast.error(res.payload.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.log(`Google Login Failed ${error}`);
    toast.error("فشل تسجيل الدخول باستخدام Google", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  return (
    <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                <label className="form-label">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <input
                  type="text"
                  className="form-control border-0 border-bottom"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">كلمة المرور</label>
                <input
                  type="password"
                  className="form-control border-0 border-bottom"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center mb-4">
                <button
                  type="button"
                  className="btn btn-danger px-5 me-4"
                  onClick={handleLogin}
                >
                  تسجيل الدخول
                </button>
                <a
                  href="#"
                  className="text-danger text-decoration-none"
                  style={{ paddingRight: "20px" }}
                  onClick={handleForgot}
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <span style={{ fontSize: "16px" }}>ليس لديك حساب؟</span>
              <Link
                to="/signup"
                className="fw-bold text-danger"
                style={{ fontSize: "16px", textDecoration: "none" }}
              >
                سجل الآن
              </Link>
            </div>
            <div className="mt-4">
              <div className="w-100 d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  useOneTap
                  theme="filled_blue"
                  text="signin_with"
                  shape="rectangular"
                  locale="ar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.35)" }}
        >
          <div className="modal-dialog modal-dialog-centered" data-aos="zoom-in">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">نسيت كلمة المرور؟</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                {submitted ? (
                  <div
                    className="alert alert-success text-center"
                    data-aos="fade-up"
                  >
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit}>
                    <div className="mb-3">
                      <label htmlFor="forgot-email" className="form-label">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="forgot-email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-danger w-100">
                      إرسال
                    </button>
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
