import Store from '../services/Slice/Store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const checkAuthAndRedirect = (navigate) => {
    const state = Store.getState();
    const token = localStorage.getItem('token');
    if (!token) {
        toast.info('يرجى تسجيل الدخول أولاً', {
            position: "top-center",
            rtl: true,
            autoClose: 3000
        });
        navigate('/login');
        return false;
    }
    return true;
};

export const handleAddToCart = (dispatch, addToCartAction, product, navigate) => {
    if (checkAuthAndRedirect(navigate)) {
        dispatch(addToCartAction(product))
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
    }
};

export const handleAddToWishlist = (dispatch, addToWishlistAction, product, navigate) => {
    if (checkAuthAndRedirect(navigate)) {
        dispatch(addToWishlistAction(product))
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
    }
}; 