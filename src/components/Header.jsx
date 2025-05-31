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
      <div className="bg-black py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <span className="text-white me-3" style={{marginLeft: '12px'}}>
                عروض حصرية على جميع المنتجات وتوصيل سريع مجاني - خصم حتى 50%!
              </span>
              <a href="/shop" className="btn btn-warning fw-bold px-4 py-1 ms-2" style={{fontSize:'1rem'}}>
                تسوق الآن
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav className="navbar navbar-expand-lg bg-white py-3">
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
                    className={`nav-link fw-bold${isActive(link.href) ? " active text-danger" : ""}`}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Enhanced Search and Action Buttons */}
            <div className="d-flex align-items-center gap-2 ms-3">
              <form className="d-flex search-form" role="search" style={{minWidth: 260}} onSubmit={handleSearch}>
                <button
                  className="btn btn-light border-end-0 rounded-end-4"
                  type="button"
                  style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                  onClick={handleSearchIcon}
                  tabIndex={0}
                >
                  <i className="fas fa-search"></i>
                </button>
                <input
                  className="form-control border-start-0 rounded-start-4"
                  type="search"
                  placeholder="ماذا تبحث عن؟"
                  aria-label="بحث"
                  style={{textAlign: 'right', borderRight: 'none'}}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </form>
              <button
                className="btn btn-danger d-flex align-items-center justify-content-center icon-btn"
                style={{borderRadius: '50%', width: 44, height: 44, marginRight: 8}}
                onClick={() => navigate('/cart')}
                title="سلة المشتريات"
              >
                <i className="fas fa-shopping-cart fa-lg"></i>
              </button>
              <button
                className="btn btn-danger d-flex align-items-center justify-content-center icon-btn"
                style={{borderRadius: '50%', width: 44, height: 44}}
                onClick={() => navigate('/wishlist')}
                title="المفضلة"
              >
                <i className="fas fa-heart fa-lg"></i>
              </button>
            </div>
          </div>

          {/* Offcanvas Sidebar for Mobile */}
          <div className="offcanvas offcanvas-end d-lg-none" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <img src="/images/logo.png" alt="Logo" style={{height: '120px', width: '120px', marginLeft: '10px'}} />
              </h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav mb-2 mb-lg-0 gap-3">
                {navLinks.map(link => (
                  <li key={link.href} className="nav-item">
                    <a
                      className={`nav-link fw-bold${isActive(link.href) ? " active text-danger" : ""}`}
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <form className="d-flex mt-3 search-form" role="search" onSubmit={handleSearch}>
                <button
                  className="btn btn-light border-end-0 rounded-end-4"
                  type="button"
                  style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                  onClick={handleSearchIcon}
                  tabIndex={0}
                >
                  <i className="fas fa-search"></i>
                </button>
                <input
                  className="form-control border-start-0 rounded-start-4"
                  type="search"
                  placeholder="ماذا تبحث عن؟"
                  aria-label="بحث"
                  style={{textAlign: 'right', borderRight: 'none'}}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </form>
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center icon-btn"
                  style={{borderRadius: '50%', width: 44, height: 44, marginRight: 8}}
                  onClick={() => navigate('/cart')}
                  title="سلة المشتريات"
                >
                  <i className="fas fa-shopping-cart fa-lg"></i>
                </button>
                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center icon-btn"
                  style={{borderRadius: '50%', width: 44, height: 44}}
                  onClick={() => navigate('/wishlist')}
                  title="المفضلة"
                >
                  <i className="fas fa-heart fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <style>{`
        .icon-btn {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .icon-btn:hover {
          box-shadow: 0 4px 16px #db444455;
          transform: scale(1.08);
        }
      `}</style>
      <hr className="my-4" />
    </>
  );
} 