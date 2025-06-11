import Store from '../services/Slice/Store';
import { toast } from 'react-toastify';

export const checkAuthAndRedirect = (navigate) => {
    const state = Store.getState();
    const token = localStorage.getItem('token');
    if (!token) {
        toast.info(
            <div className="d-flex align-items-center gap-2">
                <i className="fas fa-info-circle"></i>
                <span>يرجى تسجيل الدخول أولاً</span>
            </div>, {
            position: "top-center",
            rtl: true,
            autoClose: 3000,
            className: 'custom-toast',
            bodyClassName: 'custom-toast-body',
            progressClassName: 'custom-toast-progress'
        });
        navigate('/login');
        return false;
    }
    return true;
};

export const handleAddToCart = (dispatch, addToCartAction, product,navigate=null) => {
    if (checkAuthAndRedirect(navigate)) {
        dispatch(addToCartAction(product))
            .unwrap()
            .then(() => {
                toast.success(
                    <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-shopping-cart"></i>
                        <span>تمت إضافة المنتج إلى السلة بنجاح</span>
                    </div>, {
                    position: "top-center",
                    rtl: true,
                    autoClose: 2000,
                    className: 'custom-toast',
                    bodyClassName: 'custom-toast-body',
                    progressClassName: 'custom-toast-progress'
                });
            })
            .catch((error) => {
                toast.error(
                    <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error || 'حدث خطأ أثناء إضافة المنتج إلى السلة'}</span>
                    </div>, {
                    position: "top-center",
                    rtl: true,
                    autoClose: 3000,
                    className: 'custom-toast',
                    bodyClassName: 'custom-toast-body',
                    progressClassName: 'custom-toast-progress'
                });
            });
    }
};

export const handleAddToWishlist = (dispatch, addToWishlistAction, product, navigate=null) => {
    if (checkAuthAndRedirect(navigate)) {
        dispatch(addToWishlistAction(product))
            .unwrap()
            .then(() => {
                toast.success(
                    <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-heart"></i>
                        <span>تمت إضافة المنتج إلى المفضلة بنجاح</span>
                    </div>, {
                    position: "top-center",
                    rtl: true,
                    autoClose: 2000,
                    className: 'custom-toast',
                    bodyClassName: 'custom-toast-body',
                    progressClassName: 'custom-toast-progress'
                });
            })
            .catch((error) => {
                toast.error(
                    <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error || 'حدث خطأ أثناء إضافة المنتج إلى المفضلة'}</span>
                    </div>, {
                    position: "top-center",
                    rtl: true,
                    autoClose: 3000,
                    className: 'custom-toast',
                    bodyClassName: 'custom-toast-body',
                    progressClassName: 'custom-toast-progress'
                });
            });
    }
}; 