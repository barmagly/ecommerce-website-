import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesThunk } from "../services/Slice/categorie/categorie";

const fallbackCategories = [
  { slug: "electronics", name: "إلكترونيات", icon: "fas fa-tv", color: "#DB4444" },
  { slug: "clothes", name: "ملابس", icon: "fas fa-tshirt", color: "#25D366" },
  { slug: "games", name: "ألعاب", icon: "fas fa-gamepad", color: "#FFC107" },
  { slug: "bags", name: "حقائب", icon: "fas fa-shopping-bag", color: "#007bff" },
  { slug: "shoes", name: "أحذية", icon: "fas fa-shoe-prints", color: "#6f42c1" },
  { slug: "watches", name: "ساعات", icon: "fas fa-clock", color: "#20c997" },
  { slug: "home", name: "أجهزة منزلية", icon: "fas fa-home", color: "#fd7e14" },
  { slug: "books", name: "كتب", icon: "fas fa-book", color: "#28a745" },
  { slug: "sports", name: "مستلزمات رياضية", icon: "fas fa-running", color: "#17a2b8" },
  { slug: "accessories", name: "إكسسوارات", icon: "fas fa-gem", color: "#e83e8c" }
];

export default function ShopCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categorie);

  useEffect(() => {
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const handleCategoryClick = (categorySlug) => {
    setActiveCategory(categorySlug);
    // هنا يمكن إضافة منطق تصفية المنتجات
  };

  // Transform API categories to include colors and icons
  const transformedCategories = categories?.length > 0
    ? categories.map(cat => ({
      ...cat,
      color: fallbackCategories.find(fc => fc.slug === cat.slug)?.color || "#DB4444",
      icon: fallbackCategories.find(fc => fc.slug === cat.slug)?.icon || "fas fa-tag"
    }))
    : fallbackCategories;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-4" data-aos="fade-left">
      <style>
        {`
          .category-item {
            transition: all 0.2s ease-in-out;
          }
          .category-item:hover {
            transform: translateY(-4px);
          }
          .category-item:hover .category-icon {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `}
      </style>
      <h5 className="fw-bold mb-3">الأقسام</h5>
      <div className="d-flex flex-wrap gap-3">
        {transformedCategories.map(cat => (
          <div
            key={cat.slug}
            className="category-item"
            onClick={() => handleCategoryClick(cat.slug)}
            style={{
              cursor: 'pointer',
              transform: activeCategory === cat.slug ? 'scale(1.1)' : 'scale(1)',
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
                boxShadow: activeCategory === cat.slug ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <i className={`${cat.icon} text-white fa-2x`}></i>
            </div>
            <span
              className="fw-bold"
              style={{
                fontSize: '15px',
                color: activeCategory === cat.slug ? cat.color : 'inherit'
              }}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 