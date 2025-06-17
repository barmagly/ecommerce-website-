import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLaptop, FaTshirt, FaCouch, FaFutbol, FaGamepad, FaHeartbeat, FaClock, FaCamera } from 'react-icons/fa';
import './Categories3DCircle.css';

const categories = [
  { name: 'إلكترونيات', icon: <FaLaptop size={44} /> },
  { name: 'أزياء', icon: <FaTshirt size={44} /> },
  { name: 'أجهزة منزلية', icon: <FaCouch size={44} /> },
  { name: 'رياضة', icon: <FaFutbol size={44} /> },
  { name: 'ألعاب أطفال', icon: <FaGamepad size={44} /> },
  { name: 'الصحة والجمال', icon: <FaHeartbeat size={44} /> },
  { name: 'ساعات ذكية', icon: <FaClock size={44} /> },
  { name: 'كاميرات', icon: <FaCamera size={44} /> },
];

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
  const { radius, perspective, baseScale, maxScale, angleStep } = useResponsiveCircle();

  // زاوية دوران الحلقة بحيث يكون العنصر النشط في المنتصف (زاوية 0)
  const ringRotation = -active * angleStep;

  const scrollToNext = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      setActive((prev) => (prev + 1) % categories.length);
      
      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling]);

  const scrollToPrev = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      setActive((prev) => (prev - 1 + categories.length) % categories.length);
      
      // إعادة تفعيل التمرير بعد انتهاء الانيميشن
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling]);

  // التمرير التلقائي كل 3 ثواني
  useEffect(() => {
    if (!isAutoScrolling || isScrolling) return;

    const interval = setInterval(() => {
      scrollToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isScrolling, scrollToNext]);

  // إيقاف التمرير التلقائي عند التفاعل مع الماوس
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };
  
  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  return (
    <div 
      className="categories-3d-section d-flex flex-column align-items-center justify-content-center categories-section-bg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="fw-bold mb-1">تصفح حسب التصنيف</h2>
      <div className="categories-3d-perspective" style={{perspective: `${perspective}px`}}>
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
                  key={i}
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
                  <span className="categories-3d-icon mb-2">{cat.icon}</span>
                  <span className="fw-bold">{cat.name}</span>
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
      <div className="d-flex justify-content-center mt-4">
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
      </div>
    </div>
  );
} 