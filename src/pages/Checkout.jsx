import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from "../components/ProtectedRoute";
import { createOrderThunk } from "../services/Slice/order/order";
import { couponsAPI } from "../services/api";
import { toast } from "react-toastify";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.order);
  const { cartItems = [], total = 0 } = location.state || {};

  useEffect(() => {
    // If no cart data is present or user is not authenticated, redirect to cart
    if (!cartItems.length || !token) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [form, setForm] = useState({
    firstName: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    coupon: ""
  });

  // إضافة حالة للتحقق من الأخطاء
  const [errors, setErrors] = useState({});
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    holder: ""
  });
  const [cardErrors, setCardErrors] = useState({});

  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [instapayImage, setInstapayImage] = useState(null);
  const [instapayNumber] = useState("01012345678");
  const [instapayStatus, setInstapayStatus] = useState("");

  // Add state for coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [couponLoading, setCouponLoading] = useState(false);

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // التحقق من صحة رقم الهاتف
  const validatePhone = (phone) => {
    const re = /^01[0125][0-9]{8}$/;
    return re.test(phone);
  };

  // التحقق من صحة رقم البطاقة
  const validateCardNumber = (number) => {
    const re = /^[0-9]{16}$/;
    return re.test(number.replace(/\s/g, ''));
  };

  // التحقق من صحة تاريخ انتهاء البطاقة
  const validateExpiry = (expiry) => {
    const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!re.test(expiry)) return false;

    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    return true;
  };

  // التحقق من صحة CVV
  const validateCVV = (cvv) => {
    const re = /^[0-9]{3,4}$/;
    return re.test(cvv);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // مسح رسالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardChange = e => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));

    // مسح رسالة الخطأ عند التعديل
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInstapayImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          instapay: 'يرجى اختيار ملف صورة صالح'
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          instapay: 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت'
        }));
        return;
      }
      setInstapayImage(file);
      setInstapayStatus("بانتظار تأكيد الإدارة...");
    }
  };

  const handleApplyCoupon = async () => {
    if (!form.coupon.trim()) {
      toast.error('الرجاء إدخال كود الكوبون');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await couponsAPI.validate(form.coupon);
      const { valid, coupon } = response.data.data;

      if (valid) {
        // Check if coupon applies to any products in cart
        if (coupon.applyTo === 'products') {
          const cartProductIds = cartItems.map(item => 
            item?.variantId ? item?.variantId._id : item?.prdID._id
          );
          const hasApplicableProducts = coupon.products.some(productId => 
            cartProductIds.includes(productId)
          );
          
          if (!hasApplicableProducts) {
            toast.error('هذا الكوبون لا ينطبق على المنتجات في سلة المشتريات');
            setCouponLoading(false);
            return;
          }
        }

        // Check if coupon applies to any categories in cart
        if (coupon.applyTo === 'categories') {
          const cartCategoryIds = cartItems.map(item => 
            item?.prdID?.category?._id
          ).filter(Boolean);
          
          const hasApplicableCategories = coupon.categories.some(categoryId => 
            cartCategoryIds.includes(categoryId)
          );
          
          if (!hasApplicableCategories) {
            toast.error('هذا الكوبون لا ينطبق على الفئات في سلة المشتريات');
            setCouponLoading(false);
            return;
          }
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'percentage') {
          discountAmount = (total * coupon.discount) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discount;
        }

        // Check minimum amount requirement
        if (coupon.minAmount && total < coupon.minAmount) {
          toast.error(`يجب أن يكون إجمالي الطلب ${coupon.minAmount} ج.م على الأقل`);
          setCouponLoading(false);
          return;
        }

        setAppliedCoupon(coupon);
        setDiscountedTotal(total - discountAmount);
        toast.success('تم تطبيق الكوبون بنجاح');
      } else {
        toast.error('كود الكوبون غير صالح');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء التحقق من الكوبون');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedTotal(total);
    setForm(prev => ({ ...prev, coupon: '' }));
    toast.info('تم إزالة الكوبون');
  };

  const validateForm = () => {
    const newErrors = {};

    // التحقق من الحقول المطلوبة
    if (!form.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!form.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!form.city.trim()) newErrors.city = 'المدينة مطلوبة';

    // التحقق من البريد الإلكتروني
    if (!form.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    // التحقق من رقم الهاتف
    if (!form.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح';
    }

    // التحقق من تفاصيل البطاقة إذا تم اختيار الدفع بالفيزا
    if (payment === "visa") {
      const newCardErrors = {};

      if (!validateCardNumber(cardDetails.number)) {
        newCardErrors.number = 'رقم البطاقة غير صالح';
      }
      if (!validateExpiry(cardDetails.expiry)) {
        newCardErrors.expiry = 'تاريخ انتهاء البطاقة غير صالح';
      }
      if (!validateCVV(cardDetails.cvv)) {
        newCardErrors.cvv = 'CVV غير صالح';
      }
      if (!cardDetails.holder.trim()) {
        newCardErrors.holder = 'اسم حامل البطاقة مطلوب';
      }

      if (Object.keys(newCardErrors).length > 0) {
        setCardErrors(newCardErrors);
        return false;
      }
    }

    // التحقق من صورة Instapay إذا تم اختيار الدفع عبر Instapay
    if (payment === "instapay" && !instapayImage) {
      newErrors.instapay = 'يرجى رفع صورة إثبات التحويل';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const formData = new FormData();

      // Add order details
      formData.append('name', form.firstName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('postalCode', '00000'); // Default value
      formData.append('country', 'مصر'); // Default value
      formData.append('apartment', form.apartment || '');

      // Create shipping address string
      const shippingAddress = `${form.address}${form.apartment ? `, ${form.apartment}` : ''}, ${form.city}, مصر`;
      formData.append('shippingAddress', shippingAddress);

      // Map payment method to schema enum values
      let paymentMethod;
      switch (payment) {
        case 'visa':
          paymentMethod = 'credit_card';
          break;
        case 'instapay':
          paymentMethod = 'bank_transfer';
          break;
        case 'cod':
          paymentMethod = 'cash_on_delivery';
          break;
        default:
          paymentMethod = 'cash_on_delivery';
      }
      formData.append('paymentMethod', paymentMethod);

      // Add payment proof image if using Instapay
      if (payment === 'instapay') {
        if (!instapayImage) {
          setErrors(prev => ({
            ...prev,
            instapay: 'يرجى رفع صورة إثبات التحويل'
          }));
          return;
        }
        formData.append('image', instapayImage);
      }

      // Add card details if using Visa
      if (payment === 'visa') {
        formData.append('cardDetails', JSON.stringify({
          number: cardDetails.number,
          expiry: cardDetails.expiry,
          cvv: cardDetails.cvv,
          holder: cardDetails.holder
        }));
      }

      // Dispatch createOrderThunk
      const resultAction = await dispatch(createOrderThunk(formData));

      if (createOrderThunk.fulfilled.match(resultAction)) {
        setOrderPlaced(true);

        // Clear cart and redirect after a short delay
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              orderId: resultAction.payload.order._id,
              total: total
            }
          });
        }, 2000);
      } else {
        setErrors(prev => ({
          ...prev,
          submit: resultAction.payload?.message || 'حدث خطأ أثناء إنشاء الطلب'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'حدث خطأ أثناء إنشاء الطلب'
      }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "سلة المشتريات", to: "/cart" },
            { label: "إتمام الشراء", to: "/checkout" }
          ]} />
          <h2 className="fw-bold mb-4">تفاصيل الفاتورة</h2>
          <div className="row g-4">
            <div className="col-lg-7">
              <form onSubmit={handleOrder} noValidate>
                <div className="mb-3">
                  <label className="form-label">الاسم الأول *</label>
                  <input
                    name="firstName"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">العنوان *</label>
                  <input
                    name="address"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">شقة/دور (اختياري)</label>
                  <input
                    name="apartment"
                    className="form-control"
                    value={form.apartment}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">المدينة *</label>
                  <input
                    name="city"
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">رقم الهاتف *</label>
                  <input
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">البريد الإلكتروني *</label>
                  <input
                    name="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="saveInfo" />
                  <label className="form-check-label" htmlFor="saveInfo">
                    حفظ هذه المعلومات لعمليات الشراء القادمة
                  </label>
                </div>
                {error && (
                  <div className="alert alert-danger mt-3">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success mt-3">
                    تم إنشاء الطلب بنجاح! جاري تحويلك...
                  </div>
                )}
              </form>
            </div>
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">ملخص الطلب</h5>
                  {cartItems.map(item => (
                    <div className="d-flex align-items-center mb-3" key={item?.variantId ? item?.variantId._id : item?.prdID._id}>
                      <img src={item?.variantId ? item?.variantId?.images[0].url : item?.prdID?.images[0].url} alt={item?.prdID?.name} style={{ width: 54, height: 54, borderRadius: 8, marginLeft: 8 }} />
                      <span className="fw-bold flex-fill">{item?.prdID?.name}</span>
                      <span>{item?.variantId ? item?.variantId?.price * item?.quantity : item?.prdID?.price * item?.quantity} ج.م</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>الإجمالي الفرعي:</span>
                    <span>{total} ج.م</span>
                  </div>
                  {appliedCoupon && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>الخصم:</span>
                      <span className="text-success">
                        -{appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}%` 
                          : `${appliedCoupon.discount} ج.م`}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>الشحن:</span>
                    <span>مجاني</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">الإجمالي الكلي:</span>
                    <span className="fw-bold text-danger">{discountedTotal} ج.م</span>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <input
                        name="coupon"
                        className="form-control"
                        placeholder="كود الخصم"
                        value={form.coupon}
                        onChange={handleChange}
                        disabled={!!appliedCoupon}
                      />
                      {!appliedCoupon ? (
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'تطبيق'
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={handleRemoveCoupon}
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 text-success">
                        تم تطبيق كوبون: {appliedCoupon.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">طريقة الدفع</label>
                    <select
                      className="form-select"
                      value={payment}
                      onChange={e => setPayment(e.target.value)}
                    >
                      <option value="cod">الدفع عند الاستلام</option>
                      {/* <option value="visa">بطاقة فيزا/ماستر كارد</option> */}
                      <option value="instapay">الدفع عبر Instapay</option>
                    </select>
                  </div>
                  {payment === "visa" && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">تفاصيل البطاقة</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="رقم البطاقة"
                        className={`form-control mb-2 ${cardErrors.number ? 'is-invalid' : ''}`}
                        value={cardDetails.number}
                        onChange={handleCardChange}
                      />
                      {cardErrors.number && <div className="invalid-feedback mb-2">{cardErrors.number}</div>}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            className={`form-control ${cardErrors.expiry ? 'is-invalid' : ''}`}
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                          />
                          {cardErrors.expiry && <div className="invalid-feedback">{cardErrors.expiry}</div>}
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            className={`form-control ${cardErrors.cvv ? 'is-invalid' : ''}`}
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                          />
                          {cardErrors.cvv && <div className="invalid-feedback">{cardErrors.cvv}</div>}
                        </div>
                      </div>
                      <input
                        type="text"
                        name="holder"
                        placeholder="اسم حامل البطاقة"
                        className={`form-control ${cardErrors.holder ? 'is-invalid' : ''}`}
                        value={cardDetails.holder}
                        onChange={handleCardChange}
                      />
                      {cardErrors.holder && <div className="invalid-feedback">{cardErrors.holder}</div>}
                    </div>
                  )}
                  {payment === "instapay" && (
                    <div className="mb-3 border rounded p-3 bg-light">
                      <h6 className="fw-bold mb-2">الدفع عبر Instapay</h6>
                      <div className="mb-2">رقم Instapay لتحويل المبلغ:</div>
                      <div className="alert alert-info fw-bold mb-2" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>{instapayNumber}</div>
                      <div className="mb-2">يرجى تحويل المبلغ إلى رقم Instapay أعلاه من خلال تطبيق Instapay على هاتفك، ثم رفع صورة (Screenshot) لإثبات التحويل.</div>
                      <input
                        type="file"
                        accept="image/*"
                        name="instapayImage"
                        className={`form-control mb-2 ${errors.instapay ? 'is-invalid' : ''}`}
                        onChange={handleInstapayImage}
                      />
                      {errors.instapay && <div className="invalid-feedback mb-2">{errors.instapay}</div>}
                      {instapayImage && (
                        <div className="mb-2">
                          <span className="text-success">تم رفع الصورة بنجاح!</span>
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(instapayImage)}
                              alt="إثبات التحويل"
                              style={{ maxWidth: 200, borderRadius: 8 }}
                            />
                          </div>
                        </div>
                      )}
                      {instapayStatus && <div className="alert alert-warning mt-2">{instapayStatus}</div>}
                    </div>
                  )}
                  <button
                    className="btn btn-danger w-100 py-2 fw-bold"
                    onClick={handleOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري إنشاء الطلب...
                      </>
                    ) : (
                      'تأكيد الطلب'
                    )}
                  </button>
                  {orderPlaced && (
                    <div className="alert alert-success mt-3">
                      تم إرسال طلبك بنجاح! جاري تحويلك...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 