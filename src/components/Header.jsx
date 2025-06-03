import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "من نحن", href: "/about" },
  { label: "تسجيل", href: "/signup" },
];

function isActive(href) {
  if (href === "/") {
    return window.location.pathname === "/";
  }
  return window.location.pathname.startsWith(href);
}

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    } else {
      navigate('/search');
    }
  };

  const handleSearchIcon = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <>
      {/* شريط الإعلان العلوي */}
      <div className="bg-gradient-primary py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <span className="text-white me-3" style={{marginLeft: '12px'}}>
                عروض حصرية على جميع المنتجات وتوصيل سريع مجاني - خصم حتى 50%!
              </span>
              <a href="/shop" className="btn btn-light fw-bold px-4 py-1 ms-2" style={{fontSize:'1rem'}}>
                تسوق الآن
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav className="navbar navbar-expand-lg navbar-light py-3 shadow-sm sticky-top bg-white">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/images/logo.png" alt="Logo" style={{height: '110px', width: '110px', marginLeft: '8px'}} />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between" id="navbarNav">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
              {navLinks.map(link => (
                <li key={link.href} className="nav-item">
                  <a
                    className={`nav-link fw-bold nav-link-hover${isActive(link.href) ? " active text-danger" : ""}`}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Enhanced Search and Action Buttons */}
            <div className="d-flex align-items-center gap-3 ms-3">
              <form className="d-flex search-form position-relative" role="search" style={{minWidth: 260}} onSubmit={handleSearch}>
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="ماذا تبحث عن؟"
                  aria-label="بحث"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  className="btn search-btn"
                  type="button"
                  onClick={handleSearchIcon}
                  tabIndex={0}
                >
                  <i className="fas fa-search"></i>
                </button>
              </form>
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/notifications')}
                  title="الإشعارات"
                >
                  <i className="fas fa-bell"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/cart')}
                  title="سلة المشتريات"
                >
                  <i className="fas fa-shopping-cart"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/wishlist')}
                  title="المفضلة"
                >
                  <i className="fas fa-heart"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/profile')}
                  title="حسابي"
                >
                  <i className="fas fa-user"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Offcanvas Sidebar for Mobile */}
          <div className="offcanvas offcanvas-end d-lg-none custom-sidebar" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <img src="/images/logo.png" alt="Logo" style={{height: '90px', width: '90px'}} />
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <form className="d-flex mb-3 position-relative" role="search" onSubmit={handleSearch}>
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="ماذا تبحث عن؟"
                  aria-label="بحث"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  className="btn search-btn"
                  type="button"
                  onClick={handleSearchIcon}
                  tabIndex={0}
                >
                  <i className="fas fa-search"></i>
                </button>
              </form>
              <ul className="navbar-nav mb-4">
                {navLinks.map(link => (
                  <li key={link.href} className="nav-item">
                    <a
                      className={`nav-link fw-bold py-3 border-bottom${isActive(link.href) ? " active text-danger" : ""}`}
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/notifications')}
                  title="الإشعارات"
                >
                  <i className="fas fa-bell"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/cart')}
                  title="سلة المشتريات"
                >
                  <i className="fas fa-shopping-cart"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/wishlist')}
                  title="المفضلة"
                >
                  <i className="fas fa-heart"></i>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => navigate('/profile')}
                  title="حسابي"
                >
                  <i className="fas fa-user"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(45deg, #1e88e5, #1976d2);
        }
        
        .nav-link-hover {
          position: relative;
          transition: color 0.3s;
        }
        
        .nav-link-hover:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #dc3545;
          transition: width 0.3s;
        }
        
        .nav-link-hover:hover:after {
          width: 100%;
        }
        
        .search-form {
          position: relative;
        }
        
        .search-input {
          border-radius: 50px;
          padding-right: 45px;
          padding-left: 20px;
          border: 2px solid #eee;
          transition: all 0.3s;
        }
        
        .search-input:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        .search-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: #666;
          transition: color 0.3s;
        }
        
        .search-btn:hover {
          color: #dc3545;
        }
        
        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          border: none;
          position: relative;
        }
        
        .btn-icon:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }
        
        .custom-sidebar {
          width: 300px;
          border-right: none;
        }
        
        .custom-sidebar .offcanvas-header {
          background: #f8f9fa;
        }
        
        .custom-sidebar .nav-link {
          transition: all 0.3s;
        }
        
        .custom-sidebar .nav-link:hover {
          background: #f8f9fa;
          padding-right: 1.5rem;
        }
        
        @media (max-width: 991px) {
          .navbar {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          
          .custom-sidebar {
            width: 280px;
          }
        }
      `}</style>
      <hr className="my-0" />
    </>
  );
} 