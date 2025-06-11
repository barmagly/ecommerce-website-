import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk, clearPasswordState } from "../services/Slice/password/password";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useParams();
    const { loading, error, success, message } = useSelector((state) => state.password);

    useEffect(() => {
        // Clear any previous state when component mounts
        dispatch(clearPasswordState());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            toast.success(message || 'تم تغيير كلمة المرور بنجاح');
            navigate('/login');
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("كلمات المرور غير متطابقة");
            return;
        }

        if (password.length < 6) {
            toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
            return;
        }

        dispatch(resetPasswordThunk({ token, password }));
    };

    return (
        <>
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="bg-white p-4 rounded-4 shadow-sm" style={{ border: '1px solid #eee' }}>
                            <h4 className="mb-4 text-center fw-bold" style={{ color: '#333' }}>
                                <i className="fas fa-key text-danger ms-2"></i>
                                إعادة تعيين كلمة المرور
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-bold" style={{ color: '#555' }}>
                                        كلمة المرور الجديدة
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="أدخل كلمة المرور الجديدة"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            style={{ borderRight: 'none' }}
                                        />
                                    </div>
                                    <div className="form-text text-muted mt-2">
                                        يجب أن تكون كلمة المرور 6 أحرف على الأقل
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-bold" style={{ color: '#555' }}>
                                        تأكيد كلمة المرور
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="أعد إدخال كلمة المرور"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            style={{ borderRight: 'none' }}
                                        />
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
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save ms-2"></i>
                                            حفظ كلمة المرور الجديدة
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
} 