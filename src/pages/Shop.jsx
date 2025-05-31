import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopFilters from "../components/ShopFilters";
import ShopCategories from "../components/ShopCategories";
import ShopProducts from "../components/ShopProducts";
import Breadcrumb from "../components/Breadcrumb";

export default function Shop() {
  return (
    <>
      <Header />
      <div className="shop-page bg-light py-4">
        <div className="container">
          <Breadcrumb items={[{ label: "المتجر", to: "/shop" }]} />
          {/* فلاتر أفقية */}
          <div className="d-flex flex-wrap gap-2 align-items-center bg-white p-3 rounded shadow-sm mb-4">
            <span className="fw-bold">ترتيب حسب:</span>
            <button className="btn btn-outline-dark btn-sm">الأحدث</button>
            <button className="btn btn-outline-dark btn-sm">الأكثر مبيعًا</button>
            <button className="btn btn-outline-dark btn-sm">الأعلى تقييمًا</button>
            <button className="btn btn-outline-dark btn-sm">السعر: من الأقل للأعلى</button>
            <button className="btn btn-outline-dark btn-sm">السعر: من الأعلى للأقل</button>
          </div>
          <div className="row">
            {/* أقسام وفلاتر جانبية */}
            <div className="col-lg-3 mb-4">
              <ShopCategories />
              <ShopFilters />
            </div>
            {/* شبكة المنتجات */}
            <div className="col-lg-9">
              <ShopProducts />
            </div>
          </div>
        </div>
        <style>{`
          .shop-page {
            min-height: 100vh;
          }
          .shop-page .breadcrumb {
            background: #fff;
            border-radius: 10px;
            margin-bottom: 24px;
          }
          .shop-page .row > .col-lg-3 {
            border-left: 1.5px solid #eee;
          }
          @media (max-width: 991px) {
            .shop-page .row > .col-lg-3 {
              border-left: none;
              border-bottom: 1.5px solid #eee;
              margin-bottom: 24px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
} 