import React from "react";

export default function ContactHero() {
  return (
    <section className="contact-hero position-relative py-5">
      <div className="overlay position-absolute w-100 h-100" style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
        top: 0,
        left: 0,
        zIndex: 1
      }}></div>
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center text-center text-white">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-4">تواصل معنا</h1>
            <p className="lead mb-0">نحن هنا لمساعدتك. تواصل معنا بأي وسيلة تفضلها وسنكون سعداء بالرد عليك.</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .contact-hero {
          background: url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat;
          min-height: 300px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </section>
  );
} 