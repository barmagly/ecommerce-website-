import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import MainSlider from '../components/MainSlider';
import FlashSalesSection from '../components/FlashSalesSection';
import Categories3DCircle from '../components/Categories3DCircle';
import BestSellersSection from '../components/BestSellersSection';
import ServiceFeaturesSection from '../components/ServiceFeaturesSection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function DiscountedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products?discounted=true')
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(() => setError('حدث خطأ أثناء جلب المنتجات المخفضة'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">جاري التحميل...</span></div></div>;
  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger">{error}</div></div>;
  if (!products.length) return null;

  return (
    <div className="container py-5" data-aos="fade-up">
      <div className="d-flex align-items-center gap-3 mb-4">
        <i className="fas fa-tags fa-2x text-danger"></i>
        <h2 className="fw-bold mb-0 text-danger">عروض وخصومات</h2>
      </div>
      <div className="row g-4">
        {products.map(product => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product._id}>
            <div className="card h-100 shadow-sm border-0 position-relative">
              {product.discount && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-2" style={{zIndex:2}}>
                  خصم {product.discount}%
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-2" style={{zIndex:2}}>
                  خصم {Math.round(100 - (product.price / product.originalPrice) * 100)}%
                </span>
              )}
              <a href={`/product/${product._id}`} style={{textDecoration:'none'}}>
                <img src={product.imageCover || product.images?.[0]?.url || '/images/Placeholder.png'} alt={product.name} className="card-img-top p-3" style={{height:180,objectFit:'contain'}} />
                <div className="card-body text-center">
                  <h6 className="card-title fw-bold mb-2">{product.name}</h6>
                  <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                    <span className="text-danger fw-bold fs-5">{product.price} ج.م</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-muted text-decoration-line-through">{product.originalPrice} ج.م</span>
                    )}
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true,
      offset: 100,
      easing: 'ease-in-out'
    });
  }, []);
  
  return (
    <>
      <Header />
      <div className="home-bg-animated"></div>
      <div style={{direction: 'rtl'}}>
        <MainSlider data-aos="fade-up" />
        
        <div className="section-spacer"></div>
        <FlashSalesSection data-aos="fade-up" />
        
        <div className="section-spacer"></div>
        <DiscountedProductsSection />
        
        <div className="section-spacer"></div>
        <Categories3DCircle data-aos="zoom-in-up" />
        
        <div className="section-spacer"></div>
        <BestSellersSection data-aos="fade-up" />
        
        <div className="section-spacer"></div>
        <ServiceFeaturesSection data-aos="fade-up" />
        
        <Footer />
      </div>
    </>
  );
}