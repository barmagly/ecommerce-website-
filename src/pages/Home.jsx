import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import MainSlider from '../components/MainSlider';
import FlashSalesSection from '../components/FlashSalesSection';
import Categories3DCircle from '../components/Categories3DCircle';
import BestSellersSection from '../components/BestSellersSection';
import ServiceFeaturesSection from '../components/ServiceFeaturesSection';
import DiscountedProductsSection from '../components/DiscountedProductsSection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

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
      </div>
    </>
  );
}