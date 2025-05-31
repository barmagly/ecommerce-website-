import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Error404() {
  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <div className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="text-center" style={{marginTop: '60px'}}>
          <h1 className="fw-bold" style={{fontSize: '110px', color: '#DB4444'}}>404</h1>
          <h2 className="fw-bold mb-4" style={{fontSize: '32px'}}>الصفحة غير موجودة</h2>
          <p className="mb-4" style={{fontSize: '18px'}}>عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية.</p>
          <a href="/" className="btn btn-danger px-5 py-3 fw-bold" style={{fontSize: '20px'}}>العودة للصفحة الرئيسية</a>
        </div>
      </div>
      <Footer />
    </div>
  );
} 