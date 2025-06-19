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

// إضافة مكون Snackbar من Material-UI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';

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

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImg, setMainImg] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products?.find(p => p._id === id);

  useEffect(() => {
    dispatch(getProductsThunk());
    if (id) {
      dispatch(getVariantsThunk({ prdId: id }));
      dispatch(getProductReviewsThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
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
      setSelectedVariant(null);
    }
  }, [variants, selectedAttributes]);

  useEffect(() => {
    if (selectedVariant) {
      setMainImg(selectedVariant.images?.[0]?.url || product?.imageCover);
    } else if (product) {
      setMainImg(product.imageCover);
    }
  }, [selectedVariant, product]);

  useEffect(() => {
    if (token) {
      dispatch(getUserProfileThunk());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (showSnackbar) {
      setOpenSnackbar(true);
      setShowSnackbar(false);
    }
  }, [showSnackbar]);

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
      setSelectedAttributes(variants[nextIndex].attributes);
    }
  };

  const handlePrevVariant = () => {
    if (variants && variants.length > 0) {
      const prevIndex = (currentVariantIndex - 1 + variants.length) % variants.length;
      setCurrentVariantIndex(prevIndex);
      setSelectedVariant(variants[prevIndex]);
      setSelectedAttributes(variants[prevIndex].attributes);
    }
  };

  const handleAddToCartClick = () => {
    if (!token) {
      toast.info('يجب تسجيل الدخول لإضافة المنتج إلى السلة', {
        position: 'top-center',
        rtl: true,
        autoClose: 3000
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }
    dispatch(addToCartThunk({
      productId: id,
      variantId: selectedVariant?._id,
      quantity: quantity
    }))
      .unwrap()
      .then(() => {
        setShowSnackbar(true);
      })
      .catch(error => {
        if (error.message && error.message.includes('لا يمكن شراء أكثر من')) {
          toast.error(error.message, {
            position: "top-center",
            rtl: true,
            autoClose: 4000
          });
        } else {
          toast.error(error.message || "حدث خطأ أثناء إضافة المنتج إلى السلة", {
            position: "top-center",
            rtl: true,
            autoClose: 3000
          });
        }
      });
  };

  const handleAddToWishlistClick = () => {
    handleAddToWishlist(dispatch, addUserWishlistThunk, id, navigate);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
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

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
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
    return profileUser && reviewUserId._id === profileUser._id;
  };

  const renderReviews = () => {
    if (reviewsLoading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري تحميل التقييمات...</span>
          </div>
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center py-4">
          <p>لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
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
            {isReviewOwner(review?.user) && (
              <div className="btn-group d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleUpdateReview}
                >
                  تعديل
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  حذف
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
            {(selectedVariant?.images || product?.images) && (selectedVariant?.images || product?.images).length > 0 && (
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
            <h1 className="fw-bold my-3 name" style={{ fontSize: '2.0em', color: '#333', lineHeight: 1.2 }}>
              {product.name}
              {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                <span className="badge bg-info ms-2" style={{ fontSize: '0.4em', verticalAlign: 'top' }}>
                  الحد الأقصى: {product.maxQuantityPerOrder}
                </span>
              )}
            </h1>
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
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-danger fw-bold" style={{ fontSize: '2rem' }}>
                {selectedVariant ? selectedVariant.price : product.price} ج.م
              </span>
              {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                <span className="badge bg-warning text-dark" style={{ fontSize: '0.8rem' }}>
                  <i className="fas fa-exclamation-triangle ms-1"></i>
                  الحد الأقصى: {product.maxQuantityPerOrder} قطعة
                </span>
              )}
            </div>
            {selectedVariant && (
              <div className="mb-3">
                <span className="text-muted" style={{ fontSize: '0.9em' }}>
                  SKU: {selectedVariant.sku}
                </span>
              </div>
            )}
            {!selectedVariant && product.sku && (
              <div className="mb-3">
                <span className="text-muted" style={{ fontSize: '0.9em' }}>
                  SKU: {product.sku}
                </span>
              </div>
            )}

            {/* عرض نطاق التوصيل */}
            {product.shippingAddress && (
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={`badge ${product.shippingAddress.type === 'nag_hamadi' ? 'bg-warning' : 'bg-success'}`} style={{ fontSize: '1em' }}>
                    {product.shippingAddress.type === 'nag_hamadi' ? '🚚 نجع حمادي فقط' : '🚚 جميع المحافظات'}
                  </span>
                  <span className="text-muted small">
                    {product.shippingAddress.type === 'nag_hamadi' 
                      ? 'هذا المنتج متاح للشحن في نجع حمادي فقط' 
                      : 'هذا المنتج متاح للشحن في جميع محافظات مصر'}
                  </span>
                </div>
                
                {/* معلومات إضافية عن التوصيل */}
                <div className="bg-light p-3 rounded">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="text-muted small">تكلفة الشحن</div>
                      <div className="fw-bold text-success">{product.shippingCost || 0} ج.م</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">وقت التوصيل</div>
                      <div className="fw-bold text-primary">{product.deliveryDays || 2} يوم</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    {product.maxQuantityPerOrder && (
                      <span className="text-muted d-block">
                        الحد الأقصى للشراء في الطلب الواحد: <strong>{product.maxQuantityPerOrder}</strong> قطعة
                      </span>
                    )}
                    {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                      <div className="alert alert-info py-2 mt-2">
                        <small>
                          <i className="fas fa-info-circle ms-1"></i>
                          <strong>ملاحظة:</strong> تم تحديد حد أقصى للشراء من قبل الإدارة
                        </small>
                      </div>
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
                    {product.maxQuantityPerOrder && (
                      <span className="text-muted d-block">
                        الحد الأقصى للشراء في الطلب الواحد: <strong>{product.maxQuantityPerOrder}</strong> قطعة
                      </span>
                    )}
                    {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                      <div className="alert alert-info py-2 mt-2">
                        <small>
                          <i className="fas fa-info-circle ms-1"></i>
                          <strong>ملاحظة:</strong> تم تحديد حد أقصى للشراء من قبل الإدارة
                        </small>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="bg-light rounded p-4 text-end shadow-sm" style={{ fontSize: '1.13em', border: '1px solid #eee', direction: 'rtl', marginBottom: 24 }}>
                <h5 className="fw-bold mb-3 text-success text-end" style={{ fontSize: '1.25em' }}>مميزات المنتج</h5>
                {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                  <div className="alert alert-warning mb-3">
                    <i className="fas fa-exclamation-triangle ms-1"></i>
                    <strong>تنبيه:</strong> الحد الأقصى للشراء هو {product.maxQuantityPerOrder} قطعة في الطلب الواحد
                  </div>
                )}
                <ul className="list-unstyled">
                  {product.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success ms-2"></i>
                      <strong>{feature.name}:</strong> {feature.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-light rounded p-4 text-end shadow-sm" style={{ fontSize: '1.13em', border: '1px solid #eee', direction: 'rtl', marginBottom: 24 }}>
                <h5 className="fw-bold mb-3 text-primary text-end" style={{ fontSize: '1.25em' }}>مواصفات المنتج</h5>
                {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                  <div className="alert alert-info mb-3">
                    <i className="fas fa-info-circle ms-1"></i>
                    <strong>معلومات الشراء:</strong> الحد الأقصى المسموح هو {product.maxQuantityPerOrder} قطعة في الطلب الواحد
                  </div>
                )}
                {product.specifications.map((spec, specIndex) => (
                  <div key={specIndex} className="mb-4">
                    <h6 className="fw-bold text-primary mb-2">{spec.group}</h6>
                    <div className="row">
                      {spec.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="col-md-6 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">{item.name}:</span>
                            <span className="fw-bold">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex gap-3 mt-4 flex-wrap">
              <div className="w-100">
                <label className="form-label mb-1 text-end w-100">الكمية</label>
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ maxWidth: 180, background: "#fff", borderRadius: 12, border: "1px solid #ccc", padding: 4 }}
                >
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    style={{ minWidth: 36, minHeight: 36, fontSize: 20 }}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    tabIndex={-1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={product.maxQuantityPerOrder ? Math.min(product.maxQuantityPerOrder, product.stock) : product.stock}
                    value={quantity}
                    onChange={e => {
                      let val = parseInt(e.target.value) || 1;
                      if (val < 1) val = 1;
                      if (val > (product.maxQuantityPerOrder ? Math.min(product.maxQuantityPerOrder, product.stock) : product.stock))
                        val = product.maxQuantityPerOrder ? Math.min(product.maxQuantityPerOrder, product.stock) : product.stock;
                      setQuantity(val);
                    }}
                    style={{
                      width: 48,
                      textAlign: "center",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background: "transparent",
                      fontWeight: "bold"
                    }}
                    className="form-control mx-1 p-0"
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    style={{ minWidth: 36, minHeight: 36, fontSize: 20 }}
                    onClick={() => {
                      const maxQ = product.maxQuantityPerOrder ? Math.min(product.maxQuantityPerOrder, product.stock) : product.stock;
                      if (quantity >= maxQ) {
                        if (product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock) {
                          toast.warning(`لا يمكنك شراء أكثر من ${maxQ} من هذا المنتج في الطلب الواحد. الحد الأقصى المحدد من قبل الإدارة.`, {
                            position: "top-center",
                            rtl: true,
                            autoClose: 4000
                          });
                        } else {
                          toast.warning(`لا يمكنك شراء أكثر من ${maxQ} من هذا المنتج في الطلب الواحد`, {
                            position: "top-center",
                            rtl: true,
                            autoClose: 3000
                          });
                        }
                        return;
                      }
                      setQuantity(q => Math.min(maxQ, q + 1));
                    }}
                    disabled={quantity >= (product.maxQuantityPerOrder ? Math.min(product.maxQuantityPerOrder, product.stock) : product.stock)}
                    tabIndex={-1}
                  >
                    +
                  </button>
                </div>
                {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                  <small className="text-muted mt-1 w-100 text-end d-block">
                    الحد الأقصى: {product.maxQuantityPerOrder} قطعة
                  </small>
                )}
              </div>
              <button className="btn btn-danger px-2" onClick={handleAddToCartClick}>أضف للسلة</button>
              <button
                className="btn btn-outline-danger px-2"
                onClick={handleAddToWishlistClick}
              >
                <i className={`${wishlist?.some(w => w._id === id) ? 'fas' : 'far'} fa-heart ms-2`}></i>
                {wishlist?.some(w => w._id === id) ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success px-2 d-flex align-items-center gap-2 justify-content-center"
              >
                <i className="fab fa-whatsapp"></i> اطلب عبر واتساب
              </a>
              <button className="btn btn-dark px-2" onClick={() => navigate(-1)}>رجوع</button>
            </div>
          </div>
        </div>

        {/* وصف تفصيلي للمنتج */}
        <div className="row justify-content-center mt-4 mb-5">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="bg-light rounded p-4 text-end shadow-sm" style={{ fontSize: '1.13em', border: '1px solid #eee', direction: 'rtl', marginBottom: 24 }}>
              <h5 className="fw-bold mb-3 text-danger text-end" style={{ fontSize: '1.25em' }}>عن هذه السلعة</h5>
              {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                <div className="alert alert-info mb-3">
                  <i className="fas fa-info-circle ms-1"></i>
                  <strong>ملاحظة مهمة:</strong> تم تحديد حد أقصى للشراء من قبل الإدارة ({product.maxQuantityPerOrder} قطعة في الطلب الواحد)
                </div>
              )}
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
                    {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                      <div className="mb-3">
                        <small className="badge bg-info text-white">
                          <i className="fas fa-info-circle ms-1"></i>
                          الحد الأقصى للشراء: {product.maxQuantityPerOrder} قطعة
                        </small>
                      </div>
                    )}
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
                    {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                      <div className="alert alert-info mb-4 text-center">
                        <i className="fas fa-info-circle ms-1"></i>
                        <strong>تذكير:</strong> الحد الأقصى للشراء هو {product.maxQuantityPerOrder} قطعة في الطلب الواحد
                      </div>
                    )}
                    <div className="mb-4">
                      {reviewsLoading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">جاري التحميل...</span>
                          </div>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="alert alert-info text-center py-4">
                          <i className="fas fa-info-circle ms-2"></i>
                          لا توجد تقييمات بعد.
                        </div>
                      ) : (
                        reviews.map((r, i) => (
                          <div key={i} className="border-bottom pb-4 mb-4">
                            {editingReview === r._id ? (
                              <form onSubmit={handleUpdateReview} className="mt-3">
                                <div className="row g-3 mb-3">
                                  <div className="col-md-6 mb-2 mb-md-0 text-center">
                                    <StarRating
                                      rating={editForm.rating}
                                      setRating={r => setEditForm(f => ({ ...f, rating: r }))}
                                      interactive={true}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <textarea
                                      name="comment"
                                      className="form-control"
                                      placeholder="تعليقك"
                                      value={editForm.comment}
                                      onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                                      required
                                      rows="3"
                                      style={{ resize: 'none' }}
                                    />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <button
                                    className="btn btn-danger px-4 me-2"
                                    type="submit"
                                    disabled={isSubmittingReview}
                                  >
                                    {isSubmittingReview ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        جاري الحفظ...
                                      </>
                                    ) : (
                                      'حفظ التغييرات'
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={handleCancelEdit}
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <StarRating rating={r.rating} />
                                    <span className="fw-bold" style={{ color: '#333' }}>{r.user?.name || 'مستخدم'}</span>
                                  </div>
                                  <span className="text-muted small">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: '1.05em', lineHeight: 1.6 }}>{r.comment}</div>
                                {isReviewOwner(r?.user) && (
                                  <div className="mt-3 text-end">
                                    <button
                                      className="btn btn-sm btn-outline-primary ms-2"
                                      onClick={() => handleEditReview(r)}
                                      style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                                    >
                                      <i className="fas fa-edit ms-1"></i>
                                      تعديل
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteReview(r._id)}
                                      style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                                    >
                                      <i className="fas fa-trash ms-1"></i>
                                      حذف
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      )}                    </div>
                    <form onSubmit={handleReviewSubmit} className="border rounded-4 p-4 bg-light mt-4">
                      <h6 className="fw-bold mb-3 text-center" style={{ color: '#333' }}>أضف تقييمك</h6>
                      {product.maxQuantityPerOrder && product.maxQuantityPerOrder < product.stock && (
                        <div className="alert alert-warning mb-4 text-center">
                          <i className="fas fa-exclamation-triangle ms-1"></i>
                          <strong>تنبيه:</strong> الحد الأقصى للشراء هو {product.maxQuantityPerOrder} قطعة في الطلب الواحد
                        </div>
                      )}
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

      {/* إضافة المربع العائم */}
      <Snackbar
      
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
        
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ 
            width: '100%',
            backgroundColor: '#4CAF50',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            },
            padding: 0,
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleGoToCart}
              sx={{
                mx:2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              متابعة الطلب
            </Button>
          }
        >
          تم إضافة المنتج إلى السلة بنجاح!
        </Alert>
      </Snackbar>

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
            padding-left: 30px !important;
            padding-right: 30px !important;
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
          .name
          {
            font-size: 1.5em !important;
          }
        }
      `}</style>
    </>
  );
}