import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import MainSlider from '../components/MainSlider';
import FlashSalesSection from '../components/FlashSalesSection';
import Categories3DCircle from '../components/Categories3DCircle';
import BestSellersSection from '../components/BestSellersSection';
import ServiceFeaturesSection from '../components/ServiceFeaturesSection';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);
  return (
    <>
      <Header />
      <div className="home-bg-animated"></div>
      <div style={{direction: 'rtl'}}>
        <MainSlider data-aos="fade-up" />
        <FlashSalesSection data-aos="fade-up" />
        <Categories3DCircle data-aos="zoom-in-up" />
        <BestSellersSection data-aos="fade-up" />
        <ServiceFeaturesSection data-aos="fade-up" />
        <Footer />
      </div>
    </>
  );
}