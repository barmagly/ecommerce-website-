import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../services/Slice/product/product";
import { addUserWishlistThunk } from "../services/Slice/wishlist/wishlist";
import { getVariantsThunk } from "../services/Slice/variant/variant";
import { addToCartThunk, getCartThunk } from "../services/Slice/cart/cart";
import { handleAddToCart, handleAddToWishlist } from '../utils/authUtils';
import { createReviewThunk, getProductReviewsThunk, updateReviewThunk, deleteReviewThunk } from "../services/Slice/review/review";
import { getUserProfileThunk } from "../services/Slice/userProfile/userProfile";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const API_URL = "http://localhost:5000";
const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=No+Image";

function StarRating({ rating, setRating, interactive }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered !== null ? hovered : rating;
  return (
    <span style={{ cursor: interactive ? "pointer" : "default", fontSize: "1.5em", userSelect: 'none' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={
            display >= i
              ? "fas fa-star text-warning"
              : display >= i - 0.5
                ? "fas fa-star-half-alt text-warning"
                : "far fa-star text-warning"
          }
          onMouseEnter={interactive ? () => setHovered(i) : undefined}
          onMouseLeave={interactive ? () => setHovered(null) : undefined}
          onClick={interactive && setRating ? () => setRating(i) : undefined}
          style={{ transition: 'transform 0.15s', transform: hovered === i ? 'scale(1.2)' : 'scale(1)' }}
        />
      ))}
    </span>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { variants, loading: variantsLoading } = useSelector((state) => state.variant);
  const { wishlist } = useSelector((state) => state.userWishlist);
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const { user: profileUser } = useSelector((state) => state.userProfile);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImg, setMainImg] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        setProductError(null);
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setProductError(err.response?.data?.message || "حدث خطأ أثناء جلب المنتج");
        console.error("Error fetching product:", err);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
    if (id) {
      dispatch(getVariantsThunk({ prdId: id }));
      dispatch(getProductReviewsThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      // Initialize selected attributes only if product has attributes
      if (product.attributes?.length > 0) {
        const initialAttributes = {};
        product.attributes.forEach(attr => {
          if (attr.values.length > 0) {
            initialAttributes[attr.name] = attr.values[0];
          }
        });
        setSelectedAttributes(initialAttributes);
      }
    }
  }, [product]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      // Find matching variant based on selected attributes
      const matchingVariant = variants.find(variant => {
        return Object.entries(selectedAttributes).every(([key, value]) =>
          variant.attributes[key] === value
        );
      });

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        setCurrentVariantIndex(variants.findIndex(v => v._id === matchingVariant._id));
      } else {
        setSelectedVariant(variants[0]);
        setCurrentVariantIndex(0);
      }
    } else {
      // If no variants, set selectedVariant to null
      setSelectedVariant(null);
    }
  }, [variants, selectedAttributes]);

  useEffect(() => {
    if (selectedVariant) {
      setMainImg(selectedVariant.images?.[0]?.url || product?.imageCover || PLACEHOLDER_IMG);
    } else if (product) {
      setMainImg(product.images?.[0]?.url || product.imageCover || PLACEHOLDER_IMG);
    }
  }, [selectedVariant, product]);

  useEffect(() => {
    if (token) {
      dispatch(getUserProfileThunk());
    }
  }, [dispatch, token]);

  // Get similar products (same category)
  const similarProducts = products?.filter(p =>
    p.category === product?.category && p._id !== product?._id
  ) || [];

  // Carousel drag handling
  const carouselRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setScrollStart(carouselRef.current.scrollLeft);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const walk = dragStartX - x;
    carouselRef.current.scrollLeft = scrollStart + walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleNextVariant = () => {
    if (variants && variants.length > 0) {
      const nextIndex = (currentVariantIndex + 1) % variants.length;
      setCurrentVariantIndex(nextIndex);
      setSelectedVariant(variants[nextIndex]);
      // Update selected attributes to match the new variant
      setSelectedAttributes(variants[nextIndex].attributes);
    }
  };

  const handlePrevVariant = () => {
    if (variants && variants.length > 0) {
      const prevIndex = (currentVariantIndex - 1 + variants.length) % variants.length;
      setCurrentVariantIndex(prevIndex);
      setSelectedVariant(variants[prevIndex]);
      // Update selected attributes to match the new variant
      setSelectedAttributes(variants[prevIndex].attributes);
    }
  };

  if (productLoading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (productError) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {productError}
          </div>
          <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>رجوع</button>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="alert alert-warning" role="alert">
            المنتج غير موجود
          </div>
          <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>رجوع</button>
        </div>
        <Footer />
      </>
    );
  }

  const handleReviewChange = e => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleAddToCartClick = () => {
    handleAddToCart(dispatch, addToCartThunk, {
      productId: id,
      variantId: selectedVariant?._id // This will be undefined for products without variants
    }, navigate);
    // Refresh cart data after adding item
    dispatch(getCartThunk());
  };

  const handleAddToWishlistClick = () => {
    handleAddToWishlist(dispatch, addUserWishlistThunk, { prdId: id }, navigate);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setReviewError("يرجى تسجيل الدخول لإضافة تقييم");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError("يرجى إضافة تعليق للتقييم");
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewError("يرجى اختيار تقييم صحيح (من 1 إلى 5)");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      const result = await dispatch(createReviewThunk({
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      })).unwrap();

      if (result.status === 'success') {
        setReviewForm({ rating: 5, comment: "" });
        // Refresh product data
        dispatch(getProductsThunk());
        if (id) {
          dispatch(getVariantsThunk({ prdId: id }));
          dispatch(getProductReviewsThunk(id));
        }
      } else {
        throw new Error(result.message || "حدث خطأ أثناء إضافة التقييم");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      setReviewError(error || "حدث خطأ أثناء إضافة التقييم");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      await dispatch(updateReviewThunk({
        reviewId: editingReview,
        rating: editForm.rating,
        comment: editForm.comment
      })).unwrap();

      setEditingReview(null);
      setEditForm({ rating: 5, comment: "" });
      dispatch(getProductsThunk());
      if (id) {
        dispatch(getVariantsThunk({ prdId: id }));
        dispatch(getProductReviewsThunk(id));
      }
    } catch (error) {
      setReviewError(error || "حدث خطأ أثناء تحديث التقييم");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
      await dispatch(deleteReviewThunk(reviewId)).unwrap();
      dispatch(getProductsThunk());
      if (id) {
        dispatch(getVariantsThunk({ prdId: id }));
        dispatch(getProductReviewsThunk(id));
      }

    } catch (error) {
      setReviewError(error || "حدث خطأ أثناء حذف التقييم");
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const whatsappMsg = `مرحبًا، أود شراء المنتج: ${product.name} بسعر ${product.price} ج.م\nرابط المنتج: ${currentUrl}`;
  const whatsappUrl = `https://wa.me/201010254819?text=${encodeURIComponent(whatsappMsg)}`;

  const isReviewOwner = (reviewUserId) => {
    return currentUser && reviewUserId === currentUser._id;
  };

  const renderReviews = () => {
    if (reviewsLoading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading reviews...</span>
          </div>
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      );
    }

    return reviews.map((review) => {
      if (!review) return null;
      
      return (
        <div key={review._id} className="review-item mb-4 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1">{review.user?.name || 'Anonymous'}</h6>
              <StarRating rating={review.rating} interactive={false} />
            </div>
            {isReviewOwner(review.user?._id) && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEditReview(review)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 mb-0">{review.comment}</p>
          <small className="text-muted">
            {new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
      );
    });
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-6 d-flex flex-column align-items-center gap-3">
            <div style={{ background: '#f6f6f6', borderRadius: 24, padding: 16, boxShadow: '0 4px 24px #0001', width: '100%', display: 'flex', justifyContent: 'center', minHeight: 320 }}>
              <img
                src={mainImg}
                alt={product.name}
                style={{ maxWidth: 480, maxHeight: 420, borderRadius: 18, objectFit: 'contain', width: '100%', transition: '0.25s' }}
              />
            </div>
            {(selectedVariant?.images || product.images) && (selectedVariant?.images || product.images).length > 1 && (
              <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                {(selectedVariant?.images || product.images).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name}-img-${idx}`}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 10,
                      border: mainImg === img.url ? '2.5px solid #DB4444' : '2px solid #eee',
                      cursor: 'pointer',
                      transition: 'border 0.2s'
                    }}
                    onClick={() => setMainImg(img.url)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <h2 className="fw-bold mb-2" style={{ fontSize: '2.1rem' }}>{product.name}</h2>
            <div className="mb-2 text-muted" style={{ fontSize: '1.1rem' }}>{product.brand}</div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark" style={{ fontSize: '1.1em' }}>
                <StarRating rating={product.ratings?.average || 0} /> {product.ratings?.average || 0}
              </span>
              <span className="text-muted">({product.ratings?.count || 0} تقييم)</span>
              <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                {product?.stock > 0 ? 'متوفر' : 'غير متوفر'}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-danger fw-bold fs-3">
                {selectedVariant?.price || product?.price} ج.م
              </span>
              {selectedVariant && (
                <span className="ms-2 text-muted" style={{ fontSize: '0.9em' }}>
                  SKU: {selectedVariant.sku}
                </span>
              )}
            </div>

            {variants && variants.length > 1 && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={handlePrevVariant}
                  disabled={!variants || variants.length <= 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                <span className="text-muted">
                  {currentVariantIndex + 1} من {variants.length}
                </span>
                <button
                  className="btn btn-outline-dark"
                  onClick={handleNextVariant}
                  disabled={!variants || variants.length <= 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              </div>
            )}

            <p className="mb-3 text-muted" style={{ fontSize: '1.1rem' }}>{product.description}</p>

            {product.attributes?.length > 0 && product.attributes.map((attr, idx) => (
              <div key={idx} className="mb-3">
                <span className="fw-bold">{attr.name}:</span>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {attr.values.map((value, vIdx) => {
                    const isAvailable = variants?.some(v =>
                      v.attributes[attr.name] === value &&
                      Object.entries(selectedAttributes).every(([key, val]) =>
                        key === attr.name || v.attributes[key] === val
                      )
                    );

                    return (
                      <button
                        key={vIdx}
                        className={`btn btn-sm ${selectedAttributes[attr.name] === value
                          ? 'btn-danger text-white'
                          : isAvailable
                            ? 'btn-outline-dark'
                            : 'btn-outline-secondary'
                          }`}
                        style={{
                          minWidth: 70,
                          fontWeight: 700,
                          fontSize: '1.1em',
                          opacity: isAvailable ? 1 : 0.5,
                          cursor: isAvailable ? 'pointer' : 'not-allowed'
                        }}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedAttributes(prev => ({ ...prev, [attr.name]: value }));
                          }
                        }}
                        disabled={!isAvailable}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mb-3">
              <div className="d-flex align-items-center gap-2">
                {selectedVariant ? (
                  <>
                    <span className={`badge ${selectedVariant.inStock ? 'bg-success' : 'bg-danger'}`}>
                      {selectedVariant.inStock ? 'متوفر' : 'غير متوفر'}
                    </span>
                    {selectedVariant.quantity > 0 && (
                      <span className="text-muted">
                        الكمية المتوفرة: {selectedVariant.quantity}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock > 0 ? 'متوفر' : 'غير متوفر'}
                    </span>
                    {product.stock > 0 && (
                      <span className="text-muted">
                        الكمية المتوفرة: {product.stock}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {product.features?.length > 0 && (
              <div className="mb-3">
                <span className="fw-bold">المميزات:</span>
                <ul className="mt-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="text-muted">
                      <b>{f.name}:</b> {f.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications?.length > 0 && (
              <div className="mb-3">
                <span className="fw-bold">المواصفات:</span>
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="mt-3">
                    <h6 className="fw-bold">{spec.group}</h6>
                    <ul className="mt-2">
                      {spec.items.map((item, i) => (
                        <li key={i} className="text-muted">
                          <b>{item.name}:</b> {item.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex gap-3 mt-4 flex-wrap">
              <button className="btn btn-danger px-4" onClick={handleAddToCartClick}>أضف للسلة</button>
              <button
                className="btn btn-outline-danger px-4"
                onClick={handleAddToWishlistClick}
              >
                <i className={`${wishlist?.some(w => w._id === id) ? 'fas' : 'far'} fa-heart ms-2`}></i>
                {wishlist?.some(w => w._id === id) ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success px-4 d-flex align-items-center gap-2"
              >
                <i className="fab fa-whatsapp"></i> اطلب عبر واتساب
              </a>
              <button className="btn btn-dark px-4" onClick={() => navigate(-1)}>رجوع</button>
            </div>
          </div>
        </div>

        {/* وصف تفصيلي للمنتج */}
        <div className="row justify-content-center mt-4 mb-5">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="bg-light rounded p-4 text-end shadow-sm" style={{ fontSize: '1.13em', border: '1px solid #eee', direction: 'rtl', marginBottom: 24 }}>
              <h5 className="fw-bold mb-3 text-danger text-end" style={{ fontSize: '1.25em' }}>عن هذه السلعة</h5>
              <div className="text-muted" style={{ fontSize: '1.08em', lineHeight: 1.8 }}>
                {product.description}
              </div>
            </div>
          </div>
        </div>

        {/* قسم التقييمات */}
        <div className="row mt-5">
          <div className="col-12 col-lg-10 mx-auto">
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4" style={{ border: '1px solid #eee' }}>
              <div className="row g-4">
                <div className="col-12 col-md-4 border-end-md" style={{ borderLeft: '1.5px solid #eee' }}>
                  <div className="text-center p-4">
                    <div className="fw-bold mb-3" style={{ fontSize: '1.4em', color: '#333' }}>تقييمات المستخدمين</div>
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                      <div className="text-center">
                        <span className="fw-bold text-warning d-block" style={{ fontSize: '3.5em', lineHeight: 1 }}>
                          {product.ratings?.average || 0}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.9em' }}>من 5</span>
                      </div>
                      <div>
                        <StarRating rating={product.ratings?.average || 0} />
                        <div className="text-muted mt-2" style={{ fontSize: '0.95em' }}>
                          {product.ratings?.count || 0} تقييم
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <div className="p-3">
                    <h4 className="fw-bold mb-4 text-center" style={{ color: '#333' }}>
                      <i className="fas fa-star text-warning ms-2"></i> التقييمات
                    </h4>
                    <div className="mb-4">
                      {renderReviews()}
                    </div>
                    <form onSubmit={handleReviewSubmit} className="border rounded-4 p-4 bg-light mt-4">
                      <h6 className="fw-bold mb-3 text-center" style={{ color: '#333' }}>أضف تقييمك</h6>
                      {reviewError && (
                        <div className="alert alert-danger text-center mb-3">
                          {reviewError}
                        </div>
                      )}
                      {!token ? (
                        <div className="alert alert-info text-center">
                          يرجى <button className="btn btn-link p-0" onClick={() => navigate('/login')}>تسجيل الدخول</button> لإضافة تقييم
                        </div>
                      ) : (
                        <>
                          <div className="row g-3 mb-3">
                            <div className="col-md-6 mb-2 mb-md-0 text-center">
                              <StarRating
                                rating={reviewForm.rating}
                                setRating={r => setReviewForm(f => ({ ...f, rating: r }))}
                                interactive={true}
                              />
                            </div>
                            <div className="col-md-6">
                              <textarea
                                name="comment"
                                className="form-control"
                                placeholder="اكتب تعليقك هنا..."
                                value={reviewForm.comment}
                                onChange={handleReviewChange}
                                required
                                rows="3"
                                style={{ resize: 'none' }}
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              className="btn btn-danger px-5 py-2"
                              type="submit"
                              disabled={isSubmittingReview}
                              style={{ borderRadius: '8px' }}
                            >
                              {isSubmittingReview ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  جاري الإرسال...
                                </>
                              ) : (
                                'إرسال التقييم'
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* منتجات مشابهة */}
        {similarProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h4 className="fw-bold mb-4 text-center">منتجات مشابهة</h4>
              <div
                ref={carouselRef}
                className={`similar-carousel position-relative d-flex justify-content-center ${isDragging ? 'dragging' : ''}`}
                style={{
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  paddingBottom: 8,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none'
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <div style={{
                  display: 'flex',
                  gap: 24,
                  minWidth: 320,
                  justifyContent: 'center',
                  width: '100%',
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(.4,1.3,.6,1)'
                }}>
                  {similarProducts.map(item => (
                    <div
                      key={item._id}
                      className={`card shadow-sm border-0 d-inline-block product-similar-card${isDragging ? ' dragging-card' : ''}`}
                      style={{
                        width: 260,
                        minWidth: 240,
                        borderRadius: 16,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        verticalAlign: 'top',
                        transform: isDragging ? 'scale(0.97)' : 'scale(1)'
                      }}
                      onClick={() => {
                        if (!isDragging) {
                          navigate(`/product/${item._id}`);
                        }
                      }}
                    >
                      <div style={{
                        background: '#f6f6f6',
                        borderRadius: 16,
                        padding: 12,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={item.images?.[0]?.url || item.imageCover || PLACEHOLDER_IMG}
                          alt={item.name}
                          style={{
                            height: 140,
                            objectFit: 'contain',
                            borderRadius: 12
                          }}
                        />
                      </div>
                      <div className="card-body text-center p-2">
                        <h6 className="fw-bold mb-1" style={{ fontSize: '1.08em', minHeight: 36 }}>
                          {item.name}
                        </h6>
                        <div className="mb-1">
                          <StarRating rating={item.ratings?.average || 0} />
                        </div>
                        <div className="text-danger fw-bold mb-1" style={{ fontSize: '1.1em' }}>
                          {item.price} ج.م
                        </div>
                        <div className="text-muted mb-1" style={{ fontSize: '0.98em' }}>
                          {item.brand}
                        </div>
                        <div className="text-muted mb-2" style={{
                          fontSize: '0.97em',
                          minHeight: 36,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .similar-carousel::-webkit-scrollbar {
          display: none !important;
        }
        .similar-carousel {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .product-similar-card:hover {
          box-shadow: 0 8px 32px #db444455 !important;
          transform: scale(1.04) translateY(-4px);
        }
        .dragging .product-similar-card {
          transition: none !important;
        }
        @media (max-width: 767px) {
          .container {
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          .row.mb-4.align-items-center {
            flex-direction: column !important;
            gap: 0 !important;
          }
          .col-12.col-md-6.d-flex.flex-column.align-items-center.gap-3 {
            align-items: stretch !important;
            gap: 0 !important;
          }
          .col-12.col-md-6 {
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
    </>
  );
} 