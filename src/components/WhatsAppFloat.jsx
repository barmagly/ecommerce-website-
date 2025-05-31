import React from "react";

const whatsappNumber = "20123456789"; // Replace with your WhatsApp number (no +)

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
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
          alt="WhatsApp"
          style={{ width: 38, height: 38, display: 'block' }}
        />
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
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .whatsapp-float:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.28);
          transform: scale(1.08);
        }
        @media (max-width: 600px) {
          .whatsapp-float {
            left: 16px;
            bottom: 16px;
            width: 52px;
            height: 52px;
          }
          .whatsapp-float img {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </>
  );
} 