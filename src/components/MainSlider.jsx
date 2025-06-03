import React, { useState, useEffect } from "react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrent((current - 1 + slides.length) % slides.length);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrent((current + 1) % slides.length);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrent(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="main-slider-section">
      <div className="custom-slider-card" style={{ background: slide.bg }}>
        <button
          className={`slider-arrow left ${isTransitioning ? 'disabled' : ''}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="slider-content">
          <div className="main-card-image">
            <img src={slide.img} alt={slide.title} />
          </div>
          <div className="main-card-text">
            <h6 className="slide-title">{slide.title}</h6>
            <h2 className="slide-subtitle">{slide.subtitle}</h2>
            <Link
              to="/shop"
              className={`shop-now-link ${slide.btnClass}`}
              style={slide.btnStyle || {}}
            >
              تسوق الآن <i className="fas fa-arrow-left ms-2"></i>
            </Link>
          </div>
        </div>

        <button
          className={`slider-arrow right ${isTransitioning ? 'disabled' : ''}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${current === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 