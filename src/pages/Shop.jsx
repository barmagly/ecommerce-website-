import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopFilters from "../components/ShopFilters";
import ShopProducts from "../components/ShopProducts";
import Breadcrumb from "../components/Breadcrumb";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Image } from "react-bootstrap";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./Shop.css";
import { frontendAPI } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL 

export default function Shop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(0);
  const [categoriesPerPage, setCategoriesPerPage] = useState(9);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    minRating: '',
    inStock: ''
  });

  useEffect(() => {
    if (isMobile) {
      setCategoriesPerPage(3);
    } else if (isTablet) {
      setCategoriesPerPage(6);
    } else if (isDesktop) {
      setCategoriesPerPage(9);
    }
  }, [isMobile, isTablet, isDesktop]);

  const pageCount = Math.ceil(categories.length / categoriesPerPage);
  const startIdx = page * categoriesPerPage;
  const endIdx = startIdx + categoriesPerPage;
  const currentCategories = categories.slice(startIdx, endIdx);

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
    setCategories(currentCategories)
  };
  const handleNext = () => {
    setPage((prev) => (prev < pageCount - 1 ? prev + 1 : prev));
    setCategories(currentCategories)
  };

  // Fetch initial products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      // Find the category by name
      const category = categories.find(cat => cat.name === categoryParam);
      if (category) {
        fetchProductCat(category._id, category.name);
      }
    } else if (!categoryParam) {
      setSelectedCategory('');
    }
  }, [categories, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/products`);

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
      const response = await axios.get(`${API_URL}/api/categories`);

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

  const fetchProductCat = async (id, name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/products/category/${id}`)
      setFilteredProducts(response.data)
      setSearchParams({ category: name });
      setSelectedCategory(name);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const showAllProducts = () => {
    setFilteredProducts(products);
    setSearchParams({});
    setSelectedCategory('');
  }

  const handleFilterChange = (filterParams) => {
    setLoading(true);
    axios.get(`${API_URL}/api/products/filter?${filterParams}`)
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

  const handleSort = async (option) => {
    // If clicking the same sort option, remove sorting
    if (sortOption === option) {
      setSortOption('');
      const filterParams = new URLSearchParams(currentFilters);
      filterParams.delete("sort");
      handleFilterChange(filterParams.toString());
      return;
    }

    setSortOption(option);
    const filterParams = new URLSearchParams(currentFilters);

    switch (option) {
      case 'newest':
        filterParams.set("sort", "-createdAt");
        handleFilterChange(filterParams.toString());
        break;
      case 'bestselling': {
        setLoading(true);
        setError(null);
        try {
          const response = await frontendAPI.getBestSellers();
          let bestSellers = [];
          if (response.data && response.data.data) {
            bestSellers = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            bestSellers = response.data;
          }
          if (bestSellers.length > 0) {
            setFilteredProducts(bestSellers);
          } else {
            // fallback to all products
            const allProductsResponse = await frontendAPI.getAllProducts();
            let allProducts = [];
            if (allProductsResponse.data && allProductsResponse.data.data) {
              allProducts = allProductsResponse.data.data;
            } else if (allProductsResponse.data && Array.isArray(allProductsResponse.data)) {
              allProducts = allProductsResponse.data;
            }
            setFilteredProducts(allProducts);
          }
        } catch (err) {
          setError(err.response?.data?.message || "حدث خطأ اثناء جلب المنتجات");
        } finally {
          setLoading(false);
        }
        break;
      }
      case 'topRated':
        filterParams.set("sort", "-ratings.average");
        handleFilterChange(filterParams.toString());
        break;
      case 'priceAsc':
        filterParams.set("sort", "price");
        handleFilterChange(filterParams.toString());
        break;
      case 'priceDesc':
        filterParams.set("sort", "-price");
        handleFilterChange(filterParams.toString());
        break;
      default:
        filterParams.delete("sort");
        handleFilterChange(filterParams.toString());
    }
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

          <Box
            sx={{ display: "flex", overflowX: "auto", gap: 2, p: 2,
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": {
                height: 4,
                width: 10,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "black",
              },
              "&:hover::-webkit-scrollbar": {
                height: 5,
                width: 10,
              },
            }}
          >
            {/* All Products Option */}
            <Grid onClick={showAllProducts} minHeight={110} minWidth={110} px={0} sx={{
              cursor: 'pointer',
              scrollSnapAlign: 'center',
              border: selectedCategory === '' ? '2px solid #007bff' : '2px solid transparent',
              borderRadius: '50%',
              padding: '4px'
            }} 
              rowSpacing={2}
            >
              <Image
                src="/images/Placeholder.png"
                alt="جميع المنتجات"
                roundedCircle
                height={100}
                width={100}
                style={{
                  objectFit: 'cover',
                  marginBottom: 8,
                }}
              />
              <Typography fontWeight={'bold'} textAlign={'center'}  fontSize={14}  title="جميع المنتجات">
                جميع المنتجات
              </Typography>
            </Grid>

            {categories.map(cat =>
              <Grid key={cat._id} onClick={() => fetchProductCat(cat._id, cat.name)} minHeight={110} minWidth={110} px={0} sx={{
                cursor: 'pointer',
                scrollSnapAlign: 'center',
                border: selectedCategory === cat.name ? '2px solid #007bff' : '2px solid transparent',
                borderRadius: '50%',
                padding: '4px'
              }} 
                rowSpacing={2}
              >
                <Image
                  src={cat?.image}
                  alt={cat.name}
                  roundedCircle
                  height={100}
                  width={100}
                  style={{
                    objectFit: 'cover',
                    marginBottom: 8,
                  }}
                />
                <Typography fontWeight={'bold'} textAlign={'center'}  fontSize={14}  title={cat.name}>
                  {cat.name}
                </Typography>
              </Grid>
            )}
          </Box>

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
      </div>
      <Footer />
    </>
  );
} 