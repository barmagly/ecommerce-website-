import React, { useState } from 'react';
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
  const navigate = useNavigate();
  const { radius, perspective, baseScale, maxScale, angleStep } = useResponsiveCircle();

  // زاوية دوران الحلقة بحيث يكون العنصر النشط في المنتصف (زاوية 0)
  const ringRotation = -active * angleStep;

  return (
    <div className="categories-3d-section d-flex flex-column align-items-center justify-content-center categories-section-bg">
      <h2 className="fw-bold mb-1">تصفح حسب التصنيف</h2>
      <div className="categories-3d-perspective" style={{perspective: `${perspective}px`}}>
        <div className="categories-3d-ring mx-auto">
          <div
            className="categories-3d-items-ring"
            style={{
              transform: `rotateY(${ringRotation}deg)`
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
          <button className="categories-3d-arrow right" onClick={() => setActive((active - 1 + categories.length) % categories.length)}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <button className="categories-3d-arrow left" onClick={() => setActive((active + 1) % categories.length)}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 