import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/Slice/auth/auth";
import { getUserProfileThunk } from "../services/Slice/userProfile/userProfile";
import { searchProductsThunk, clearSearchResults } from "../services/Slice/product/product";
import { getCategoriesThunk } from "../services/Slice/categorie/categorie";
import { FaPhoneAlt, FaFire, FaUser, FaBoxOpen, FaHeart, FaShoppingCart, FaSignInAlt, FaBolt, FaSignOutAlt, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import debounce from 'lodash.debounce';

// Custom styles for the new header
const headerStyles = `
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .top-bar {
    background: linear-gradient(-45deg, #4caf50, #8bc34a, #5a8b3e, #6ab344);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    color: white;
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  .promo-content {
    display: flex;
    align-items: center;
    gap: 20px;
    font-weight: 500;
  }
  .promo-button {
    background-color: white;
    color: black;
    padding: 8px 16px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s;
  }
  .promo-button:hover {
    transform: scale(1.05);
  }
  .top-bar-actions {
    display: flex;
    align-items: center;
    gap: 25px;
  }
  .top-bar-item {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .top-bar-item:hover {
    color: white;
    text-decoration: underline;
  }
  .top-bar-item.dropdown-toggle {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      color: inherit;
  }
  .amazon-header {
    background-color: #131921;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: transform 0.3s ease-in-out;
  }
  .amazon-header.hidden {
    transform: translateY(-100%);
  }
  .amazon-header-top, .amazon-header-bottom {
    display: flex;
    align-items: center;
    padding: 5px 10px;
  }
  .amazon-header-bottom {
    background-color: #232f3e;
    padding: 2px 10px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .amazon-header-bottom::-webkit-scrollbar {
    display: none;
  }
  .header-logo {
    padding: 5px;
    border: 1px solid transparent;
    border-radius: 3px;
    margin-right: 5px;
  }
  .header-logo:hover {
    border-color: white;
  }
  .header-logo img {
    width: 170px;
    height: 140px;
    margin-top: 5px;
  }
  .header-search {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  .suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .suggestion-item img {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }
  .suggestion-item:hover {
    background-color: #f3f3f3;
  }
  .header-search-select {
    background-color: #f3f3f3;
    border: none;
    padding: 10px 5px;
    font-size: 12px;
    font-weight: bold;
  }
  .header-search-input {
    border: none;
    flex-grow: 1;
    padding: 10px;
    color: #111;
  }
  .header-search-button {
    background-color: #febd69;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header-search-button:hover {
    background-color: #f3a847;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: 15px;
  }
  .header-actions .header-nav-item {
     font-size: 14px;
     color: white;
     text-decoration: none;
     display: flex;
     align-items: center;
     gap: 6px;
     padding: 8px;
     border-radius: 4px;
     border: 1px solid transparent;
  }
  .header-actions .header-nav-item:hover {
    border-color: white;
  }
  .header-nav {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
  .header-nav-item {
    padding: 10px;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    color: white;
    text-decoration: none;
  }
  .header-nav-item:hover {
    border-color: white;
  }
  .header-nav-item span {
    display: block;
    font-size: 12px;
    color: #ccc;
  }
  .header-nav-item-bold {
    font-weight: bold;
    color: white;
  }
  .header-cart {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
  }
  .header-cart .fa-shopping-cart {
    font-size: 24px;
    margin-right: 5px;
  }
  .header-bottom-links {
    display: flex;
    align-items: center;
    gap: 15px;
    white-space: nowrap;
  }
  .header-bottom-link {
    color: white;
    text-decoration: none;
    font-size: 14px;
    padding: 8px 10px;
    border: 1px solid transparent;
    border-radius: 3px;
  }
  .header-bottom-link:hover {
    border-color: white;
  }
  .hamburger-menu {
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
  .contact-info {
    font-size: 14px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .contact-info .fa-phone {
    margin-left: 5px;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(254, 189, 105, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(254, 189, 105, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(254, 189, 105, 0);
    }
  }
  .deals-link {
    animation: pulse 2s infinite;
    border-radius: 4px;
    background-color: #febd69;
    color: #131921 !important;
    font-weight: bold;
  }
  .dropdown-item-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
  .dropdown-item-logout:hover {
    background-color: #dc3545;
    color: white !important;
  }
  .header-social-icon {
    width: 38px !important;
    height: 38px !important;
    font-size: 20px !important;
  }
  @media (max-width: 600px) {
    .header-social-icon {
      width: 28px !important;
      height: 28px !important;
      font-size: 15px !important;
    }
    .header-logo img {
      width: 70px;
      height: auto;
    }
  }

  @media (max-width: 768px) {
    .top-bar {
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      text-align: center;
    }
    .amazon-header-top {
      flex-direction: column;
      align-items: center;
      padding: 5px;
    }
    .header-logo {
      order: 1;
      margin-bottom: 2px;
    }
    .header-logo img {
      width: 80px; 
      height: auto;
    }
    .header-actions {
      order: 2;
      margin-left: 0;
      margin-bottom: 10px;
      gap: 20px;
    }
    .header-search {
      order: 3;
      width: 85%;
      margin: 0;
    }
    .header-actions .header-nav-item span {
       font-size: 12px; 
    }
    .header-bottom-links {
      justify-content: center;
      padding: 8px 0;
    }
    .header-nav {
      display: none;
    }
  }
`;

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
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categorie);
  const isAuthenticated = !!token;
  const { searchResults, searchLoading } = useSelector(state => state.product);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      if (nextValue) {
        dispatch(searchProductsThunk(nextValue));
      }
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  // Control header visibility on scroll for mobile
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth <= 768) { // Only on mobile
          if (window.scrollY > lastScrollY && window.scrollY > 150) { // Scroll down
            setIsHeaderVisible(false);
          } else { // Scroll up
            setIsHeaderVisible(true);
          }
        } else {
            setIsHeaderVisible(true); // Always visible on desktop
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

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

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      dispatch(clearSearchResults());
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
    setShowSuggestions(false);
  };
  
  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion._id}`);
    setSearch('');
    setShowSuggestions(false);
    dispatch(clearSearchResults());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المتجر", href: "/shop" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  const socialLinks = [
    { href: 'https://www.facebook.com/profile.php?id=61577629474920', icon: <FaFacebookF />, label: 'Facebook', color: '#1877f3' },
    { href: 'https://www.instagram.com/mizanoomarket/', icon: <FaInstagram />, label: 'Instagram', color: '#E4405F' },
    { href: 'https://x.com/mizanooMarket', icon: <FaXTwitter />, label: 'X', color: '#000' },
    { href: 'https://www.tiktok.com/@mizanoomarket', icon: <FaTiktok />, label: 'TikTok', color: '#000' },
  ];

  return (
    <>
      <style>{headerStyles}</style>
      <style>{`
