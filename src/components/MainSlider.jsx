import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainSlider.css";
import { useDispatch, useSelector } from "react-redux";
import { getNewArrivalProductsThunk } from "../services/Slice/home/home";

export default function MainSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dispatch = useDispatch();
  const { products: slides = [], loading, error } = useSelector(state => state.home);

  const prevSlide = () => {
    if (!isTransitioning && slides.length > 0) {
      setIsTransitioning(true);
      setCurrent((current - 1 + slides.length) % slides.length);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning && slides.length > 0) {
      setIsTransitioning(true);
      setCurrent((current + 1) % slides.length);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && slides.length > 0) {
      setIsTransitioning(true);
      setCurrent(index);
    }
  };

  useEffect(() => {
    setIsTransitioning(false);
    const timer = setTimeout(() => {
    }, 500);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    dispatch(getNewArrivalProductsThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info" role="alert">
          لا توجد منتجات جديدة متاحة حالياً
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="main-slider-section">
      <div className="custom-slider-card position-relative" style={{ background: '#f7f7fa' }}>
        <span className="badge bg-success position-absolute top-0 start-0 m-3">وصل حديثا</span>
        <button
          className={`slider-arrow left ${isTransitioning ? 'disabled' : ''}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="slider-content">
          <div className="main-card-image">
            <img src={slide?.imageCover} alt={slide?.name || 'منتج جديد'} />
          </div>
          <div className="main-card-text">
            <h6 className="slide-title">{slide?.brand || 'العلامة التجارية'}</h6>
            <h2 className="slide-subtitle">{slide?.name || 'اسم المنتج'}</h2>
            <Link
              to={`/product/${slide?._id}`}
              className={`shop-now-link bg-primary text-white`}
              style={{ background: '#e75480', color: '#fff' }}
            >
              تسوق الآن <i className="fas fa-arrow-left me-2"></i>
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