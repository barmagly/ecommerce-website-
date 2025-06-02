import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MainSlider.css";

const slides = [
  {
    bg: "#f7f7fa",
    img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg",
    title: "سلسلة iPhone 15",
    subtitle: "خصم يصل إلى 10%",
    btnClass: "bg-warning text-dark",
  },
  {
    bg: "#f7f7fa",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    title: "أحدث أجهزة الألعاب",
    subtitle: "تجربة لعب لا مثيل لها",
    btnClass: "bg-success text-white",
  },
  {
    bg: "#f7f7fa",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    title: "موضة صيف 2024",
    subtitle: "تسوق تشكيلات الأزياء الجديدة",
    btnClass: "bg-primary text-white",
  },
  {
    bg: "#f7f7fa",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "أجهزة منزلية ذكية",
    subtitle: "راحة وأناقة في كل زاوية",
    btnClass: "",
    btnStyle: { background: '#e75480', color: '#fff' }
  }
];

export default function MainSlider() {
  const [current, setCurrent] = useState(0);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const slide = slides[current];

  return (
    <div className="main-slider-section">
      <div className="custom-slider-card" style={{ background: slide.bg }}>
        <button className="slider-arrow left" onClick={prevSlide}>&#8592;</button>
        <div className="main-card-image">
          <img src={slide.img} alt={slide.title} />
        </div>
        <div className="main-card-text">
          <h6>{slide.title}</h6>
          <h2>{slide.subtitle}</h2>
          <Link
            to="/shop"
            className={`shop-now-link ${slide.btnClass}`}
            style={slide.btnStyle || {}}
          >
            تسوق الآن <i className="fas fa-arrow-left ms-2"></i>
          </Link>
        </div>
        <button className="slider-arrow right" onClick={nextSlide}>&#8594;</button>
      </div>
    </div>
  );
} 