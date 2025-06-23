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
    align-items: center;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  .search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    z-index: 1000;
    color: #111;
    max-height: 400px;
    overflow-y: auto;
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
      margin-bottom: 5px;
    }
    .header-logo img {
      width: 130px; 
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
    navigate(`/product/${suggestion.slug}`);
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
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {socialLinks.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="header-social-icon"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: '50%', background: '#fff', color: item.color,
                fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: `2px solid ${item.color}`,
                margin: '0 2px', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              {item.icon}
            </a>
          ))}
        </div>
        <div className="promo-content">
          <span>عرض حصري وتوصيل سريع - خصم حتى 50%!</span>
          <Link to="/shop" className="promo-button">
            <FaBolt />
            تسوق الآن
          </Link>
        </div>
        <div className="top-bar-actions">
          <a href="tel:01092474959" className="contact-info top-bar-item">
            <FaPhoneAlt />
            <span>01092474959</span>
          </a>
          <div className="dropdown" ref={dropdownRef}>
            {isAuthenticated ? (
              <button
                type="button"
                className="top-bar-item dropdown-toggle"
                onClick={() => setIsDropdownOpen(o => !o)}
              >
                <FaUser />
                <span>مرحباً, {currentUser?.name}</span>
              </button>
            ) : (
              <Link to="/login" className="top-bar-item">
                <FaSignInAlt />
                <span>دخول / تسجيل</span>
              </Link>
            )}
            {isAuthenticated && isDropdownOpen && (
              <div 
                className="dropdown-menu dropdown-menu-end"
                style={{ display: 'block', position: 'absolute' }}
              >
                <Link className="dropdown-item" to="/profile">حسابي</Link>
                <Link className="dropdown-item" to="/orders">طلباتي</Link>
                <Link className="dropdown-item" to="/wishlist">المفضلة</Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger dropdown-item-logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <header className={`amazon-header ${!isHeaderVisible ? 'hidden' : ''}`}>
        <div className="amazon-header-top">
          <Link className="header-logo" to="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
          
          <div className="header-search">
             <select className="header-search-select" defaultValue="">
              <option value="" disabled>الكل</option>
              {categories && categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
                <input
              className="header-search-input" 
              type="text" 
              placeholder="ابحث في متجرنا"
                  value={search}
              onChange={handleSearchChange}
              onFocus={() => { if(search) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(e); }}
            />
            <button className="header-search-button" onClick={handleSearchSubmit}>
                  <i className="fas fa-search"></i>
                </button>
            {showSuggestions && search.trim() && (
              <div className="search-suggestions">
                {searchLoading ? (
                  <div className="suggestion-item">جاري البحث...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <div 
                        key={item._id}
                      className="suggestion-item" 
                      onMouseDown={() => handleSuggestionClick(item)}
                    >
                      <img src={item.images && item.images[0] ? item.images[0].url : '/images/placeholder.png'} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">لا توجد نتائج</div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
              {isAuthenticated && (
              <>
                <Link to="/orders" className="header-nav-item">
                  <FaBoxOpen />
                  <span>طلباتي</span>
                </Link>
                <Link to="/wishlist" className="header-nav-item">
                  <FaHeart />
                  <span>المفضلة</span>
                </Link>
                <Link to="/cart" className="header-nav-item">
                  <FaShoppingCart />
                  <span>عربة التسوق</span>
                </Link>
              </>
            )}
                    </div>

          <nav className="header-nav">
           
          </nav>
                  </div>
        <div className="amazon-header-bottom">
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
      </header>
    </>
  );
} 