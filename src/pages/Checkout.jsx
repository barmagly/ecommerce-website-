import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from "../components/ProtectedRoute";
import { createOrderThunk } from "../services/Slice/order/order";
import { deleteCartItemThunk, getCartThunk } from "../services/Slice/cart/cart";
import { couponsAPI } from "../services/api";
import { toast } from "react-toastify";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError, success: orderSuccess } = useSelector((state) => state.order);
  const { products: cartData, loading: cartLoading, error: cartError } = useSelector((state) => state.userCart);
  const cartItems = cartData?.cartItems || [];
  const total = cartData?.total || 0;

  // Fetch cart data on mount and token change
  useEffect(() => {
    if (!token) {
      navigate('/cart');
      return;
    }
    
    const fetchCart = async () => {
      try {
        await dispatch(getCartThunk()).unwrap();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        toast.error('فشل في تحميل بيانات السلة. حاول مرة أخرى.', {
          position: "top-center",
          rtl: true,
          autoClose: 3000
        });
        navigate('/cart');
      }
    };

    fetchCart();
  }, [dispatch, token, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      toast.info('سلة المشتريات فارغة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    coupon: "",
    shippingAddressType: "nag_hamadi"
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
  const [instapayNumber] = useState("01092474959");
  const [instapayStatus, setInstapayStatus] = useState("");

  // Add state for coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [couponLoading, setCouponLoading] = useState(false);

  // حساب إجمالي الشحن والإجمالي النهائي
  const totalShipping = cartItems.reduce((sum, item) => {
    console.log('Item in totalShipping calculation:', item);
    console.log('Item shippingCost:', item?.prdID?.shippingCost);
    return sum + (item?.prdID?.shippingCost || 0);
  }, 0);

  console.log('Cart Items in Checkout:', cartItems);
  console.log('Total Shipping calculated:', totalShipping);

  const finalTotal = appliedCoupon 
    ? (discountedTotal + totalShipping)
    : (total + totalShipping);

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

  // مسح أخطاء الشحن عند تغيير نوع العنوان
  useEffect(() => {
    if (errors.shipping) {
      setErrors(prev => ({ ...prev, shipping: '' }));
    }
  }, [form.shippingAddressType, errors.shipping]);

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
    if (!form.coupon?.trim()) {
      toast.error('الرجاء إدخال كود الكوبون');
      return;
    }

    // تنظيف كود الكوبون من المسافات والحروف الخاصة
    const cleanCouponCode = form.coupon.trim().toUpperCase();
    console.log('Original coupon code:', form.coupon);
    console.log('Clean coupon code:', cleanCouponCode);

    // اقتراح كود كوبون للاختبار إذا كان الكود المدخل غير موجود
    const testCouponCode = cleanCouponCode === 'ABC' ? 'ِِAAAA' : cleanCouponCode;
    console.log('Testing with coupon code:', testCouponCode);

    setCouponLoading(true);
    try {
      console.log('Validating coupon:', testCouponCode);
      const response = await couponsAPI.validate(testCouponCode);
      console.log('Coupon validation response:', response.data);
      
      const { valid, coupon } = response.data.data;

      if (valid && coupon) {
        console.log('Coupon details:', coupon);
        
        // فحص أن الكوبون نشط
        if (!coupon.isActive) {
          toast.error('هذا الكوبون غير نشط حالياً');
          setCouponLoading(false);
          return;
        }
        
        // فحص تاريخ انتهاء الكوبون
        const now = new Date();
        const expireDate = new Date(coupon.expire || coupon.endDate);
        if (expireDate < now) {
          toast.error('هذا الكوبون منتهي الصلاحية');
          setCouponLoading(false);
          return;
        }
        
        // فحص تاريخ بداية الكوبون
        const startDate = new Date(coupon.startDate);
        if (startDate > now) {
          toast.error('هذا الكوبون لم يبدأ بعد');
          setCouponLoading(false);
          return;
        }

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
      console.error('Coupon validation error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 404) {
        toast.error('كود الكوبون غير موجود. جرب كود آخر أو تحقق من صحة الكود.');
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || 'كود الكوبون غير صالح');
      } else if (err.response?.status === 403) {
        toast.error('هذا الكوبون منتهي الصلاحية أو غير نشط');
      } else {
        toast.error('حدث خطأ أثناء التحقق من الكوبون. تأكد من اتصالك بالإنترنت.');
      }
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
    console.log('validateForm called');
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'الاسم الأول مطلوب';
    if (!form.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (form.shippingAddressType !== 'nag_hamadi' && !form.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!form.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    // Add any other validation as needed
    console.log('validateForm errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('validateForm isValid:', isValid);
    return { isValid, errors: newErrors };
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    console.log('handleOrder called');
    
    // Validate form first
    const validationResult = validateForm();
    console.log('validateForm errors:', validationResult.errors);
    console.log('validateForm isValid:', validationResult.isValid);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Check shipping scope validation
    if (!shippingValidation.isValid) {
      setErrors(prev => ({
        ...prev,
        shipping: shippingValidation.message
      }));
      return;
    }

    try {
      // Calculate shipping costs and delivery times
      const maxShippingCost = Math.max(...cartItems.map(item => 
        Number(item?.prdID?.shippingCost) || 0
      ));
      
      const maxDeliveryDays = Math.max(...cartItems.map(item => 
        Number(item?.prdID?.deliveryDays) || 2
      ));

      console.log('Cart Items:', cartItems);
      console.log('Total Shipping Cost:', maxShippingCost);
      console.log('Max Delivery Days:', maxDeliveryDays);
      console.log('Individual product shipping costs:', cartItems.map(item => ({
        name: item.prdID.name,
        shippingCost: item.prdID.shippingCost,
        deliveryDays: item.prdID.deliveryDays
      })));

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('notes', form.notes || '');
      formData.append('total', total);
      formData.append('shippingAddressType', form.shippingAddressType);

      // Add shipping address
      const shippingAddress = `${form.address}, ${form.city || 'نجع حمادي'}, مصر`;
      formData.append('shippingAddress', shippingAddress);

      // تحويل القيم إلى أرقام وإضافتها إلى FormData
      formData.append('shippingCost', Number(maxShippingCost));
      formData.append('deliveryDays', Number(maxDeliveryDays));

      console.log('=== SHIPPING DETAILS BEING SENT ===');
      console.log('maxShippingCost:', maxShippingCost, 'Type:', typeof maxShippingCost);
      console.log('maxDeliveryDays:', maxDeliveryDays, 'Type:', typeof maxDeliveryDays);
      console.log('Individual product details:');
      cartItems.forEach((item, index) => {
        console.log(`Product ${index + 1}:`, {
          name: item.prdID.name,
          shippingCost: item.prdID.shippingCost,
          deliveryDays: item.prdID.deliveryDays,
          shippingCostType: typeof item.prdID.shippingCost,
          deliveryDaysType: typeof item.prdID.deliveryDays
        });
      });
      console.log('===================================');

      // إضافة بيانات المنتجات مع تفاصيل الشحن لكل منتج
      const cartItemsWithShipping = cartItems.map(item => ({
        productId: item.prdID._id,
        variantId: item.variantId?._id || null,
        quantity: item.quantity,
        price: item.variantId ? item.variantId.price : item.prdID.price,
        name: item.prdID.name,
        images: item.variantId ? item.variantId.images : item.prdID.images,
        shippingCost: Number(item.prdID.shippingCost) || 0,
        deliveryDays: Number(item.prdID.deliveryDays) || 2,
        shippingAddress: item.prdID.shippingAddress || { type: 'nag_hamadi' }
      }));

      // لا نرسل cartItems كـ JSON string - سيتم إرسالها من الـ backend
      // formData.append('cartItems', JSON.stringify(cartItemsWithShipping));

      // إضافة القيم الأصلية للمنتجات للتحقق منها
      formData.append('productsShippingDetails', JSON.stringify(cartItems.map(item => ({
        productId: item.prdID._id,
        shippingCost: item.prdID.shippingCost || 0,
        deliveryDays: item.prdID.deliveryDays || 2
      }))));

      // Determine payment method first
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

      console.log('FormData before sending:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      formData.append('paymentMethod', paymentMethod);
      if (payment === 'instapay') {
        if (!instapayImage) {
          setErrors(prev => ({
            ...prev,
            instapay: 'يرجى رفع صورة إثبات التحويل'
          }));
          console.log('Instapay image missing');
          return;
        }
        formData.append('image', instapayImage);
      }
      if (payment === 'visa') {
        formData.append('cardDetails', JSON.stringify({
          number: cardDetails.number,
          expiry: cardDetails.expiry,
          cvv: cardDetails.cvv,
          holder: cardDetails.holder
        }));
      }
      console.log('Submitting order with formData:', Object.fromEntries(formData.entries()));
      const resultAction = await dispatch(createOrderThunk(formData));
      console.log('Order resultAction:', resultAction);
      if (createOrderThunk.fulfilled.match(resultAction)) {
        setOrderPlaced(true);
        
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              orderId: resultAction.payload.order._id,
              total: total
            }
          });
        }, 2000);
      } else {
        const errorMessage = typeof resultAction.payload === 'object' && resultAction.payload?.message 
          ? resultAction.payload.message 
          : (typeof resultAction.payload === 'string' ? resultAction.payload : 'حدث خطأ أثناء إنشاء الطلب');
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        console.log('Order failed:', errorMessage);
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error?.message 
        ? error.message 
        : (typeof error === 'string' ? error : 'حدث خطأ أثناء إنشاء الطلب');
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      console.log('Order error:', error);
    }
  };

  // التحقق من نطاق الشحن للمنتجات
  const validateShippingScope = () => {
    const nagHamadiOnlyProducts = cartItems.filter(item => 
      item?.prdID?.shippingAddress?.type === 'nag_hamadi'
    );
    
    // إذا كان العنوان المحدد ليس نجع حمادي وكانت هناك منتجات متاحة في نجع حمادي فقط
    if (form.shippingAddressType === 'other_governorates' && nagHamadiOnlyProducts.length > 0) {
      return {
        isValid: false,
        restrictedProducts: nagHamadiOnlyProducts,
        message: 'لا يمكن توصيل بعض المنتجات إلى العنوان المحدد. هذه المنتجات متاحة للشحن في نجع حمادي فقط.'
      };
    }
    
    return { isValid: true, restrictedProducts: [], message: '' };
  };

  const shippingValidation = validateShippingScope();

  const handleRemoveRestrictedProducts = () => {
    const updatedCartItems = cartItems.filter(item => 
      item?.prdID?.shippingAddress?.type === 'nag_hamadi' && form.shippingAddressType === 'other_governorates' 
        ? false
        : true
    );
    dispatch(deleteCartItemThunk(updatedCartItems));
    navigate('/cart');
  };

  const handleRemoveItem = async (item) => {
    try {
      await dispatch(deleteCartItemThunk({ 
        variantId: item?.variantId?._id, 
        prdID: item?.prdID?._id 
      })).unwrap();
      
      // Fetch updated cart data
      await dispatch(getCartThunk());
      
      toast.success('تم حذف المنتج من السلة');
      
      // If cart is empty after removal, redirect to cart page
      if (cartItems.length === 1) { // Check for 1 since the current item is about to be removed
        navigate('/cart');
      }
    } catch (error) {
      toast.error('فشل في حذف المنتج من السلة');
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
              <form onSubmit={handleOrder} noValidate id="checkout-form">
                <div className="mb-3">
                  <label className="form-label">الاسم الأول *</label>
                  <input
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">العنوان *</label>
                  <select
                    name="shippingAddressType"
                    className={`form-select ${errors.shippingAddressType ? 'is-invalid' : ''}`}
                    value={form.shippingAddressType}
                    onChange={e => {
                      const value = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        shippingAddressType: value,
                        address: '',
                        city: value === 'nag_hamadi' ? 'نجع حمادي' : ''
                      }));
                    }}
                    required
                  >
                    <option value="nag_hamadi">نجع حمادي</option>
                    <option value="other_governorates">محافظة أخرى</option>
                  </select>
                  {errors.shippingAddressType && <div className="invalid-feedback">{errors.shippingAddressType}</div>}
                </div>

                {/* عرض أخطاء الشحن */}
                {errors.shipping && (
                  <div className="alert alert-danger mb-3">
                    <h6 className="fw-bold mb-2">⚠️ تحذير: مشكلة في نطاق الشحن</h6>
                    <p className="mb-2">{errors.shipping}</p>
                    {shippingValidation.restrictedProducts.length > 0 && (
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">المنتجات المحدودة النطاق:</h6>
                        <div className="border rounded p-3 bg-light">
                          {shippingValidation.restrictedProducts.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-2 p-2 border-bottom">
                              <img 
                                src={item?.prdID?.images?.[0]?.url || item?.prdID?.imageCover || "/images/Placeholder.png"} 
                                alt={item?.prdID?.name}
                                style={{ width: 40, height: 40, borderRadius: 4, marginLeft: 8 }}
                              />
                              <div className="flex-fill">
                                <span className="fw-bold">{item?.prdID?.name}</span>
                                <div className="text-danger small">
                                  🚚 متاح للشحن في نجع حمادي فقط
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={async () => {
                                  try {
                                    await dispatch(deleteCartItemThunk({ 
                                      variantId: item?.variantId?._id, 
                                      prdID: item?.prdID?._id 
                                    })).unwrap();
                                    toast.success('تم حذف المنتج من السلة');
                                    // Refresh the page to update cart items
                                    window.location.reload();
                                  } catch (error) {
                                    toast.error('فشل في حذف المنتج من السلة');
                                  }
                                }}
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            💡 يمكنك حذف هذه المنتجات من السلة أو تغيير العنوان إلى نجع حمادي
                          </small>
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm me-2"
                              onClick={async () => {
                                try {
                                  // Remove all restricted products
                                  for (const item of shippingValidation.restrictedProducts) {
                                    await dispatch(deleteCartItemThunk({ 
                                      variantId: item?.variantId?._id, 
                                      prdID: item?.prdID?._id 
                                    })).unwrap();
                                  }
                                  toast.success('تم حذف جميع المنتجات المحدودة النطاق من السلة');
                                  window.location.reload();
                                } catch (error) {
                                  toast.error('فشل في حذف المنتجات من السلة');
                                }
                              }}
                            >
                              حذف جميع المنتجات المحدودة
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {form.shippingAddressType === 'nag_hamadi' && (
                  <div className="mb-3">
                    <label className="form-label">تفاصيل العنوان في نجع حمادي *</label>
                    <input
                      name="address"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                )}
                {form.shippingAddressType === 'other_governorates' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">اسم المحافظة *</label>
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
                      <label className="form-label">تفاصيل العنوان *</label>
                      <input
                        name="address"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        value={form.address}
                        onChange={handleChange}
                        required
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                  </>
                )}
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
                {orderError && (
                  <div className="alert alert-danger mt-3">
                    {orderError}
                  </div>
                )}
                {orderSuccess && (
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
                  
                  {/* تحذير نطاق الشحن */}
                  {!shippingValidation.isValid && (
                    <div className="alert alert-warning mb-3">
                      <h6 className="fw-bold mb-1">⚠️ تحذير</h6>
                      <p className="mb-0 small">لا يمكن إتمام الطلب بسبب مشاكل في نطاق الشحن [احذف المنتج الغير المتاح للشحن لمتابعة شراء طلبك]</p>
                    </div>
                  )}
                  
                  {cartItems.map(item => (
                    <div className={`d-flex align-items-center mb-2 p-2 border-bottom ${
                      item?.prdID?.shippingAddress?.type === 'nag_hamadi' && form.shippingAddressType === 'other_governorates' ? 'bg-light' : ''
                      }`} 
                      key={item?.variantId ? item?.variantId._id : item?.prdID._id}
                    >
                      <img src={
                        item?.variantId && item?.variantId?.images && item?.variantId?.images[0]?.url
                          ? item.variantId.images[0].url
                          : item?.prdID?.images && item?.prdID?.images[0]?.url
                            ? item.prdID.images[0].url
                            : item?.prdID?.imageCover
                              ? item.prdID.imageCover
                              : '/images/Placeholder.png'
                      } alt={item?.prdID?.name} style={{ width: 54, height: 54, borderRadius: 8, marginLeft: 8 }} />
                      <div className="flex-fill">
                        <span className="fw-bold">{item?.prdID?.name}</span>
                        <div className="text-muted small">
                          الشحن: {item?.prdID?.shippingCost || 0} ج.م | التوصيل خلال {item?.prdID?.deliveryDays || 2} يوم
                        </div>
                        {item?.prdID?.shippingAddress?.type === 'nag_hamadi' && form.shippingAddressType === 'other_governorates' && (
                          <div className="text-danger small mt-1">
                            ⚠️ متاح للشحن في نجع حمادي فقط
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="ms-3">{item?.variantId ? item?.variantId?.price * item?.quantity : item?.prdID?.price * item?.quantity} ج.م</span>
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0 ms-2"
                          onClick={() => handleRemoveItem(item)}
                          style={{ textDecoration: 'none', backgroundColor: '#dc3545', padding: '4px', borderRadius: '50%' }}
                        >
                          <img src="/images/close.png" alt="حذف" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
                        </button>
                      </div>
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
                    <span>إجمالي الشحن:</span>
                    <span>{totalShipping} ج.م</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">الإجمالي الكلي:</span>
                    <span className="fw-bold text-danger">{finalTotal} ج.م</span>
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
                          {cardErrors.expiry && <div className="invalid-feedback mb-2">{cardErrors.expiry}</div>}
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
                          {cardErrors.cvv && <div className="invalid-feedback mb-2">{cardErrors.cvv}</div>}
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
                      {cardErrors.holder && <div className="invalid-feedback mb-2">{cardErrors.holder}</div>}
                    </div>
                  )}
                  {payment === "instapay" && (
                    <div className="mb-3 border rounded p-3 bg-light">
                      <h6 className="fw-bold mb-2">الدفع عبر Instapay</h6>
                      <div className="mb-2">رقم Instapay لتحويل المبلغ:</div>
                      <div className="alert alert-info fw-bold mb-2" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
                        {instapayNumber}
                      </div>
                      <div className="mb-2">
                        يرجى تحويل المبلغ إلى رقم Instapay أعلاه من خلال تطبيق Instapay على هاتفك، ثم رفع صورة (Screenshot) لإثبات التحويل.
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className={`form-control mb-2 ${errors.instapay ? 'is-invalid' : ''}`}
                        onChange={handleInstapayImage}
                      />
                      {errors.instapay && (
                        <div className="invalid-feedback mb-2">{errors.instapay}</div>
                      )}
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
                      {instapayStatus && (
                        <div className="alert alert-warning mt-3">{instapayStatus}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* زر تأكيد الطلب */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  {/* Display submit errors */}
                  {errors.submit && (
                    <div className="alert alert-danger mb-3">
                      <strong>خطأ في إتمام الطلب:</strong> {errors.submit}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    form="checkout-form"
                    className="btn btn-danger w-100 fw-bold py-3"
                    disabled={!shippingValidation.isValid || orderLoading}
                  >
                    {orderLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري إتمام الطلب...
                      </>
                    ) : (
                      'تأكيد الطلب'
                    )}
                  </button>
                  
                  {!shippingValidation.isValid && (
                    <div className="alert alert-warning mt-3 mb-0">
                      <small>
                        <strong>⚠️ لا يمكن إتمام الطلب:</strong> هناك منتجات خارج نطاق الشحن للمحافظة المحددة.
                        يرجى حذف هذه المنتجات أو تغيير العنوان إلى نجع حمادي.
                      </small>
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