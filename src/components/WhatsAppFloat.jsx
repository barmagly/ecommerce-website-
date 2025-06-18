import React from "react";

const whatsappNumber = "201092474959"; // Replace with your WhatsApp number (no +)

export default function WhatsAppFloat() {
  return (
    <>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="تواصل معنا على واتساب"
        aria-label="تواصل معنا على واتساب"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
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
          transition: all 0.3s ease;
          text-decoration: none;
          color: white;
          font-size: 32px;
        }
        .whatsapp-float:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.28);
          transform: scale(1.1);
          color: white;
          text-decoration: none;
        }
        .whatsapp-float:active {
          transform: scale(0.95);
        }
        @media (max-width: 600px) {
          .whatsapp-float {
            left: 16px;
            bottom: 16px;
            width: 56px;
            height: 56px;
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
} 