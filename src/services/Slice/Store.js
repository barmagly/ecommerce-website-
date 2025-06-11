import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth";
import categorieSlice from "./categorie/categorie";
import productSlice from "./product/product";
import userProfileSlice from "./userProfile/userProfile";
import userWishlistSlice from "./wishlist/wishlist";
import cartSlice from "./cart/cart";
import orderSlice from "./order/order";
import variantSlice from "./variant/variant";
import reviewSlice from "./review/review";

const Store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        categorie: categorieSlice.reducer,
        product: productSlice.reducer,
        userProfile: userProfileSlice,
        userWishlist:userWishlistSlice.reducer,
        userCart:cartSlice.reducer,
        order:orderSlice.reducer,
        variant:variantSlice.reducer,
        reviews:reviewSlice.reducer
    }
});

export default Store;