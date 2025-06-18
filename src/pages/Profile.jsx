import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from '../components/ProtectedRoute';
import {
  getUserProfileThunk,
  updateUserProfileThunk,
  updateUserPasswordThunk,
  addAddressToBookThunk,
  getAddressToBookThunk,
  updateAddressToBookThunk,
  deleteAddressToBookThunk,
  addPaymentOptionsThunk,
  getPaymentOptionsThunk,
  updatePaymentOptionsThunk,
  deletePaymentOptionsThunk
} from "../services/Slice/userProfile/userProfile";
import { getOrdersThunk } from "../services/Slice/order/order";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.order);
  const { wishlist = [] } = useSelector((state) => state.wishlist || {});
  const { addresses, loading, error } = useSelector((state) => state.userProfile);
  const { paymentMethods } = useSelector((state) => state.userProfile);

  // دالة للتحقق من نوع المستخدم
  const isGoogleUser = () => {
    // التحقق من وجود token في localStorage
    const token = localStorage.getItem('token');
    const googleToken = localStorage.getItem('googleToken');
    
    // إذا كان لديه googleToken، فهو مستخدم Google
    if (googleToken) return true;
    
    // إذا كان لديه profileImg من Google، فهو مستخدم Google
    if (user?.profileImg?.startsWith('https://lh3.googleusercontent.com')) return true;
    
    // إذا كان لديه email من Google (عادة ينتهي بـ @gmail.com)
    if (user?.email?.endsWith('@gmail.com') && token) return true;
    
    return false;
  };

  // الملف الشخصي
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [input5, setInput5] = useState("");
  const [input6, setInput6] = useState("");
  const [input7, setInput7] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // دفتر العناوين
  const [localAddresses, setLocalAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: "", city: "", details: "" });
  const [editId, setEditId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [addressOperation, setAddressOperation] = useState(''); // 'add', 'update', 'delete'

  // خيارات الدفع
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [newPayment, setNewPayment] = useState({ cardType: "بطاقة ائتمان", cardNumber: "", cardholderName: "" });
  const [paymentTab, setPaymentTab] = useState("card");
  const [instapayNumber] = useState("01012345678");
  const [instapayImage, setInstapayImage] = useState(null);
  const [instapayStatus, setInstapayStatus] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentOperation, setPaymentOperation] = useState('');
  const [editPaymentId, setEditPaymentId] = useState(null);

  // المرتجعات والإلغاءات
  const [returns, setReturns] = useState([]);
  const [cancellations, setCancellations] = useState([]);

  // المفضلة
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);

  // Order Details Modal
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to mask card number
  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Get last 4 digits
    const lastFour = cardNumber.slice(-4);
    // Create mask with asterisks
    const mask = '*'.repeat(cardNumber.length - 4);
    return `${mask}${lastFour}`;
  };

  // Function to format card number with spaces
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Remove any non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setNewPayment({ ...newPayment, cardNumber: formatted });
  };

  useEffect(() => {
    dispatch(getUserProfileThunk());
    dispatch(getAddressToBookThunk()).unwrap()
      .then((result) => {
        if (result.status === 'success') {
          setLocalAddresses(result.data);
        }
      })
      .catch((error) => {
        setAddressError(error.message || 'حدث خطأ أثناء جلب العناوين');
      });

    // Fetch orders
    dispatch(getOrdersThunk()).unwrap()
      .then((result) => {
        if (result.status === 'success') {
          // Filter returns and cancellations
          const returnsList = result.orders.filter(order => order.status === 'cancelled');
          const cancellationsList = result.orders.filter(order => order.status === 'cancelled');
          setReturns(returnsList);
          setCancellations(cancellationsList);
        }
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setInput1(user.name?.split(' ')[0] || '');
      setInput2(user.name?.split(' ').slice(1).join(' ') || '');
      setInput3(user.email || '');
      setInput4(user.addresses?.[0] || '');
      // تحديث صورة البروفايل
      if (user.profileImg) {
        let imageUrl;
        // إذا كانت صورة Google، استخدمها مباشرة
        if (user.profileImg.startsWith('https://lh3.googleusercontent.com')) {
          imageUrl = user.profileImg;
        } else if (user.profileImg.startsWith('http')) {
          imageUrl = user.profileImg;
        } else {
          imageUrl = `${process.env.REACT_APP_API_URL}${user.profileImg}`;
        }
        setImagePreview(imageUrl);
        console.log("🖼️ Profile image URL:", imageUrl);
      }
    }
  }, [user]);

  useEffect(() => {
    // Fetch payment options when component mounts
    dispatch(getPaymentOptionsThunk()).unwrap()
      .then((result) => {
        if (result.status === 'success') {
          setPaymentOptions(result.data);
        }
      })
      .catch((error) => {
        setPaymentError(error.message || 'حدث خطأ أثناء جلب خيارات الدفع');
      });
  }, [dispatch]);

  // Helper function to get status badge class and text
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { class: 'bg-warning', text: 'قيد الانتظار' };
      case 'processing':
        return { class: 'bg-info', text: 'قيد المعالجة' };
      case 'shipped':
        return { class: 'bg-primary', text: 'تم الشحن' };
      case 'delivered':
        return { class: 'bg-success', text: 'تم التوصيل' };
      case 'cancelled':
        return { class: 'bg-danger', text: 'ملغي' };
      default:
        return { class: 'bg-secondary', text: status };
    }
  };

  // دوال دفتر العناوين
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.city || !newAddress.details) {
      setAddressError("جميع الحقول مطلوبة");
      return;
    }

    setAddressLoading(true);
    setAddressError(null);
    setAddressSuccess(false);
    setAddressOperation('add');

    try {
      const result = await dispatch(addAddressToBookThunk(newAddress)).unwrap();

      if (result.status === 'success') {
        setAddressSuccess(true);
        // Refresh addresses
        const addressesResult = await dispatch(getAddressToBookThunk()).unwrap();
        if (addressesResult.status === 'success') {
          setLocalAddresses(addressesResult.data);
        }
        setNewAddress({ label: "", city: "", details: "" });
      }
    } catch (error) {
      setAddressError(error.message || 'حدث خطأ أثناء إضافة العنوان');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditId(address._id);
    setNewAddress({
      label: address.label,
      city: address.city,
      details: address.details
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.city || !newAddress.details) {
      setAddressError("جميع الحقول مطلوبة");
      return;
    }

    setAddressLoading(true);
    setAddressError(null);
    setAddressSuccess(false);
    setAddressOperation('update');

    try {
      const result = await dispatch(updateAddressToBookThunk({
        _id: editId,
        ...newAddress
      })).unwrap();

      if (result.status === 'success') {
        setAddressSuccess(true);
        // Refresh addresses
        const addressesResult = await dispatch(getAddressToBookThunk()).unwrap();
        if (addressesResult.status === 'success') {
          setLocalAddresses(addressesResult.data);
        }
        setEditId(null);
        setNewAddress({ label: "", city: "", details: "" });
      }
    } catch (error) {
      setAddressError(error.message || 'حدث خطأ أثناء تحديث العنوان');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      return;
    }

    setAddressLoading(true);
    setAddressError(null);
    setAddressSuccess(false);
    setAddressOperation('delete');

    try {
      const result = await dispatch(deleteAddressToBookThunk({ _id: id })).unwrap();

      if (result.status === 'success') {
        setAddressSuccess(true);
        // Refresh addresses
        const addressesResult = await dispatch(getAddressToBookThunk()).unwrap();
        if (addressesResult.status === 'success') {
          setLocalAddresses(addressesResult.data);
        }
      }
    } catch (error) {
      setAddressError(error.message || 'حدث خطأ أثناء حذف العنوان');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setNewAddress({ label: "", city: "", details: "" });
    setAddressError(null);
    setAddressSuccess(false);
  };

  // دوال الدفع
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.cardNumber || !newPayment.cardholderName) {
      setPaymentError("جميع الحقول مطلوبة");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentOperation('add');

    try {
      const result = await dispatch(addPaymentOptionsThunk(newPayment)).unwrap();

      if (result.status === 'success') {
        setPaymentSuccess(true);
        // Refresh payment options
        const paymentResult = await dispatch(getPaymentOptionsThunk()).unwrap();
        if (paymentResult.status === 'success') {
          setPaymentOptions(paymentResult.data);
        }
        setNewPayment({ cardType: "بطاقة ائتمان", cardNumber: "", cardholderName: "" });
      }
    } catch (error) {
      setPaymentError(error.message || 'حدث خطأ أثناء إضافة خيار الدفع');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleEditPayment = (payment) => {
    setEditPaymentId(payment._id);
    setNewPayment({
      cardType: payment.cardType,
      cardNumber: payment.cardNumber,
      cardholderName: payment.cardholderName
    });
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!newPayment.cardNumber || !newPayment.cardholderName) {
      setPaymentError("جميع الحقول مطلوبة");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentOperation('update');

    try {
      const result = await dispatch(updatePaymentOptionsThunk({
        _id: editPaymentId,
        ...newPayment
      })).unwrap();

      if (result.status === 'success') {
        setPaymentSuccess(true);
        // Refresh payment options
        const paymentResult = await dispatch(getPaymentOptionsThunk()).unwrap();
        if (paymentResult.status === 'success') {
          setPaymentOptions(paymentResult.data);
        }
        setEditPaymentId(null);
        setNewPayment({ cardType: "بطاقة ائتمان", cardNumber: "", cardholderName: "" });
      }
    } catch (error) {
      setPaymentError(error.message || 'حدث خطأ أثناء تحديث خيار الدفع');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف خيار الدفع هذا؟')) {
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentOperation('delete');

    try {
      const result = await dispatch(deletePaymentOptionsThunk({ _id: id })).unwrap();

      if (result.status === 'success') {
        setPaymentSuccess(true);
        // Refresh payment options
        const paymentResult = await dispatch(getPaymentOptionsThunk()).unwrap();
        if (paymentResult.status === 'success') {
          setPaymentOptions(paymentResult.data);
        }
      }
    } catch (error) {
      setPaymentError(error.message || 'حدث خطأ أثناء حذف خيار الدفع');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelPaymentEdit = () => {
    setEditPaymentId(null);
    setNewPayment({ cardType: "بطاقة ائتمان", cardNumber: "", cardholderName: "" });
    setPaymentError(null);
    setPaymentSuccess(false);
  };

  // Instapay
  const handleInstapayImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setInstapayImage(e.target.files[0]);
      setInstapayStatus("بانتظار تأكيد الإدارة...");
    }
  };

  // دوال المفضلة
  const handleRemoveWishlist = async (id) => {
    // Implement remove from wishlist functionality when available
    alert("سيتم إضافة خاصية الحذف من المفضلة قريباً");
  };

  const handleAddToCart = async (id) => {
    // Implement add to cart functionality when available
    alert("سيتم إضافة خاصية إضافة إلى السلة قريباً");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', `${input1} ${input2}`.trim());
      formData.append('email', input3);
      if (profileImage) {
        formData.append('profileImg', profileImage);
      }
      if (input4) {
        formData.append("addresses", input4)
      }

      console.log('📤 Sending profile update with data:', {
        name: `${input1} ${input2}`.trim(),
        email: input3,
        hasImage: !!profileImage,
        address: input4
      });

      const result = await dispatch(updateUserProfileThunk(formData)).unwrap();

      if (result.status === 'success') {
        setUpdateSuccess(true);
        // Refresh profile data
        await dispatch(getUserProfileThunk());
        // Reset form state
        setProfileImage(null);
        console.log('✅ Profile updated successfully');
      }
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      setUpdateError(error.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (input6 !== input7) {
      setPasswordError("كلمات المرور غير متطابقة");
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await dispatch(updateUserPasswordThunk({
        currentPassword: input5,
        newPassword: input6
      })).unwrap();

      if (result.status === 'success') {
        setPasswordSuccess(true);
        // Reset password fields
        setInput5('');
        setInput6('');
        setInput7('');
      }
    } catch (error) {
      setPasswordError(error.message || 'حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // محتوى كل قسم
  const renderSection = () => {
    if (loading) {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center text-danger">
            {error}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="fw-bold text-danger mb-4">تعديل الملف الشخصي</h4>
              {updateSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  تم تحديث الملف الشخصي بنجاح
                  <button type="button" className="btn-close" onClick={() => setUpdateSuccess(false)}></button>
                </div>
              )}
              {updateError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {updateError}
                  <button type="button" className="btn-close" onClick={() => setUpdateError(null)}></button>
                </div>
              )}
              <div className="text-center mb-4">
                <div
                  className="position-relative d-inline-block"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="position-relative rounded-circle overflow-hidden"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <img
                      src={imagePreview || (user?.profileImg ? (() => {
                        if (user.profileImg.startsWith('https://lh3.googleusercontent.com')) {
                          return user.profileImg;
                        } else if (user.profileImg.startsWith('http')) {
                          return user.profileImg;
                        } else {
                          return `${process.env.REACT_APP_API_URL}${user.profileImg}`;
                        }
                      })() : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740')}
                      alt="صورة الملف الشخصي"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740';
                      }}
                    />
                    {!isGoogleUser() && (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50 text-white"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        onClick={() => document.getElementById('profileImage').click()}
                      >
                        <i className="fas fa-camera mb-2" style={{ fontSize: '1.5rem' }}></i>
                        <span style={{ fontSize: '0.9rem' }}>تغيير الصورة</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                    disabled={isGoogleUser()}
                  />
                </div>
              </div>
              <form onSubmit={handleProfileUpdate}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label">الاسم الأول</label>
                    <input type="text" className="form-control" value={input1} onChange={e => setInput1(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">الاسم الأخير</label>
                    <input type="text" className="form-control" value={input2} onChange={e => setInput2(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label">البريد الإلكتروني</label>
                    <input type="email" className="form-control" value={input3} onChange={e => setInput3(e.target.value)} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">العنوان</label>
                    <input type="text" className="form-control" value={input4} onChange={e => setInput4(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => {
                    setInput1(user?.name?.split(' ')[0] || '');
                    setInput2(user?.name?.split(' ').slice(1).join(' ') || '');
                    setInput3(user?.email || '');
                    setImagePreview(user?.profileImg);
                    setProfileImage(null);
                  }}>إلغاء</button>
                  <button
                    type="submit"
                    className="btn btn-danger fw-bold"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري الحفظ...
                      </>
                    ) : 'حفظ التغييرات'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case "password":
        return (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="fw-bold text-danger mb-4">تغيير كلمة المرور</h4>
              {passwordSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  تم تغيير كلمة المرور بنجاح
                  <button type="button" className="btn-close" onClick={() => setPasswordSuccess(false)}></button>
                </div>
              )}
              {passwordError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {passwordError}
                  <button type="button" className="btn-close" onClick={() => setPasswordError(null)}></button>
                </div>
              )}
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    className="form-control mb-2"
                    value={input5}
                    onChange={e => setInput5(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control mb-2"
                    value={input6}
                    onChange={e => setInput6(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control"
                    value={input7}
                    onChange={e => setInput7(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setInput5('');
                      setInput6('');
                      setInput7('');
                      setPasswordError(null);
                      setPasswordSuccess(false);
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger fw-bold"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري التحديث...
                      </>
                    ) : 'تغيير كلمة المرور'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case "address":
        return (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="fw-bold text-primary mb-4">دفتر العناوين</h4>
              {addressSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {addressOperation === 'add' && 'تم إضافة العنوان بنجاح'}
                  {addressOperation === 'update' && 'تم تحديث العنوان بنجاح'}
                  {addressOperation === 'delete' && 'تم حذف العنوان بنجاح'}
                  <button type="button" className="btn-close" onClick={() => {
                    setAddressSuccess(false);
                    setAddressOperation('');
                  }}></button>
                </div>
              )}
              {addressError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {addressError}
                  <button type="button" className="btn-close" onClick={() => setAddressError(null)}></button>
                </div>
              )}
              <ul className="list-group mb-4">
                {localAddresses.map(addr => (
                  <li key={addr._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{addr.label} - {addr.city}</div>
                      <div className="text-muted small">{addr.details}</div>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditAddress(addr)}
                        disabled={addressLoading}
                      >
                        تعديل
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteAddress(addr._id)}
                        disabled={addressLoading}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <form onSubmit={editId ? handleUpdateAddress : handleAddAddress} className="row g-2 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">اسم العنوان</label>
                  <input
                    className="form-control"
                    value={newAddress.label}
                    onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="مثال: المنزل"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">المدينة</label>
                  <input
                    className="form-control"
                    value={newAddress.city}
                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="مثال: القاهرة"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">تفاصيل العنوان</label>
                  <input
                    className="form-control"
                    value={newAddress.details}
                    onChange={e => setNewAddress({ ...newAddress, details: e.target.value })}
                    placeholder="مثال: شارع التحرير"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <div className="d-flex gap-2">
                    {editId && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={handleCancelEdit}
                        disabled={addressLoading}
                      >
                        إلغاء
                      </button>
                    )}
                    <button
                      className="btn btn-success flex-grow-1"
                      type="submit"
                      disabled={addressLoading}
                    >
                      {addressLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : editId ? "تحديث" : "إضافة"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="fw-bold text-primary mb-4">خيارات الدفع</h4>
              {paymentSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {paymentOperation === 'add' && 'تم إضافة خيار الدفع بنجاح'}
                  {paymentOperation === 'update' && 'تم تحديث خيار الدفع بنجاح'}
                  {paymentOperation === 'delete' && 'تم حذف خيار الدفع بنجاح'}
                  <button type="button" className="btn-close" onClick={() => {
                    setPaymentSuccess(false);
                    setPaymentOperation('');
                  }}></button>
                </div>
              )}
              {paymentError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {paymentError}
                  <button type="button" className="btn-close" onClick={() => setPaymentError(null)}></button>
                </div>
              )}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button className={`nav-link${paymentTab === "card" ? " active" : ""}`} onClick={() => setPaymentTab("card")}>بطاقة فيزا/ماستر كارد</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link${paymentTab === "instapay" ? " active" : ""}`} onClick={() => setPaymentTab("instapay")}>الدفع عبر Instapay</button>
                </li>
              </ul>
              {paymentTab === "card" && (
                <>
                  <ul className="list-group mb-4">
                    {paymentOptions.map(pay => (
                      <li key={pay._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{pay.cardType}</div>
                          <div className="text-muted small">{maskCardNumber(pay.cardNumber)} - {pay.cardholderName}</div>
                        </div>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditPayment(pay)}
                            disabled={paymentLoading}
                          >
                            تعديل
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeletePayment(pay._id)}
                            disabled={paymentLoading}
                          >
                            حذف
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={editPaymentId ? handleUpdatePayment : handleAddPayment} className="row g-2 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label">نوع البطاقة</label>
                      <select
                        className="form-select"
                        value={newPayment.cardType}
                        onChange={e => setNewPayment({ ...newPayment, cardType: e.target.value })}
                      >
                        <option>بطاقة ائتمان</option>
                        <option>بطاقة خصم</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">رقم البطاقة</label>
                      <input
                        className="form-control"
                        value={newPayment.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 1234 5678"
                        required
                        maxLength="19" // 16 digits + 3 spaces
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">اسم حامل البطاقة</label>
                      <input
                        className="form-control"
                        value={newPayment.cardholderName}
                        onChange={e => setNewPayment({ ...newPayment, cardholderName: e.target.value })}
                        placeholder="احمد كمال"
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex gap-2">
                        {editPaymentId && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary flex-grow-1"
                            onClick={handleCancelPaymentEdit}
                            disabled={paymentLoading}
                          >
                            إلغاء
                          </button>
                        )}
                        <button
                          className="btn btn-success flex-grow-1"
                          type="submit"
                          disabled={paymentLoading}
                        >
                          {paymentLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : editPaymentId ? "تحديث" : "إضافة"}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
              {paymentTab === "instapay" && (
                <div className="border rounded p-4 bg-light">
                  <h5 className="fw-bold mb-3">الدفع عبر Instapay</h5>
                  <div className="mb-2">رقم Instapay لتحويل المبلغ:</div>
                  <div className="alert alert-info fw-bold mb-3" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>{instapayNumber}</div>
                  <div className="mb-3">يرجى تحويل المبلغ إلى رقم Instapay أعلاه من خلال تطبيق Instapay على هاتفك، ثم رفع صورة (Screenshot) لإثبات التحويل.</div>
                  <input type="file" accept="image/*" className="form-control mb-2" onChange={handleInstapayImage} />
                  {instapayImage && (
                    <div className="mb-2">
                      <span className="text-success">تم رفع الصورة بنجاح!</span>
                      <div className="mt-2"><img src={URL.createObjectURL(instapayImage)} alt="إثبات التحويل" style={{ maxWidth: 200, borderRadius: 8 }} /></div>
                    </div>
                  )}
                  {instapayStatus && <div className="alert alert-warning mt-3">{instapayStatus}</div>}
                </div>
              )}
            </div>
          </div>
        );
      case "returns":
      case "cancellations":
        return (
          <>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold text-primary mb-4">{activeSection === "returns" ? "المرتجعات" : "الإلغاءات"}</h4>
                {ordersLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                  </div>
                ) : ordersError ? (
                  <div className="alert alert-danger">
                    {ordersError}
                  </div>
                ) : (
                  <>
                    {activeSection === "returns" && returns.length === 0 && (
                      <div className="text-center py-4">
                        <i className="fas fa-undo text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                        <h5 className="text-muted">لا توجد مرتجعات</h5>
                      </div>
                    )}
                    {activeSection === "cancellations" && cancellations.length === 0 && (
                      <div className="text-center py-4">
                        <i className="fas fa-times-circle text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                        <h5 className="text-muted">لا توجد إلغاءات</h5>
                      </div>
                    )}
                    {(activeSection === "returns" ? returns : cancellations).length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-bordered text-center">
                          <thead className="table-light">
                            <tr>
                              <th>رقم الطلب</th>
                              <th>التاريخ</th>
                              <th>المبلغ</th>
                              <th>الحالة</th>
                              <th>التفاصيل</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(activeSection === "returns" ? returns : cancellations).map(order => {
                              const statusBadge = getStatusBadge(order.status);
                              return (
                                <tr key={order._id}>
                                  <td>#{order._id.slice(-6)}</td>
                                  <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                                  <td>{order.total} ج.م</td>
                                  <td>
                                    <span className={`badge ${statusBadge.class}`}>
                                      {statusBadge.text}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleShowOrderDetails(order)}
                                    >
                                      عرض التفاصيل
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">تفاصيل الطلب #{selectedOrder._id.slice(-6)}</h5>
                      <button type="button" className="btn-close" onClick={handleCloseOrderDetails}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h6 className="fw-bold mb-3">معلومات الطلب</h6>
                          <p className="mb-2">
                            <span className="text-muted">التاريخ:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('ar-EG')}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">الحالة:</span>
                            <span className={`badge ${getStatusBadge(selectedOrder.status).class} ms-2`}>
                              {getStatusBadge(selectedOrder.status).text}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">المبلغ الإجمالي:</span> {selectedOrder.total} ج.م
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">طريقة الدفع:</span> {
                              selectedOrder.paymentMethod === 'paypal' ? 'باي بال' :
                                selectedOrder.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' :
                                  selectedOrder.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' :
                                    selectedOrder.paymentMethod
                            }
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">حالة الدفع:</span> {
                              selectedOrder.paymentStatus === 'pending' ? 'قيد الانتظار' :
                                selectedOrder.paymentStatus === 'paid' ? 'تم الدفع' :
                                  selectedOrder.paymentStatus
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-bold mb-3">معلومات الشحن</h6>
                          <p className="mb-2">
                            <span className="text-muted">الاسم:</span> {selectedOrder.name}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">البريد الإلكتروني:</span> {selectedOrder.email}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">رقم الهاتف:</span> {selectedOrder.phone}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">العنوان:</span> {selectedOrder.address}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">المدينة:</span> {selectedOrder.city}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">الرمز البريدي:</span> {selectedOrder.postalCode}
                          </p>
                          <p className="mb-2">
                            <span className="text-muted">الدولة:</span> {selectedOrder.country}
                          </p>
                        </div>
                      </div>

                      {selectedOrder.image && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">صورة إثبات الدفع</h6>
                          <img
                            src={selectedOrder.image}
                            alt="إثبات الدفع"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                      )}

                      <h6 className="fw-bold mb-3">المنتجات</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>المنتج</th>
                              <th>السعر</th>
                              <th>الكمية</th>
                              <th>المجموع</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.cartItems?.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '10px' }}
                                    />
                                    <div>
                                      <div>{item.name}</div>
                                      {item.variantId && (
                                        <small className="text-muted">(متغير)</small>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>{item.price} ج.م</td>
                                <td>{item.quantity}</td>
                                <td>{item.price * item.quantity} ج.م</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" className="text-start fw-bold">المجموع الكلي</td>
                              <td className="fw-bold">{selectedOrder.total} ج.م</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseOrderDetails}>إغلاق</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "حسابي", to: "/profile" }
          ]} />
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="list-group mb-4 shadow-sm">
                <div className="list-group-item fw-bold bg-light">إدارة حسابي</div>
                <button className={`list-group-item list-group-item-action${activeSection === "profile" ? " text-danger active" : ""}`} onClick={() => setActiveSection("profile")}>الملف الشخصي</button>
                {!isGoogleUser() && (
                  <button className={`list-group-item list-group-item-action${activeSection === "password" ? " text-danger active" : ""}`} onClick={() => setActiveSection("password")}>تغيير كلمة المرور</button>
                )}
                <button className={`list-group-item list-group-item-action${activeSection === "address" ? " active" : ""}`} onClick={() => setActiveSection("address")}>دفتر العناوين</button>
                <button className={`list-group-item list-group-item-action${activeSection === "payment" ? " active" : ""}`} onClick={() => setActiveSection("payment")}>خيارات الدفع</button>
                <div className="list-group-item fw-bold bg-light mt-3">طلباتي</div>
                <button className={`list-group-item list-group-item-action${activeSection === "returns" ? " active" : ""}`} onClick={() => setActiveSection("returns")}>المرتجعات</button>
                <button className={`list-group-item list-group-item-action${activeSection === "cancellations" ? " active" : ""}`} onClick={() => setActiveSection("cancellations")}>الإلغاءات</button>
              </div>
            </div>
            {/* Main Section */}
            <div className="col-lg-9">
              {renderSection()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 