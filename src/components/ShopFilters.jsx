import React, { useState } from "react";
import axios from "axios";
import "./ShopFilters.css";
const API_URL = process.env.REACT_APP_API_URL

export default function ShopFilters({ onFiltersApplied, categories = [], products = [] }) {
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [inStock, setInStock] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate max price from products
  const maxPrice = Math.max(...products.map(product => product.price), 2000);

  const handleApplyFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters = {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        category: selectedCategory !== "الكل" ? selectedCategory : "",
        minRating: selectedRating,
        inStock: inStock === "true" ? "true" : inStock === "false" ? "false" : "",
        search: searchQuery
      };

      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      // Build query string
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/api/products/filter?${queryParams}`);

      // Ensure we're passing an array to the parent component
      const filteredProducts = response.data.data;

      console.log(filteredProducts);
      // Call the parent component's callback with the filtered products
      if (onFiltersApplied) {
        onFiltersApplied(filteredProducts);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تطبيق الفلاتر");
      console.error("Filter error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="filters-sidebar bg-white p-3 rounded shadow-sm">
      <h5 className="fw-bold mb-3">تصفية المنتجات</h5>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {/* Search Filter */}
      <div className="mb-4">
        <label className="form-label fw-bold">البحث</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="form-label fw-bold">السعر</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
        />
        <div className="d-flex justify-content-between text-muted small">
          <span>0 ج.م</span>
          <span>{priceRange[1]} ج.م</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="form-label fw-bold">التقييم</label>
        <select
          className="form-select"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">الكل</option>
          <option value="5">5 نجوم</option>
          <option value="4">4 نجوم فأكثر</option>
          <option value="3">3 نجوم فأكثر</option>
          <option value="2">2 نجوم فأكثر</option>
          <option value="1">1 نجمة فأكثر</option>
        </select>
      </div>

      {/* Stock Status Filter */}
      <div className="mb-4">
        <label className="form-label fw-bold">حالة التوفر</label>
        <select
          className="form-select"
          value={inStock}
          onChange={(e) => setInStock(e.target.value)}
        >
          <option value="">الكل</option>
          <option value="true">متوفر</option>
          <option value="false">غير متوفر</option>
        </select>
      </div>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={handleApplyFilters}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            جاري التطبيق...
          </>
        ) : (
          "تطبيق الفلاتر"
        )}
      </button>
    </div>
  );
} 