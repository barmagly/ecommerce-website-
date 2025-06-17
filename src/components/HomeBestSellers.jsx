import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserWishlistThunk } from "../services/Slice/wishlist/wishlist";
import { addToCartThunk } from "../services/Slice/cart/cart";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AutoScrollProducts from './AutoScrollProducts';

export default function HomeBestSellers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.userWishlist);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('يرجى تسجيل الدخول لإضافة المنتج إلى المفضلة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      navigate('/login');
      return;
    }
    dispatch(addUserWishlistThunk({ prdId: productId }))
      .unwrap()
      .then(() => {
        toast.success('تمت إضافة المنتج إلى المفضلة', {
          position: "top-center",
          rtl: true,
          autoClose: 2000
        });
      })
      .catch((error) => {
        toast.error(error || 'حدث خطأ أثناء إضافة المنتج إلى المفضلة', {
          position: "top-center",
          rtl: true,
          autoClose: 3000
        });
      });
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('يرجى تسجيل الدخول لإضافة المنتج إلى السلة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      navigate('/login');
      return;
    }
    dispatch(addToCartThunk({ productId }))
      .unwrap()
      .then(() => {
        toast.success('تمت إضافة المنتج إلى السلة', {
          position: "top-center",
          rtl: true,
          autoClose: 2000
        });
      })
      .catch((error) => {
        toast.error(error || 'حدث خطأ أثناء إضافة المنتج إلى السلة', {
          position: "top-center",
          rtl: true,
          autoClose: 3000
        });
      });
  };

  const bestSellersProducts = [
    {
      name: 'سماعة بلوتوث لاسلكية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 100,
      rating: 4.5,
      reviews: 65,
      discount: 20
    },
    {
      name: 'كاميرا رقمية احترافية',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ow1asxpu_expires_30_days.png',
      price: 1500,
      rating: 4.8,
      reviews: 120,
      discount: 15
    },
    {
      name: 'ساعة ذكية متطورة',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/xyefcjfb_expires_30_days.png',
      price: 300,
      rating: 4.3,
      reviews: 89,
      discount: 10
    },
    {
      name: 'حاسوب محمول للألعاب',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 2000,
      rating: 4.9,
      reviews: 45,
      discount: 5
    },
    {
      name: 'هاتف ذكي حديث',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
      price: 800,
      rating: 4.7,
      reviews: 156,
      discount: 25
    },
    {
      name: 'طابعة ليزر سريعة',
      image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
      price: 250,
      rating: 4.6,
      reviews: 78,
      discount: 12
    }
  ];

  return (
    <div className="bestsellers-section">
      <AutoScrollProducts 
        products={bestSellersProducts}
        title="أفضل المنتجات"
        subtitle="المنتجات الأكثر مبيعاً"
        showDiscount={true}
      />
    </div>
  );
} 