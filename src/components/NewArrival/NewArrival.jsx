import React from 'react';
import { Link } from 'react-router-dom';
import './NewArrival.css'; // We will create this file next

export default function NewArrival() {
    return (
        <div className="container py-5" dir="rtl">
            <div className="new-arrival-header mb-4">
                <span className="featured-tag">مميز</span>
                <h2 className="new-arrival-title">وصل حديثاً</h2>
            </div>

            <div className="row g-4">
                {/* Large Card (PlayStation 5) */}
                <div className="col-lg-7 col-12">
                    <div className="arrival-card large-card bg-black text-white">
                        <img
                            src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                            alt="PlayStation 5"
                            className="card-img"
                        />
                        <div className="card-content">
                            <h3 className="card-title">بلايستيشن 5</h3>
                            <p className="card-subtitle">النسخة الأبيض والأسود من بلايستيشن 5 معروضة للبيع.</p>
                            <Link to="/" className="shop-now-link">تسوق الآن</Link>
                        </div>
                    </div>
                </div>

                {/* Small Cards Stack (Women's Collection, Speakers, Perfume) */}
                <div className="col-lg-5 col-12">
                    <div className="row g-4">
                        {/* Women's Collection Card */}
                        <div className="col-12">
                            <div className="arrival-card small-card bg-black text-white">
                                <img
                                    src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                                    alt="Women's Collections"
                                    className="card-img"
                                />
                                <div className="card-content">
                                    <h3 className="card-title">مجموعات نسائية</h3>
                                    <p className="card-subtitle">مجموعات نسائية مميزة تمنحك إحساسًا مختلفًا.</p>
                                    <Link to="/" className="shop-now-link">تسوق الآن</Link>
                                </div>
                            </div>
                        </div>

                        {/* Speakers and Perfume Row */}
                        <div className="col-12">
                            <div className="row g-4">
                                {/* Speakers Card */}
                                <div className="col-md-6 col-12">
                                    <div className="arrival-card extra-small-card bg-black text-white">
                                        <img
                                            src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                                            alt="Speakers"
                                            className="card-img"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">مكبرات صوت</h3>
                                            <p className="card-subtitle">مكبرات صوت لاسلكية من أمازون</p>
                                            <Link to="/" className="shop-now-link">تسوق الآن</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Perfume Card */}
                                <div className="col-md-6 col-12">
                                    <div className="arrival-card extra-small-card bg-black text-white">
                                        <img
                                            src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                                            alt="Perfume"
                                            className="card-img"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">عطر</h3>
                                            <p className="card-subtitle">GUCCI INTENSE OUD EDP<br />عطر قوتشي عود مكثف</p>
                                            <Link to="/" className="shop-now-link">تسوق الآن</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}