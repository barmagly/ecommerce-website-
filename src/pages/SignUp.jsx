import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { registerThunk, googleLoginThunk } from "../services/Slice/auth/auth";
import { GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userProfile?.profile) || [];

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!/[A-Za-z]/.test(pass)) {
      return "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل";
    }
    if (!/[0-9]/.test(pass)) {
      return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !address || !phone || !email || !password) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    try {
      const res = await dispatch(registerThunk({ name, address, phone, email, password }));
      console.log("Registration response:", res);

      if (res.payload?.status === "success") {
        toast.success("تم إنشاء الحساب بنجاح");
        navigate("/");
      } else {
        const errorMessage = res.payload?.message || "حدث خطأ أثناء إنشاء الحساب";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error?.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب";
      toast.error(errorMessage);
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

      console.log("Google login response:", res);
      if (res.payload?.status === "success") {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      } else {
        toast.error(res.payload?.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (error) {
      console.error("Google login error:", error);
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">
                  الاسم <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control border-0 border-bottom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  العنوان <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control border-0 border-bottom"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  رقم الهاتف <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control border-0 border-bottom"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  البريد الإلكتروني <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control border-0 border-bottom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  كلمة المرور <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  className={`form-control border-0 border-bottom ${passwordError ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordError && (
                  <div className="invalid-feedback d-block">
                    {passwordError}
                  </div>
                )}
                <small className="text-muted">
                  كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم واحد على الأقل
                </small>
              </div>
              <div className="d-flex flex-column gap-3 mb-4">
                <button
                  type="submit"
                  className="btn btn-danger py-2 fw-bold"
                  style={{ fontSize: "18px" }}
                >
                  إنشاء حساب
                </button>
                <div className="mt-4">
                  <div className="w-100 d-flex justify-content-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      useOneTap
                      theme="filled_blue"
                      text="signup_with"
                      shape="rectangular"
                      locale="ar"
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <span style={{ fontSize: "16px" }}>لديك حساب بالفعل؟</span>
              <Link
                to="/login"
                className="fw-bold text-danger"
                style={{ fontSize: "16px", textDecoration: "none" }}
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
