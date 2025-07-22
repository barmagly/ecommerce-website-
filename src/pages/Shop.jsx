import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopFilters from "../components/ShopFilters";
import ShopProducts from "../components/ShopProducts";
import Breadcrumb from "../components/Breadcrumb";
import { Box, Grid, Typography, Checkbox, FormControlLabel, Pagination, FormControl, Select, MenuItem, Skeleton } from "@mui/material";
import { Image } from "react-bootstrap";
import "./Shop.css";
import { frontendAPI } from '../services/api';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const API_URL = process.env.REACT_APP_API_URL
console.log('🔗 API_URL:', API_URL);

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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
  const [showDiscounted, setShowDiscounted] = useState(location.state?.showDiscounted || false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalItems: 0,
    results: 0
  });

  // Fetch initial products and categories
  useEffect(() => {
    fetchProducts(showDiscounted);
    fetchCategories();
  }, [showDiscounted]);

  // Fix mobile scrolling issue
  useEffect(() => {
    // Ensure body is scrollable on mobile
    document.body.style.overflow = 'auto';
    document.body.style.webkitOverflowScrolling = 'touch';

    // Force a reflow to ensure scrolling works
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    }, 100);

    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.body.style.webkitOverflowScrolling = '';
    };
  }, []);

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    console.log('🔗 category param from URL:', categoryParam);
    console.log('🔗 page param from URL:', pageParam);

    if (categoryParam && categories.length > 0) {
      // Find the category by name
      const normalize = str => (str || '').trim().replace(/\s+/g, ' ');
      const category = categories.find(cat => normalize(cat.name) === normalize(categoryParam));
      if (category) {
        fetchProductCat(category._id, category.name);
        setSelectedCategory(category.name);
      } else {
        setFilteredProducts([]);
        setSelectedCategory(categoryParam);
      }
    } else if (!categoryParam) {
      setSelectedCategory('');
      setFilteredProducts(products);
    }

    // Handle page parameter
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (page > 0 && page !== pagination.page) {
        setPagination(prev => ({ ...prev, page }));
        fetchProducts(showDiscounted, page, pagination.limit);
      }
    }
  }, [categories, searchParams, products]);

  const fetchProducts = async (discounted = false, page = 1, limit = 12) => {
    try {
      setLoading(true);
      setError(null);
      const url = discounted ?
        `${API_URL}/api/products?discounted=true&page=${page}&limit=${limit}` :
        `${API_URL}/api/products?page=${page}&limit=${limit}`;
      const response = await axios.get(url);

      // Handle the new paginated response structure
      if (response.data && response.data.products) {
        // New paginated response
        const productsData = response.data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);
        setPagination({
          page: response.data.page || 1,
          limit: response.data.limit || 12,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
          results: response.data.results || 0
        });
        console.log('🛒 Paginated Products:', productsData);
        console.log('📄 Pagination Info:', response.data);
      } else if (Array.isArray(response.data)) {
        // Fallback for old response format (array)
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
        setPagination(prev => ({
          ...prev,
          page: 1,
          totalPages: 1,
          totalItems: productsData.length,
          results: productsData.length
        }));
        console.log('🛒 All Products (fallback array):', productsData);
      } else {
        // Fallback for any other response format
        const productsData = response.data?.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        setPagination(prev => ({
          ...prev,
          page: 1,
          totalPages: 1,
          totalItems: productsData.length,
          results: productsData.length
        }));
        console.log('🛒 All Products (fallback other):', productsData);
      }
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
      const categoriesData = Array.isArray(response.data) ? response.data :
        response.data.categories ? response.data.categories :
          [];
      setCategories(categoriesData);
      console.log('📦 Categories:', categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]); // Set empty array on error
    }
  };

  const handleFiltersApplied = (filteredProducts) => {
    // When filters are applied from the sidebar, we need to handle pagination
    // For now, we'll set the filtered products directly, but ideally we should
    // integrate this with the pagination system
    setFilteredProducts(filteredProducts);
    // Reset pagination when filters are applied
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const fetchProductCat = async (id, name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/products/filter?category=${id}&page=${pagination.page}&limit=${pagination.limit}`);
      setFilteredProducts(Array.isArray(response.data) ? response.data : response.data.data || [])
      setSearchParams({ category: name });
      setSelectedCategory(name);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 12,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0,
        results: response.data.results || 0
      });
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
    // Reset pagination when showing all products
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts(showDiscounted, 1, pagination.limit);
  }

  const clearFilters = () => {
    setCurrentFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      minRating: '',
      inStock: ''
    });
    setSortOption('');
    setFilteredProducts(products);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts(showDiscounted, 1, pagination.limit);
  }

  const handleFilterChange = (filterParams) => {
    setLoading(true);
    // Reset to first page when applying filters
    const params = new URLSearchParams(filterParams);
    params.set('page', '1');
    params.set('limit', pagination.limit.toString());

    axios.get(`${API_URL}/api/products/filter?${params.toString()}`)
      .then(response => {
        if (response.data && response.data.data) {
          setFilteredProducts(response.data.data);
          setPagination({
            page: response.data.page || 1,
            limit: response.data.limit || 12,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.totalItems || 0,
            results: response.data.results || 0
          });
        } else {
          setFilteredProducts(response.data.data || []);
        }
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

  const handleDiscountedChange = (e) => {
    setShowDiscounted(e.target.checked);
    fetchProducts(e.target.checked, 1, pagination.limit);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setLoading(true);
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchProducts(showDiscounted, newPage, pagination.limit);

    // Update URL with page number
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage > 1) {
      newSearchParams.set('page', newPage.toString());
    } else {
      newSearchParams.delete('page');
    }
    setSearchParams(newSearchParams);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    setLoading(true);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchProducts(showDiscounted, 1, newLimit);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container pt-4">
        <Breadcrumb items={[{ label: "المتجر", to: "/shop" }]} />
        </div>
        <div className="text-center">
          <div>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} variant="circular" width='100px' height='100px' style={{ display: 'inline-block', margin: '0 8px' }} />
          ))}
          </div>
          <div className="mt-4">
            {[...Array(10)].map((_, index) => (
            <Skeleton key={index} variant="rounded" width='250px' height='350px' style={{ display: 'inline-block', margin: '0 8px' }} />
          ))}
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
            sx={{
              display: "flex", overflowX: "auto", gap: 2, p: 2,
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
              borderRadius: '50%',
              padding: '4px',
              transition: 'border 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
              rowSpacing={2}
            >
              <Image
                src="https://cdn2.mageplaza.com/media/general/OnWj0is.png"
                alt="جميع المنتجات"
                roundedCircle
                height={100}
                width={100}
                style={{
                  objectFit: 'cover',
                  marginBottom: 8,
                  border: selectedCategory === '' ? '2px solid #007bff' : '2px solid transparent',
                }}
              />
              <Typography fontWeight={'bold'} textAlign={'center'} fontSize={14} title="جميع المنتجات">
                جميع المنتجات
              </Typography>
            </Grid>

            {categories.map(cat =>
              <Grid key={cat._id} onClick={() => fetchProductCat(cat._id, cat.name)} minHeight={110} minWidth={110} px={0} sx={{
                cursor: 'pointer',
                scrollSnapAlign: 'center',
                borderRadius: '50%',
                padding: '4px',
                transition: 'border 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
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
                    border: selectedCategory === cat.name ? '2px solid #007bff' : '2px solid transparent',
                  }}
                />
                <Typography fontWeight={'bold'} textAlign={'center'} fontSize={14} title={cat.name}>
                  {cat.name}
                </Typography>
              </Grid>
            )}
          </Box>

          {/* فلتر العروض */}
          <div className="d-flex flex-wrap gap-3 align-items-center bg-white p-3 rounded shadow-sm mb-4">
            <button
              className={`btn btn-sm d-flex align-items-center fw-bold px-3 py-2 me-2 ${showDiscounted ? 'btn-danger text-white shadow' : 'btn-outline-danger'}`}
              style={{ borderRadius: 24, fontSize: 15, transition: 'all 0.2s', boxShadow: showDiscounted ? '0 2px 8px #f4433622' : 'none' }}
              onClick={() => setShowDiscounted(v => !v)}
              type="button"
            >
              <LocalOfferIcon style={{ marginLeft: 6, fontSize: 20 }} />
              {showDiscounted ? 'عرض جميع المنتجات' : 'عرض المنتجات المخفضة فقط'}
            </button>
            {/* فلاتر أفقية */}
            <span className="fw-bold">ترتيب حسب:</span>
            <button
              className={`btn btn-outline-dark btn-sm ${sortOption === 'newest' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('newest')}
            >
              الأحدث
            </button>
            {/* <button
              className={`btn btn-outline-dark btn-sm ${sortOption === 'bestselling' ? 'btn-dark text-light' : ''}`}
              onClick={() => handleSort('bestselling')}
            >
              الأكثر مبيعًا
            </button> */}
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
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              مسح الفلاتر
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

          {/* Results info and pagination controls */}
          <div className="bg-white p-3 rounded shadow-sm mt-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <Typography variant="body2" color="text.secondary" className="text-center text-md-start">
                  عرض {pagination.results} من {pagination.totalItems} منتج
                  {pagination.totalPages > 1 && ` (الصفحة ${pagination.page} من ${pagination.totalPages})`}
                </Typography>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
                  <Typography variant="body2" color="text.secondary">
                    عرض:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={pagination.limit.toString()}
                      onChange={handleLimitChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'عدد العناصر في الصفحة' }}
                    >
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 