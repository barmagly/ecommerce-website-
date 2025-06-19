import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../services/Slice/product/product";

const sampleResults = [
  {
    id: 1,
    name: "شاشة LCD",
    price: 650,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png"
  },
  {
    id: 2,
    name: "حقيبة Gucci",
    price: 960,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png"
  },
  {
    id: 3,
    name: "ذراع ألعاب GP11 Shooter",
    price: 550,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png"
  }
];

export default function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const products = useSelector(state => state.product.products || []);
  const dispatch = useDispatch();

  // جلب المنتجات عند أول تحميل إذا لم تكن موجودة
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProductsThunk());
    }
  }, [dispatch, products]);

  useEffect(() => {
    setQuery(q);
    if (q.trim()) {
      setResults(
        products.filter(item =>
          item.name && item.name.toLowerCase().includes(q.toLowerCase())
        )
      );
    } else {
      setResults(products);
    }
  }, [q, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    // البحث يتم تلقائياً عند تغيير q في الرابط
  };

  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <div className="container py-5">
        <Breadcrumb items={[
          { label: "نتائج البحث", to: "/search" }
        ]} />
        <h2 className="fw-bold mb-4" data-aos="fade-up">نتائج البحث</h2>
        <form className="d-flex mb-5 search-form" role="search" onSubmit={handleSearch} style={{maxWidth: 400, margin: '0 auto'}}>
          <button className="btn btn-light border-end-0 rounded-end-4" type="submit" style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
            <i className="fas fa-search"></i>
          </button>
          <input
            className="form-control border-start-0 rounded-start-4"
            type="search"
            placeholder="ابحث عن منتج..."
            aria-label="بحث"
            style={{textAlign: 'right', borderRight: 'none'}}
            value={query}
            onChange={e => setQuery(e.target.value)}
            readOnly
          />
        </form>
        <div className="row g-4">
          {results.length === 0 ? (
            <div className="col-12 text-center">لا توجد نتائج مطابقة</div>
          ) : results.map(item => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id} data-aos="fade-up">
              <div className="card h-100 shadow-sm border-0">
                <img src={item.images?.[0]?.url || item.imageCover || "https://via.placeholder.com/300x200?text=No+Image"} alt={item.name} className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title fw-bold mb-2 text-center">{item.name}</h5>
                  <span className="text-danger fw-bold mb-3">{item.price} ج.م</span>
                  <button className="btn btn-dark w-100 mt-auto">
                    <i className="fas fa-shopping-cart ms-2"></i>أضف إلى السلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 