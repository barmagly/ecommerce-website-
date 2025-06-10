import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopFilters from "../components/ShopFilters";
import ShopProducts from "../components/ShopProducts";
import Breadcrumb from "../components/Breadcrumb";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    minRating: '',
    inStock: ''
  });

  // Fetch initial products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      
      // Ensure we're setting an array
      const productsData = Array.isArray(response.data) ? response.data : 
                          response.data.products ? response.data.products : 
                          [];
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
      
      // Ensure we're setting an array
      const categoriesData = Array.isArray(response.data) ? response.data :
                           response.data.categories ? response.data.categories :
                           [];
      
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]); // Set empty array on error
    }
  };

  const handleFiltersApplied = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  const handleFilterChange = (filterParams) => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/products/filter?${filterParams}`)
      .then(response => {
        setFilteredProducts(response.data.data);
        setCurrentFilters(filterParams);
      })
      .catch(error => {
        setError('حدث خطأ في جلب المنتجات');
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSort = (option) => {
    // If clicking the same sort option, remove sorting
    if (sortOption === option) {
      setSortOption('');
      const filterParams = new URLSearchParams(currentFilters);
      filterParams.delete("sort");
      handleFilterChange(filterParams.toString());
      return;
    }

    // Set new sort option
    setSortOption(option);
    const filterParams = new URLSearchParams(currentFilters);
    
    // Add sort parameter
    switch(option) {
      case 'newest':
        filterParams.set("sort", "-createdAt");
        break;
      case 'bestselling':
        filterParams.set("sort", "-sold");
        break;
      case 'topRated':
        filterParams.set("sort", "-ratings.average");
        break;
      case 'priceAsc':
        filterParams.set("sort", "price");
        break;
      case 'priceDesc':
        filterParams.set("sort", "-price");
        break;
      default:
        filterParams.delete("sort");
    }
    
    handleFilterChange(filterParams.toString());
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="shop-page bg-light py-4">
        <div className="container">
          <Breadcrumb items={[{ label: "المتجر", to: "/shop" }]} />
          
          {/* فلاتر أفقية */}
          <div className="d-flex flex-wrap gap-2 align-items-center bg-white p-3 rounded shadow-sm mb-4">
            <span className="fw-bold">ترتيب حسب:</span>
            <button 
              className={`btn btn-outline-dark btn-sm ${sortOption === 'newest' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('newest')}
            >
              الأحدث
            </button>
            <button 
              className={`btn btn-outline-dark btn-sm ${sortOption === 'bestselling' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('bestselling')}
            >
              الأكثر مبيعًا
            </button>
            <button 
              className={`btn btn-outline-dark btn-sm ${sortOption === 'topRated' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('topRated')}
            >
              الأعلى تقييمًا
            </button>
            <button 
              className={`btn btn-outline-dark btn-sm ${sortOption === 'priceAsc' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('priceAsc')}
            >
              السعر: من الأقل للأعلى
            </button>
            <button 
              className={`btn btn-outline-dark btn-sm ${sortOption === 'priceDesc' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('priceDesc')}
            >
              السعر: من الأعلى للأقل
            </button>
          </div>

          <div className="row">
            {/* أقسام وفلاتر جانبية */}
            <div className="col-lg-3 mb-4">
              <ShopFilters 
                onFiltersApplied={handleFiltersApplied}
                categories={categories}
                products={products}
              />
            </div>

            {/* شبكة المنتجات */}
            <div className="col-lg-9">
              <ShopProducts products={filteredProducts} />
            </div>
          </div>
        </div>
        <style jsx>{`
          .shop-page {
            min-height: 100vh;
          }
          .shop-page .breadcrumb {
            background: #fff;
            border-radius: 10px;
            margin-bottom: 24px;
          }
          .shop-page .row > .col-lg-3 {
            border-left: 1.5px solid #eee;
          }
          @media (max-width: 991px) {
            .shop-page .row > .col-lg-3 {
              border-left: none;
              border-bottom: 1.5px solid #eee;
              margin-bottom: 24px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
} 