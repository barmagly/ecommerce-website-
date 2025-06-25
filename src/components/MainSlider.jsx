import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainSlider.css";
import { useDispatch, useSelector } from "react-redux";
// Using the new, more efficient thunk
import { getDiscountedProductsThunk } from "../services/Slice/product/product";

// Expanded array of background gradients for the slides
const slideBackgrounds = [
    'linear-gradient(285deg, #fde4e1, #e6f0ff)', // Light pink to light blue
    'linear-gradient(285deg, #e1f5fe, #fce4ec)', // Light cyan to light pink
    'linear-gradient(285deg, #e8f5e9, #fff3e0)', // Light green to light orange
    'linear-gradient(285deg, #f3e5f5, #e0f7fa)', // Light purple to light cyan
    'linear-gradient(285deg, #fffde7, #e8eaf6)', // Light yellow to light indigo
    'linear-gradient(285deg, #ffebee, #e3f2fd)', // Reddish to blueish
    'linear-gradient(285deg, #fbe9e7, #e0f2f1)', // Deep orange to teal
    'linear-gradient(285deg, #e1f5fe, #fff9c4)', // Light blue to yellow
    'linear-gradient(285deg, #dcedc8, #fce4ec)', // Light green to pink
    'linear-gradient(285deg, #f9fbe7, #f1f8e9)', // Lime to green
    'linear-gradient(285deg, #eceff1, #fafafa)', // Blue grey to grey
    'linear-gradient(285deg, #fff8e1, #fbe9e7)', // Amber to deep orange
];

export default function MainSlider() {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const { products: slides, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    // Dispatching the new thunk to get only discounted products
    dispatch(getDiscountedProductsThunk());
  }, [dispatch]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };
  
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };
  
  useEffect(() => {
    if (slides.length > 0) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [current, slides.length]);


  if (loading) {
    return (
      <div className="main-slider-placeholder">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-slider-placeholder">
        <div className="alert alert-danger">Error loading products.</div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
        <div className="main-slider-placeholder">
            <div className="alert alert-info">No discounted products available right now.</div>
        </div>
    );
  }
  
  // Dynamic background style
  const sliderStyle = {
    background: slideBackgrounds[current % slideBackgrounds.length],
    transition: 'background 0.8s ease-in-out',
  };

  return (
    <div className="main-slider-section" style={sliderStyle}>
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            className={`slide-item ${index === current ? "active" : ""}`}
            key={slide._id}
          >
            <div className="slide-content-wrapper">
              <div className="slide-text">
                <h3 className="slide-promo-title">عروض لا تقاوم!</h3>
                <h2 className="slide-product-name">{slide.name}</h2>
                <p className="slide-product-desc">
                  خصم يصل إلى{" "}
                  {slide.originalPrice ? Math.round(((slide.originalPrice - slide.price) / slide.originalPrice) * 100) : 0}%!
                  اكتشف الجودة والفخامة بأفضل الأسعار.
                </p>
                <Link to={`/product/${slide._id}`} className="shop-now-btn">
                  تسوق الآن <i className="fas fa-arrow-left"></i>
                </Link>
              </div>
              <div className="slide-image-container">
                <img
                  src={slide.imageCover}
                  alt={slide.name}
                  className="slide-main-image"
                  style={{ width: 320, height: 320, objectFit: 'contain', borderRadius: 16, background: '#f6f6f6', display: 'block', margin: '0 auto' }}
                />
                 {slide.originalPrice && (
                  <div className="price-badge">
                    <span className="old-price">{slide.originalPrice} ج.م</span>
                    <span className="new-price">{slide.price} ج.م</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-nav prev" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="slider-nav next" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
} 