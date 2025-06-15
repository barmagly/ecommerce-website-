import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import MapNagHamadi from "../components/MapNagHamadi";
import Breadcrumb from "../components/Breadcrumb";
import { FaWhatsapp } from 'react-icons/fa';

const whatsappNumber = "20123456789"; // Replace with your WhatsApp number (no +)

export default function Contact() {
  return (
    <div className="bg-light" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <Breadcrumb items={[
        { label: "تواصل معنا", to: "/contact" }
      ]} />
      <ContactHero />
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <ContactInfo />
          </div>
          <div className="col-lg-8">
            <ContactForm />
          </div>
        </div>
        
        <div className="mt-5">
          <MapNagHamadi />
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="تواصل معنا عبر واتساب"
      >
        <FaWhatsapp size={32} color="white" />
      </a>
      
      <Footer />

      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          left: 32px;
          bottom: 32px;
          z-index: 9999;
          background: #25D366;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .whatsapp-float:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.4);
        }
      `}</style>
    </div>
  );
} 