${headerStyles}
.amazon-header {
  position: relative;
  overflow: hidden;
  background: #232f3e;
}
.bubble, .square {
  position: absolute;
  opacity: 0.18;
  z-index: 1;
  pointer-events: none;
  animation-timing-function: linear;
}
.bubble {
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4caf50 60%, #8bc34a 100%);
  animation: bubbleMove 12s infinite;
}
.square {
  border-radius: 8px;
  background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
  animation: squareMove 16s infinite;
}
@keyframes bubbleMove {
  0% { top: 80%; left: 10%; transform: scale(0.7); }
  30% { top: 30%; left: 30%; transform: scale(1.1); }
  60% { top: 10%; left: 70%; transform: scale(0.9); }
  100% { top: 80%; left: 10%; transform: scale(0.7); }
}
@keyframes squareMove {
  0% { top: 10%; left: 80%; transform: rotate(0deg) scale(0.8); }
  40% { top: 60%; left: 60%; transform: rotate(30deg) scale(1.2); }
  70% { top: 40%; left: 20%; transform: rotate(-20deg) scale(1); }
  100% { top: 10%; left: 80%; transform: rotate(0deg) scale(0.8); }
}
.bubble2 {
  left: 60% !important; animation-delay: 3s; background: radial-gradient(circle at 60% 60%, #00bcd4 60%, #2196f3 100%); width: 90px; height: 90px; }
.square2 {
  left: 20% !important; animation-delay: 6s; background: linear-gradient(135deg, #e040fb 0%, #ff4081 100%); width: 60px; height: 60px; }
`}</style>
      <div className={`header-wrapper${!isHeaderVisible ? ' hidden' : ''}`}>
        <header className="amazon-header">
          {/* فقاعات ومربعات متحركة */}
          <span className="bubble" style={{ width: 120, height: 120 }}></span>
          <span className="bubble bubble2" style={{ width: 90, height: 90 }}></span>
          <span className="square" style={{ width: 70, height: 70 }}></span>
          <span className="square square2" style={{ width: 60, height: 60 }}></span>
          <div className="d-flex flex-column align-items-center w-100" style={{ position: 'relative' }}>
            <div className="d-flex align-items-center justify-content-center w-100" style={{ padding: '2px 0 0 0' }}>
              <Link className="header-logo" to="/">
                <img src="/images/logo.png" alt="Logo" style={{ width: 220, height: 100, objectFit: 'contain', margin: 0 }} />
          </Link>
              <button
                className="hamburger-menu"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 28, marginRight: 0, marginLeft: 8, cursor: 'pointer', position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setIsSidebarOpen(true)}
                aria-label="فتح القائمة الجانبية"
              >
                <i className="fas fa-bars"></i>
                </button>
              </div>
            <div className="w-100 d-flex justify-content-center" style={{ marginTop: 4 }}>
              <div className="header-search" style={{ width: '60%', minWidth: 180, maxWidth: 500}}>
                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                  <select className="header-search-select" defaultValue="" style={{ padding: '6px 5px', fontSize: 13 }}>
              <option value="" disabled>الكل</option>
              {categories && categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
                <input
              className="header-search-input" 
              type="text" 
              placeholder="ابحث في متجرنا"
                  value={search}
              onChange={handleSearchChange}
                    onFocus={() => { if (search) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(e); }}
                    style={{ padding: '6px', fontSize: 14 }}
            />
                  <button className="header-search-button" onClick={handleSearchSubmit} style={{ padding: '6px 10px', fontSize: 16 }}>
                  <i className="fas fa-search"></i>
                </button>
                </div>
            {showSuggestions && search.trim() && (
                  <div className="search-suggestions" style={{ zIndex: 3000, position: 'static', left: 0, right: 0, marginTop: 2, maxWidth: 500, width: '90vw', background: '#fff', border: '1px solid #ddd', borderTop: 'none', borderRadius: '0 0 4px 4px', color: '#111', maxHeight: 400, overflowY: 'auto', boxShadow: '0 8px 32px #0002', marginLeft: 'auto', marginRight: 'auto' }}>
                {searchLoading ? (
                  <div className="suggestion-item">جاري البحث...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <div 
                        key={item._id}
                      className="suggestion-item" 
                      onMouseDown={() => handleSuggestionClick(item)}
                    >
                          <img src={item.imageCover} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">لا توجد نتائج</div>
                )}
              </div>
            )}
          </div>
                    </div>
                  </div>
        </header>
        <div className="amazon-header-bottom" style={{ padding: '2px 10px', minHeight: 32 }}>
          <div className="header-bottom-links">
            <Link to="/shop" state={{ showDiscounted: true }} className="header-bottom-link deals-link">
              <FaFire style={{ marginLeft: '5px' }} />
              عروض اليوم
            </Link>
            {!categoriesLoading && categories && categories.slice(0, 8).map(cat => (
              <Link key={cat._id} to={`/shop?category=${cat.name}`} className="header-bottom-link">
                {cat.name}
                    </Link>
            ))}
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 2000 }} onClick={() => setIsSidebarOpen(false)}>
          <div
            className="sidebar-animated"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: 340,
              height: '100vh',
              background: 'linear-gradient(270deg, #4caf50, #8bc34a, #5a8b3e, #6ab344, #232f3e, #4caf50)',
              backgroundSize: '1200% 1200%',
              animation: 'gradientMove 18s ease infinite',
              color: '#fff',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
              zIndex: 2100,
              padding: '24px 18px 18px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              direction: 'rtl',
              justifyContent: 'space-between',
            }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`
              @keyframes gradientMove {
                0% {background-position: 0% 50%;}
                50% {background-position: 100% 50%;}
                100% {background-position: 0% 50%;}
              }
              .sidebar-animated {
                animation: sidebarSlideIn 0.5s cubic-bezier(.4,2,.3,1);
              }
              @keyframes sidebarSlideIn {
                0% { transform: translateX(100%); }
                100% { transform: translateX(0); }
              }
            `}</style>
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 28, position: 'absolute', top: 18, left: 18, right: 'auto', cursor: 'pointer' }}
              aria-label="إغلاق القائمة"
            >
              <i className="fas fa-times"></i>
            </button>
            <div style={{ marginTop: 40, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {/* السوشيال ميديا في الأعلى */}
              <div className="d-flex flex-row gap-3" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
                {socialLinks.map((item, idx) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    style={{ color: item.color, fontSize: 22, background: '#fff1', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
              {/* بيانات المستخدم */}
              {isAuthenticated && currentUser && (
                <>
                  <Link to="/profile" onClick={() => setIsSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, alignSelf: 'flex-end', textDecoration: 'none', marginBottom: 8 }}>
                    <img src={getProfileImageUrl(currentUser.profileImg)} alt="صورة الحساب" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>مرحباً، {currentUser.name}</span>
                  </Link>
                  {/* زر تسجيل الخروج أسفل اسم المستخدم */}
                  <button onClick={() => { setIsSidebarOpen(false); handleLogout(); }} style={{ margin: '0 0 8px 0', background: '#fff', color: '#c0392b', fontWeight: 'bold', border: 'none', borderRadius: 12, fontSize: 17, padding: '10px 0', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                    <FaSignOutAlt /> تسجيل الخروج
                  </button>
                </>
              )}
              {/* زر الدخول/تسجيل */}
              {!isAuthenticated && (
                <Link to="/login" className="top-bar-item" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setIsSidebarOpen(false)}>
                  <FaSignInAlt /> دخول / تسجيل
                </Link>
              )}
              {/* زر تسوق الآن */}
              <Link to="/shop" className="promo-button w-100 mb-2" style={{ background: '#fff', color: '#232f3e', fontWeight: 'bold', borderRadius: 16, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0' }} onClick={() => setIsSidebarOpen(false)}>
                <FaBolt /> تسوق الآن
              </Link>
              {/* عرض حصري */}
              <div className="fw-bold text-end" style={{ fontSize: 18, lineHeight: 1.6 }}>
                عرض حصري وتوصيل سريع - خصم حتى 50%!
              </div>
              {/* بيانات التواصل */}
              <div className="d-flex flex-row align-items-center gap-2 mb-2" style={{ justifyContent: 'flex-end' }}>
                <a href="tel:01092474959" className="contact-info top-bar-item" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaPhoneAlt />
                  <span>01092474959</span>
                </a>
              </div>
              {/* روابط الحساب والطلبات والسلة والمفضلة فقط إذا كان مسجل دخول */}
              {isAuthenticated && (
                <>
                  <div style={{ borderTop: '1px solid #fff2', margin: '16px 0' }}></div>
                  <Link to="/orders" className="d-flex align-items-center gap-2 sidebar-link" style={{ color: '#fff', fontSize: 18 }} onClick={() => setIsSidebarOpen(false)}>
                    <FaBoxOpen /> <span>طلباتي</span>
                  </Link>
                  <Link to="/wishlist" className="d-flex align-items-center gap-2 sidebar-link" style={{ color: '#fff', fontSize: 18 }} onClick={() => setIsSidebarOpen(false)}>
                    <FaHeart /> <span>المفضلة</span>
                  </Link>
                  <Link to="/cart" className="d-flex align-items-center gap-2 sidebar-link" style={{ color: '#fff', fontSize: 18 }} onClick={() => setIsSidebarOpen(false)}>
                    <FaShoppingCart /> <span>عربة التسوق</span>
                  </Link>
                </>
              )}
              <div style={{ borderTop: '1px solid #fff2', margin: '16px 0' }}></div>
            </div>
          </div>
        </div>
      )}
      <style>{`
${headerStyles}
.header-wrapper.hidden { display: none !important; }
@media (max-width: 700px) {
  .header-search { width: 90% !important; min-width: 0 !important; }
}
`}</style>
    </>
  );
} 