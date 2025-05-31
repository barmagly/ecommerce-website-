import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import MapNagHamadi from "../components/MapNagHamadi";
import Breadcrumb from "../components/Breadcrumb";

const whatsappNumber = "20123456789"; // Replace with your WhatsApp number (no +)

export default function Contact() {
  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
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
        <MapNagHamadi />
      </div>
      {/* WhatsApp Floating Button */}
     
      <Footer />
      <style>{`
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
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .whatsapp-float:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.28);
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
} 