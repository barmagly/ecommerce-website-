import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import "./MainSlider.css"; // We'll create this file next
// import { ReactComponent as AppleLogo } from '../assets/apple-logo.svg'; // Assuming you have an Apple logo SVG here

export default function MainSlider() {
    const categories = [
        "أزياء نسائية",
        "أزياء رجالية",
        "الإلكترونيات",
        "المنزل والمستلزمات",
        "الأدوية",
        "الرياضة والأنشطة الخارجية",
        "ألعاب وأطفال",
        "البقالة والحيوانات",
        "الصحة والجمال",
    ];

    return (
        <div className="container py-4" dir="rtl">
            <div className="row g-4">
                {/* القائمة الجانبية */}
                <div className="col-lg-3 d-none d-lg-block">
                    <div className="categories-card">
                        <h5 className="categories-title mb-3">التصنيفات</h5>
                        <ul className="list-group categories-list">
                            {categories.map((cat, i) => (
                                <li className="list-group-item d-flex justify-content-between border-0 align-items-center category-item" key={i}>
                                    <Link to="/" className="text-decoration-none text-dark category-link">
                                        {cat}
                                    </Link>
                                    <i className="fas fa-chevron-left category-icon"></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* السلايدر */}
                <div className="col-lg-9 col-12">
                    <Carousel
                        className="main-carousel"
                        interval={5000}
                        controls={true}
                        indicators={true}
                        fade={false}
                        pause="hover"
                    >
                        <Carousel.Item>
                            <div className="carousel-content bg-black text-white">
                                <div className="carousel-text">
                                    <div className="d-flex align-items-center mb-2">
                                        {/* <AppleLogo className="apple-logo me-2" /> */}
                                        <h6 className="mb-0">سلسلة iPhone 14</h6>
                                    </div>
                                    <h2 className="fw-bold mb-4">خصم يصل إلى 10%</h2>
                                    <Link to="/" className="shop-now-link">
                                        تسوق الآن <i className="fas fa-arrow-left ms-2"></i>
                                    </Link>
                                </div>
                                <div className="carousel-image">
                                    <img
                                        src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                                        alt="iPhone"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="carousel-content bg-black text-white">
                                <div className="carousel-text">
                                    <div className="d-flex align-items-center mb-2">
                                        {/* <AppleLogo className="apple-logo me-2" /> */}
                                        <h6 className="mb-0">أجهزة الألعاب</h6>
                                    </div>
                                    <h2 className="fw-bold mb-4">اكتشف أحدث الإكسسوارات</h2>
                                    <Link to="/" className="shop-now-link">
                                        تسوق الآن <i className="fas fa-arrow-left ms-2"></i>
                                    </Link>
                                </div>
                                <div className="carousel-image">
                                    <img
                                        src="https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp"
                                        alt="Gaming"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
