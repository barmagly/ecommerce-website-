import React, { useEffect, lazy, Suspense } from 'react';
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
    <>
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
    </>
  );
}