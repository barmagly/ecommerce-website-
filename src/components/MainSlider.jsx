import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountedProductsThunk } from "../services/Slice/product/product";
import "./MainSlider.css";
import { Skeleton } from "@mui/material";

export default function MainSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const timeoutRef = useRef();
  const dispatch = useDispatch();
  const { products: slides, loading, error } = useSelector((state) => state.product);
  const pageSize = 5;

  useEffect(() => {
    dispatch(getDiscountedProductsThunk({ page: 1, limit: pageSize }));
  }, [dispatch]);

  // Autoplay: advance every 4 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    timeoutRef.current = setInterval(() => {
      setPrev(current);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timeoutRef.current);
  }, [current, slides]);

  // Manual navigation resets autoplay and animates
  const nextSlide = () => {
    setPrev(current);
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setPrev(current);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Custom backgrounds for each slide (repeat or randomize if fewer than slides)
  const backgrounds = [
    'linear-gradient(135deg, #fde4e1, #e6f0ff)',
    'linear-gradient(135deg, #fff1eb,rgb(196, 221, 232))',
    'linear-gradient(135deg, #f9f9f9,rgb(230, 211, 248))',
    'linear-gradient(135deg,rgb(254, 230, 247),rgb(209, 217, 228))',
    'linear-gradient(135deg, #f5f7fa, #c3cfe2)'
  ];
  const bg = backgrounds[current % backgrounds.length];

  if (loading) {
    return ( 
      <div className="container py-5 text-center">
        <Skeleton variant="rounded" width='100%' height='350px' />
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

  return (
    <section className="main-slider-section" style={{ background: bg }}>
      <div className="slider-container">
        {slides.map((slide, idx) => {
          let className = "slide-item";
          if (idx === current) className += " active";
          else if (idx === prev) className += " inactive";
          else return null;
          return (
            <div className={className} key={slide._id}>
              <div className="slide-image-container">
                <img src={slide.imageCover} alt={slide.name} className="slide-main-image" />
              </div>
              <div className="slide-text">
                <h3 className="slide-promo-title">عروض لا تقاوم!</h3>
                <h2 className="slide-product-name">{slide.name}</h2>
                <p className="slide-product-desc">
                  خصم يصل إلى {slide.originalPrice ? Math.round(((slide.originalPrice - slide.price) / slide.originalPrice) * 100) : 0}%!
                  اكتشف الجودة والفخامة بأفضل الأسعار.
                </p>
                <Link to={`/product/${slide._id}`} className="shop-now-btn">تسوق الآن <i className="fa-solid fa-arrow-left" style={{ marginRight: "10px" }}></i></Link>
              </div>
            </div>
          );
        })}
        <button className="slider-nav prev" onClick={prevSlide}><i className="fa-solid fa-chevron-left"></i></button>
        <button className="slider-nav next" onClick={nextSlide}><i className="fa-solid fa-chevron-right"></i></button>
      </div>
    </section>
  );
}