import React, { useState } from "react";

export default function ShopFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedOffers, setSelectedOffers] = useState([]);

  const colors = [
    { id: "red", name: "أحمر", code: "#DB4444" },
    { id: "green", name: "أخضر", code: "#25D366" },
    { id: "blue", name: "أزرق", code: "#007bff" },
    { id: "black", name: "أسود", code: "#000000" },
    { id: "white", name: "أبيض", code: "#ffffff" }
  ];

  const brands = [
    "الكل",
    "Gucci",
    "ASUS",
    "HAVIT",
    "Samsung",
    "Apple",
    "Nike",
    "Adidas"
  ];

  const offers = [
    { id: "discount", name: "خصومات" },
    { id: "new", name: "منتجات جديدة" },
    { id: "bestseller", name: "الأكثر مبيعاً" }
  ];

  const handleColorToggle = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleOfferToggle = (offerId) => {
    setSelectedOffers(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleApplyFilters = () => {
    // هنا يمكن إضافة منطق تطبيق الفلاتر
    console.log({
      priceRange,
      selectedColors,
      selectedGender,
      selectedBrand,
      selectedRating,
      selectedAvailability,
      selectedOffers
    });
  };

  return (
    <div className="mb-4" data-aos="fade-left">
      <h5 className="fw-bold mb-3">تصفية المنتجات</h5>
      
      {/* فلتر السعر */}
      <div className="mb-4">
        <label className="form-label fw-bold">السعر</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="2000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
        />
        <div className="d-flex justify-content-between">
          <span>0 ج.م</span>
          <span>{priceRange[1]} ج.م</span>
        </div>
      </div>

      {/* فلتر النوع */}
      <div className="mb-4">
        <label className="form-label fw-bold">النوع</label>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${selectedGender === "men" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setSelectedGender(selectedGender === "men" ? "" : "men")}
          >
            رجالي
          </button>
          <button
            className={`btn btn-sm ${selectedGender === "women" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setSelectedGender(selectedGender === "women" ? "" : "women")}
          >
            نسائي
          </button>
          <button
            className={`btn btn-sm ${selectedGender === "kids" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setSelectedGender(selectedGender === "kids" ? "" : "kids")}
          >
            أطفال
          </button>
        </div>
      </div>

      {/* فلتر الألوان */}
      <div className="mb-4">
        <label className="form-label fw-bold">اللون</label>
        <div className="d-flex gap-2 flex-wrap">
          {colors.map(color => (
            <button
              key={color.id}
              className="color-btn"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid #eee',
                background: color.code,
                boxShadow: selectedColors.includes(color.id) ? '0 0 0 2px #DB4444' : 'none'
              }}
              onClick={() => handleColorToggle(color.id)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* فلتر الماركة */}
      <div className="mb-4">
        <label className="form-label fw-bold">الماركة</label>
        <select
          className="form-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* فلتر التقييم */}
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

      {/* فلتر التوفر */}
      <div className="mb-4">
        <label className="form-label fw-bold">التوفر</label>
        <select
          className="form-select"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
        >
          <option value="">الكل</option>
          <option value="in-stock">متوفر</option>
          <option value="out-of-stock">غير متوفر</option>
          <option value="pre-order">طلب مسبق</option>
        </select>
      </div>

      {/* فلتر العروض */}
      <div className="mb-4">
        <label className="form-label fw-bold">العروض</label>
        <div className="d-flex flex-column gap-2">
          {offers.map(offer => (
            <div key={offer.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={offer.id}
                checked={selectedOffers.includes(offer.id)}
                onChange={() => handleOfferToggle(offer.id)}
              />
              <label className="form-check-label" htmlFor={offer.id}>
                {offer.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={handleApplyFilters}
      >
        تطبيق الفلاتر
      </button>

      <style jsx>{`
        .color-btn {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .color-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
} 