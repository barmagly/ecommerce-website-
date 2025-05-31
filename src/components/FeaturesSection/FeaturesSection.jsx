import React from 'react';
import './FeaturesSection.css';

export default function FeaturesSection() {
    return (
        <div className="container py-5 " dir="rtl">
            <div className="row text-center">
                {/* Free and Fast Delivery */}
                <div className="col-md-4 col-sm-12 mb-4">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-truck"></i> {/* Delivery truck icon */}
                        </div>
                        <h4 className="feature-title">توصيل مجاني وسريع</h4>
                        <p className="feature-subtitle">توصيل مجاني لجميع الطلبات فوق 140$</p>
                    </div>
                </div>

                {/* 24/7 Customer Service */}
                <div className="col-md-4 col-sm-12 mb-4">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-headphones-alt"></i> {/* Headphones icon */}
                        </div>
                        <h4 className="feature-title">خدمة العملاء 24/7</h4>
                        <p className="feature-subtitle">دعم عملاء ودود على مدار الساعة</p>
                    </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="col-md-4 col-sm-12 mb-4">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i> {/* Shield icon */}
                        </div>
                        <h4 className="feature-title">ضمان استعادة الأموال</h4>
                        <p className="feature-subtitle">نعيد أموالك خلال 30 يومًا</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 