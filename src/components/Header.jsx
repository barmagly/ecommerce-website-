import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/Slice/auth/auth";
import { getUserProfileThunk } from "../services/Slice/userProfile/userProfile";
import { getProductsThunk } from "../services/Slice/product/product";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "تواصل معنا", href: "/contact" },
  // { label: "من نحن", href: "/about" },
];

const authLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "طلباتي", href: "/orders" },
  { label: "تواصل معنا", href: "/contact" },
  // { label: "من نحن", href: "/about" },
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
  const { user: authUser, token } = useSelector((state) => state.auth);
  const { user: profileUser, loading, error } = useSelector((state) => state.userProfile);
  const isAuthenticated = !!token;
  const products = useSelector(state => state.product.products || []);
  const [suggestions, setSuggestions] = useState([]);

  // استخدام بيانات Google إذا كانت متوفرة، وإلا استخدم بيانات userProfile
  const currentUser = authUser || profileUser;

  // دالة مساعدة لبناء URL صورة البروفايل
  const getProfileImageUrl = (profileImg) => {
    if (!profileImg) return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";
    // إذا كانت صورة Google، استخدمها مباشرة
    if (profileImg.startsWith('https://lh3.googleusercontent.com')) {
      return profileImg;
    }
    if (profileImg.startsWith('http')) {
      return profileImg;
    }
    // إذا كان URL نسبي، أضف الـ base URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}${profileImg.startsWith('/') ? '' : '/'}${profileImg}`;
  };

  // جلب بيانات userProfile فقط إذا لم تكن بيانات Google متوفرة
  useEffect(() => {
    if (isAuthenticated && token && !authUser) {
      console.log('🔄 Fetching user profile...');
      dispatch(getUserProfileThunk());
    }
  }, [dispatch, isAuthenticated, token, authUser]);

  useEffect(() => {
    console.log('👤 Auth user data:', authUser);
    console.log('👤 Profile user data:', profileUser);
    console.log('👤 Current user data:', currentUser);
    console.log('🔄 Loading state:', loading);
    console.log('❌ Error state:', error);
    if (currentUser?.profileImg) {
      console.log('🖼️ Profile image URL:', getProfileImageUrl(currentUser.profileImg));
    }
  }, [authUser, profileUser, currentUser, loading, error]);

  useEffect(() => {
    if (search.trim()) {
      setSuggestions(
        products
          .filter(item => item.name && item.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  }, [search, products]);

  // جلب المنتجات عند أول تحميل إذا لم تكن موجودة
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProductsThunk());
    }
  }, [dispatch, products]);

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
            <img src="/images/logo.png" alt="Logo" className="header-logo" style={{ marginLeft: '8px', width: '280px', height: '250px' }} /> 
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
                {search && suggestions.length > 0 && (
                  <ul className="search-suggestions-list" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    left: 0,
                    zIndex: 1000,
                    background: '#fff',
                    border: '1px solid #eee',
                    borderTop: 'none',
                    borderRadius: '0 0 16px 16px',
                    boxShadow: '0 4px 16px #0001',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    maxHeight: 300,
                    overflowY: 'auto',
                    textAlign: 'right'
                  }}>
                    {suggestions.map(item => (
                      <li
                        key={item._id}
                        style={{ cursor: 'pointer', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
                        onMouseDown={() => navigate(`/product/${item._id}`)}
                      >
                        <img
                          src={item.images?.[0]?.url || item.imageCover || 'https://via.placeholder.com/40x40?text=No+Image'}
                          alt={item.name}
                          style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, marginLeft: 8 }}
                        />
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
              <div className="d-flex align-items-center gap-3">
                {isAuthenticated ? (
                  <>
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
                        title={currentUser?.name || "حسابي"}
                      >
                        {loading ? (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : currentUser?.profileImg ? (
                          <>
                            <img
                              src={getProfileImageUrl(currentUser.profileImg)}
                              alt={currentUser.name || "User"}
                              className="rounded-circle"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";
                              }}
                              onLoad={() => {
                                console.log("✅ Profile image loaded successfully:", getProfileImageUrl(currentUser.profileImg));
                              }}
                            />
                            <i className="fas fa-user" style={{ display: 'none' }}></i>
                          </>
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                          <div className="dropdown-item-text">
                            <small className="text-muted">مرحباً،</small>
                            <div className="fw-bold">{currentUser?.name || "المستخدم"}</div>
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
                <img src="/images/logo.png" alt="Logo" className="sidebar-logo" style={{ width: '250px', height: 'auto' }} />
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
                    ) : currentUser?.profileImg ? (
                      <img
                        src={getProfileImageUrl(currentUser.profileImg)}
                        alt={currentUser.name || "User"}
                        className="rounded-circle"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";
                        }}
                      />
                    ) : (
                      <div className="btn-icon">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div>
                      <small className="text-muted d-block">مرحباً،</small>
                      <div className="fw-bold">{currentUser?.name || "المستخدم"}</div>
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
        
        /* Enhanced Mobile Responsive Styles */
        @media (max-width: 991px) {
          .navbar {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          
          .custom-sidebar {
            width: 280px;
          }
          
          .navbar-brand img {
            height: 140px !important;
            width: 140px !important;
          }
          
          .search-form {
            min-width: 200px !important;
          }
        }
        
        @media (max-width: 768px) {
          .bg-gradient-primary .container {
            padding: 0.5rem 1rem;
          }
          
          .bg-gradient-primary span {
            font-size: 0.85rem;
            margin-left: 8px !important;
          }
          
          .bg-gradient-primary .btn {
            font-size: 0.8rem !important;
            padding: 0.25rem 0.75rem !important;
          }
          
          .navbar-brand img {
            height: 140px !important;
            width: 140px !important;
          }
          
          .custom-sidebar {
            width: 100%;
            max-width: 320px;
          }
          
          .search-form {
            min-width: 100% !important;
            margin-bottom: 1rem;
          }
          
          .search-input {
            border-radius: 25px;
            padding: 10px 40px 10px 15px;
            font-size: 0.9rem;
          }
          
          .btn-icon {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }
          
          .offcanvas-body {
            padding: 1rem;
          }
          
          .offcanvas-body .nav-link {
            padding: 0.75rem 0;
            font-size: 1rem;
            border-bottom: 1px solid #eee;
          }
          
          .offcanvas-body .btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
            border-radius: 8px;
          }
        }
        
        @media (max-width: 576px) {
          .bg-gradient-primary {
            padding: 0.5rem 0;
          }
          
          .bg-gradient-primary .row {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .bg-gradient-primary span {
            font-size: 0.8rem;
            margin-left: 0 !important;
            display: block;
            margin-bottom: 0.5rem;
          }
          
          .navbar-brand img {
            height: 90px !important;
            width: 90px !important;
          }
          
          .custom-sidebar {
            width: 100%;
            max-width: 300px;
          }
          
          .search-input {
            padding: 8px 35px 8px 12px;
            font-size: 0.85rem;
          }
          
          .btn-icon {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }
          
          .offcanvas-body {
            padding: 0.75rem;
          }
          
          .offcanvas-body .nav-link {
            padding: 0.6rem 0;
            font-size: 0.95rem;
          }
          
          .offcanvas-body .btn {
            padding: 0.6rem 0.75rem;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .navbar-brand img {
            height: 70px !important;
            width: 70px !important;
          }
          
          .search-input {
            padding: 6px 30px 6px 10px;
            font-size: 0.8rem;
          }
          
          .btn-icon {
            width: 30px;
            height: 30px;
            font-size: 0.75rem;
          }
          
          .offcanvas-body {
            padding: 0.5rem;
          }
          
          .offcanvas-body .nav-link {
            padding: 0.5rem 0;
            font-size: 0.9rem;
          }
          
          .offcanvas-body .btn {
            padding: 0.5rem 0.6rem;
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 360px) {
          .navbar-brand img {
            height: 60px !important;
            width: 60px !important;
          }
          
          .search-input {
            padding: 5px 25px 5px 8px;
            font-size: 0.75rem;
          }
          
          .btn-icon {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
        }
        
        .sidebar-logo {
          height: 120px;
          width: 120px;
          transition: height 0.3s, width 0.3s;
        }
        @media (max-width: 576px) {
          .sidebar-logo {
            height: 60px !important;
            width: 60px !important;
          }
        }
        .header-logo {
          height: 48px !important;
          width: auto !important;
          max-width: 180px !important;
          transition: height 0.3s, width 0.3s;
        }
        @media (max-width: 991px) {
          .header-logo {
            height: 44px !important;
            max-width: 140px !important;
          }
        }
        @media (max-width: 768px) {
          .header-logo {
            height: 40px !important;
            max-width: 120px !important;
          }
        }
        @media (max-width: 576px) {
          .header-logo {
            height: 36px !important;
            max-width: 90px !important;
          }
        }
        @media (max-width: 400px) {
          .header-logo {
            height: 28px !important;
            max-width: 60px !important;
          }
        }
      `}</style>
      <hr className="my-0" />
    </>
  );
} 