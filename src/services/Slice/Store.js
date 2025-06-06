import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth";
import categorieSlice from "./categorie/categorie";
import productSlice from "./product/product";
import userProfileSlice from "./userProfile/userProfile";
import userWishlistSlice from "./wishlist/wishlist";
import cartSlice from "./cart/cart";

const Store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        categorie: categorieSlice.reducer,
        product: productSlice.reducer,
        userProfile: userProfileSlice,
        userWishlist:userWishlistSlice.reducer,
        userCart:cartSlice.reducer,
    }
});

export default Store;