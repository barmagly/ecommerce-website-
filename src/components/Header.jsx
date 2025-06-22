import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/Slice/auth/auth";
import { getUserProfileThunk } from "../services/Slice/userProfile/userProfile";
import { getCategoriesThunk } from "../services/Slice/categorie/categorie";
import { FaPhoneAlt, FaFire, FaUser, FaBoxOpen, FaHeart, FaShoppingCart, FaSignInAlt, FaBolt } from 'react-icons/fa';

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

  @media (max-width: 768px) {
    .top-bar {
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      text-align: center;
    }
    .promo-content span {
      display: none; /* Hide long promo text on mobile, keep button */
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
  const { products, loading: productsLoading } = useSelector(state => state.product);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    if (search.trim()) {
      const filteredSuggestions = products
        .filter(item => item.name && item.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search, products]);

  useEffect(() => {
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    } else {
      navigate('/search');
    }
    setShowSuggestions(false);
  };

  const handleSearchIcon = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    } else {
      navigate('/search');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.slug}`);
    setSearch(suggestion.name);
    setShowSuggestions(false);
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

  return (
    <>
      <style>{headerStyles}</style>
      <div className="top-bar">
        <div className="promo-content">
          <span>عرض حصري وتوصيل سريع - خصم حتى 50%!</span>
          <Link to="/shop" className="promo-button">
            <FaBolt />
            تسوق الآن
          </Link>
        </div>
        <div className="top-bar-actions">
          <div className="contact-info top-bar-item">
            <FaPhoneAlt />
            <span>01234567890</span>
          </div>
          <div className="dropdown">
            {isAuthenticated ? (
              <Link to="/profile" className="top-bar-item">
                <FaUser />
                <span>مرحباً, {currentUser?.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="top-bar-item">
                <FaSignInAlt />
                <span>دخول / تسجيل</span>
              </Link>
            )}
            {isAuthenticated && (
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to="/profile">حسابي</Link>
                <Link className="dropdown-item" to="/orders">طلباتي</Link>
                <Link className="dropdown-item" to="/wishlist">المفضلة</Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>تسجيل الخروج</button>
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
              onChange={e => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                  setShowSuggestions(false);
                }
              }}
            />
            <button className="header-search-button" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
            {showSuggestions && search.trim() && (
              <div className="search-suggestions">
                {productsLoading ? (
                  <div className="suggestion-item">جاري البحث...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map(item => (
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