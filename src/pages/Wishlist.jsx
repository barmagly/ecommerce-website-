import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

const initialWishlist = [
  {
    id: 1,
    name: "حقيبة Gucci",
    price: 960,
    oldPrice: 1160,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png"
  },
  {
    id: 2,
    name: "مبرد معالج RGB",
    price: 1960,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/nbcqhaq2_expires_30_days.png"
  },
  {
    id: 3,
    name: "ذراع ألعاب GP11 Shooter",
    price: 550,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png"
  },
  {
    id: 4,
    name: "جاكيت ساتان مبطن",
    price: 750,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png"
  }
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleAddToCart = (id) => {
    alert("تمت إضافة المنتج إلى السلة!");
  };

  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <div className="container py-5">
        <Breadcrumb items={[
          { label: "المفضلة", to: "/wishlist" }
        ]} />
        <h2 className="fw-bold mb-4" data-aos="fade-up">المفضلة</h2>
        <div className="row g-4">
          {wishlist.length === 0 ? (
            <div className="col-12 text-center">قائمة المفضلة فارغة</div>
          ) : wishlist.map(item => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={item.id} data-aos="fade-up">
              <div className="card h-100 shadow-sm border-0">
                <img src={item.image} alt={item.name} className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title fw-bold mb-2 text-center">{item.name}</h5>
                  <div className="mb-3">
                    <span className="text-danger fw-bold ms-2">{item.price} ج.م</span>
                    {item.oldPrice && <span className="text-muted text-decoration-line-through">{item.oldPrice} ج.م</span>}
                  </div>
                  <div className="d-flex gap-2 w-100 justify-content-center">
                    <button className="btn btn-dark flex-fill" onClick={() => handleAddToCart(item.id)}>
                      <i className="fas fa-shopping-cart ms-2"></i>أضف إلى السلة
                    </button>
                    <button className="btn btn-outline-danger flex-fill" onClick={() => handleRemove(item.id)} title="حذف من المفضلة">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Recommendations Section */}
        <div className="mt-5" data-aos="fade-up">
          <h4 className="fw-bold mb-4">منتجات مقترحة لك</h4>
          <div className="row g-4">
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/9ame2m8t_expires_30_days.png" alt="منتج مقترح" className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">لاب توب ألعاب ASUS FHD</h6>
                  <span className="text-danger fw-bold">960 ج.م</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/jbwbttnu_expires_30_days.png" alt="منتج مقترح" className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">شاشة ألعاب IPS LCD</h6>
                  <span className="text-danger fw-bold">1160 ج.م</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/1k62ml59_expires_30_days.png" alt="منتج مقترح" className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                <div className="card-body text-center">
                  <h6 className="fw-bold mb-2">ذراع ألعاب HAVIT HV-G92</h6>
                  <span className="text-danger fw-bold">560 ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 