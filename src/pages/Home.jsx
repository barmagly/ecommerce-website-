import React, { useEffect, lazy, Suspense } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import MainSlider from '../components/MainSlider';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DiscountedProductsSection = lazy(() => import('../components/DiscountedProductsSection'));
const FlashSalesSection = lazy(() => import('../components/FlashSalesSection'));
const Categories3DCircle = lazy(() => import('../components/Categories3DCircle'));
const BestSellersSection = lazy(() => import('../components/BestSellersSection'));
const ServiceFeaturesSection = lazy(() => import('../components/ServiceFeaturesSection'));
const Footer = lazy(() => import("../components/Footer"));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Loading...</p>
  </div>
);

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
    <div className="home-page">
      <SEO
        title="Homepage - Your E-Commerce Site"
        description="Welcome to our e-commerce site. Find the best products at the best prices."
        name="Your E-Commerce Site"
        type="website" />
      <Header />
      <div className="home-bg-animated"></div>
      <div style={{ direction: 'rtl' }}>
        <MainSlider data-aos="fade-up" />
        <Suspense fallback={<Loader />}>
          <DiscountedProductsSection />

          <div className="section-spacer"></div>
          <FlashSalesSection data-aos="fade-up" />

          <div className="section-spacer"></div>
          <Categories3DCircle data-aos="zoom-in-up" />

          <div className="section-spacer"></div>
          <BestSellersSection data-aos="fade-up" />

          <div className="section-spacer"></div>
          <ServiceFeaturesSection data-aos="fade-up" />

          <Footer />
        </Suspense>
      </div>
    </div>
  );
}