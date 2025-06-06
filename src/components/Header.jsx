import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/Slice/auth/auth";
import { getUserProfileThunk } from "../services/Slice/userProfile/userProfile";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "من نحن", href: "/about" },
];

const authLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "طلباتي", href: "/orders" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "من نحن", href: "/about" },
];

function isActive(href) {
  if (href === "/") {
    return window.location.pathname === "/";
  }
  return window.location.pathname.startsWith(href);
}

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  const { user: profileUser, loading, error } = useSelector((state) => state.userProfile);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfileThunk());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
  }, [profileUser, loading, error]);


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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* شريط الإعلان العلوي */}
      <div className="bg-gradient-primary py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <span className="text-white me-3" style={{ marginLeft: '12px' }}>
                عروض حصرية على جميع المنتجات وتوصيل سريع مجاني - خصم حتى 50%!
              </span>
              <Link to="/shop" className="btn btn-light fw-bold px-4 py-1 ms-2" style={{ fontSize: '1rem' }}>
                تسوق الآن
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav className="navbar navbar-expand-lg navbar-light py-3 shadow-sm sticky-top bg-white">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/images/logo.png" alt="Logo" style={{ height: '110px', width: '110px', marginLeft: '8px' }} />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between" id="navbarNav">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
              {(isAuthenticated ? authLinks : navLinks).map(link => (
                <li key={link.href} className="nav-item">
                  <Link
                    className={`nav-link fw-bold nav-link-hover${isActive(link.href) ? " active text-danger" : ""}`}
                    to={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Enhanced Search and Action Buttons */}
            <div className="d-flex align-items-center gap-3 ms-3">
              <form className="d-flex search-form position-relative" role="search" style={{ minWidth: 260 }} onSubmit={handleSearch}>
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
                {isAuthenticated ? (
                  <>
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
                    <div className="dropdown">
                      <button
                        className="btn btn-icon"
                        type="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title={profileUser?.name || "حسابي"}
                      >
                        {loading ? (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : profileUser?.profileImg ? (
                          <img
                            src={profileUser.profileImg}
                            alt={profileUser.name || "User"}
                            className="rounded-circle"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              console.error("Error loading profile image");
                              e.target.onerror = null;
                              e.target.src = "/images/default-avatar.png";
                            }}
                          />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                          <div className="dropdown-item-text">
                            <small className="text-muted">مرحباً،</small>
                            <div className="fw-bold">{profileUser?.name || "المستخدم"}</div>
                          </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/profile">حسابي</Link></li>
                        <li><Link className="dropdown-item" to="/orders">طلباتي</Link></li>
                        <li><Link className="dropdown-item" to="/wishlist">المفضلة</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}>تسجيل الخروج</button></li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => navigate('/login')}
                    >
                      تسجيل الدخول
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => navigate('/signup')}
                    >
                      إنشاء حساب
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Offcanvas Sidebar for Mobile */}
          <div className="offcanvas offcanvas-end d-lg-none custom-sidebar" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <img src="/images/logo.png" alt="Logo" style={{ height: '90px', width: '90px' }} />
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              {isAuthenticated && (
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="d-flex align-items-center gap-3">
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : profileUser?.profileImg ? (
                      <img
                        src={profileUser.profileImg}
                        alt={profileUser.name || "User"}
                        className="rounded-circle"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.error("Error loading profile image");
                          e.target.onerror = null;
                          e.target.src = "/images/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="btn-icon">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div>
                      <small className="text-muted d-block">مرحباً،</small>
                      <div className="fw-bold">{profileUser?.name || "المستخدم"}</div>
                    </div>
                  </div>
                </div>
              )}
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
                {(isAuthenticated ? authLinks : navLinks).map(link => (
                  <li key={link.href} className="nav-item">
                    <Link
                      className={`nav-link fw-bold py-3 border-bottom${isActive(link.href) ? " active text-danger" : ""}`}
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {isAuthenticated ? (
                <div className="d-flex flex-column gap-2">
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
                  </div>
                  <div className="d-flex flex-column gap-2 mt-2">
                    <Link to="/profile" className="btn btn-outline-dark">حسابي</Link>
                    <Link to="/orders" className="btn btn-outline-dark">طلباتي</Link>
                    <button onClick={handleLogout} className="btn btn-danger">تسجيل الخروج</button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => navigate('/login')}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => navigate('/signup')}
                  >
                    إنشاء حساب
                  </button>
                </div>
              )}
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
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border-radius: 0.5rem;
        }
        
        .dropdown-item {
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .dropdown-item-text {
          padding: 0.5rem 1rem;
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