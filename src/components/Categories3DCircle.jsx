import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesThunk } from '../services/Slice/categorie/categorie';
import './Categories3DCircle.css';

function useResponsiveCircle() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;
  return {
    radius: isMobile ? 110 : 340,
    perspective: isMobile ? 600 : 1200,
    baseScale: isMobile ? 0.7 : 0.55,
    maxScale: isMobile ? 1.1 : 1.6,
    angleStep: isMobile ? 45 : 60,
  };
}

export default function Categories3DCircle() {
  const [active, setActive] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categorie);
  const { radius, perspective, baseScale, maxScale, angleStep } = useResponsiveCircle();

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  // زاوية دوران الحلقة بحيث يكون العنصر النشط في المنتصف (زاوية 0)
  // لجعل العنصر النشط أقرب لليسار، أضف offset موجب
  const offset = -22; // يمكنك تعديل هذه القيمة حسب رغبتك
  const ringRotation = -active * angleStep + offset;

  const scrollToNext = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      setActive((prev) => (prev + 1) % (categories?.length || 1));

      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, categories?.length]);

  const scrollToPrev = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      setActive((prev) => (prev - 1 + (categories?.length || 1)) % (categories?.length || 1));

      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, categories?.length]);

  // التمرير التلقائي كل 3 ثواني
  useEffect(() => {
    if (!isAutoScrolling || isScrolling || !categories || categories.length === 0) return;

    const interval = setInterval(() => {
      scrollToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isScrolling, scrollToNext, categories]);

  // إيقاف التمرير التلقائي عند التفاعل مع الماوس
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  // Don't render if loading or no categories
  if (loading || !categories || categories.length === 0) {
    return (
      <div className="categories-3d-section d-flex flex-column align-items-center justify-content-center categories-section-bg">
        <h2 className="fw-bold mb-1">تصفح حسب التصنيف</h2>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-2">جاري تحميل التصنيفات...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="categories-3d-section d-flex flex-column align-items-center justify-content-center categories-section-bg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="fw-bold mb-1">تصفح حسب التصنيف</h2>
      <div className="categories-3d-perspective" style={{ perspective: `${perspective}px` }}>
        <div className="categories-3d-ring mx-auto">
          <div
            className="categories-3d-items-ring"
            style={{
              transform: `rotateY(${ringRotation}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {categories.map((cat, i) => {
              const angle = i * angleStep;
              const isActive = i === active;
              let diff = Math.abs(((angle - ringRotation) % 360 + 360) % 360);
              if (diff > 180) diff = 360 - diff;
              const scale = isActive ? maxScale : baseScale;
              const zIndex = isActive ? 99 : 1;
              const opacity = isActive ? 1 : 0.18;
              return (
                <div
                  key={cat._id}
                  className={`categories-3d-item${isActive ? ' active' : ''}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
                >
                  <div className="categories-3d-image mb-2">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        width="150"
                        height="150"
                        loading="lazy"
                        style={{
                          width: isActive ? '100px' : '150px',
                          height: isActive ? '100px' : '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.5s ease',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: isActive ? '80px' : '60px',
                          height: isActive ? '80px' : '60px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #dee2e6'
                        }}
                      >
                        <i className="fas fa-image text-muted"></i>
                      </div>
                    )}
                  </div>
                  <span className="fw-bold" style={{fontSize: isActive ? '.45rem' : '.45rem'}}>{cat.name}</span>
                </div>
              );
            })}
          </div>
          {/* أزرار التمرير */}
          <button
            className="categories-3d-arrow right"
            onClick={scrollToPrev}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #db4444',
              color: '#db4444',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <button
            className="categories-3d-arrow left"
            onClick={scrollToNext}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #db4444',
              color: '#db4444',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>

      {/* مؤشرات التمرير */}
      {/* <div className="d-flex justify-content-center">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`mx-1 rounded-circle ${index === active ? 'bg-danger' : 'bg-secondary'}`}
            style={{
              width: '8px',
              height: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActive(index);
            }}
          />
        ))}
      </div> */}
    </div>
  );
} 