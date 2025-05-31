import React, { useState } from "react";

const categories = [
  { id: "electronics", name: "إلكترونيات", color: "#DB4444", icon: "fas fa-tv" },
  { id: "clothes", name: "ملابس", color: "#25D366", icon: "fas fa-tshirt" },
  { id: "games", name: "ألعاب", color: "#FFC107", icon: "fas fa-gamepad" },
  { id: "bags", name: "حقائب", color: "#007bff", icon: "fas fa-shopping-bag" },
  { id: "shoes", name: "أحذية", color: "#6f42c1", icon: "fas fa-shoe-prints" },
  { id: "watches", name: "ساعات", color: "#20c997", icon: "fas fa-clock" },
  { id: "home", name: "أجهزة منزلية", color: "#fd7e14", icon: "fas fa-home" },
  { id: "books", name: "كتب", color: "#28a745", icon: "fas fa-book" },
  { id: "sports", name: "مستلزمات رياضية", color: "#17a2b8", icon: "fas fa-running" },
  { id: "accessories", name: "إكسسوارات", color: "#e83e8c", icon: "fas fa-gem" }
];

export default function ShopCategories() {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    // هنا يمكن إضافة منطق تصفية المنتجات
  };

  return (
    <div className="mb-4" data-aos="fade-left">
      <h5 className="fw-bold mb-3">الأقسام</h5>
      <div className="d-flex flex-wrap gap-3">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-item"
            onClick={() => handleCategoryClick(cat.id)}
            style={{
              cursor: 'pointer',
              transform: activeCategory === cat.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <div
              className="category-icon"
              style={{
                width: 60,
                height: 60,
                background: cat.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <i className={`${cat.icon} text-white fa-2x`}></i>
            </div>
            <span
              className="fw-bold"
              style={{
                fontSize: '15px',
                color: activeCategory === cat.id ? cat.color : 'inherit'
              }}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .category-item {
          transition: all 0.2s ease-in-out;
        }
        .category-item:hover {
          transform: translateY(-4px);
        }
        .category-item:hover .category-icon {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
} 