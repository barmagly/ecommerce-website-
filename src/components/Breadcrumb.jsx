import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <div style={{background: "#f8f9fa", borderRadius: 8, border: "1px solid #eee", padding: "12px 20px", display: "inline-block", minWidth: 220}}>
        <ol className="breadcrumb mb-0 align-items-center" style={{background: "transparent", fontSize: "1.1rem", marginBottom: 0, display: "flex", flexWrap: "wrap"}}>
          <li className="breadcrumb-item d-flex align-items-center" style={{marginLeft: 0}}>
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <i className="fas fa-home me-1" style={{color: "#DB4444", fontSize: "1.2em"}}></i>
              <span className="ms-1">الرئيسية</span>
            </Link>
          </li>
          {items.map((item, idx) => (
            <React.Fragment key={item.to}>
              <li className="breadcrumb-separator mx-2" style={{color: '#888', fontSize: '1em'}}>
                <i className="fas fa-angle-left"></i>
              </li>
              {idx < items.length - 1 ? (
                <li className="breadcrumb-item d-flex align-items-center">
                  <Link to={item.to} className="text-decoration-none">{item.label}</Link>
                </li>
              ) : (
                <li className="breadcrumb-item active text-danger d-flex align-items-center" aria-current="page">
                  {item.label}
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
} 