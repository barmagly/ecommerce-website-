import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth";
import categorieSlice from "./categorie/categorie";
import productSlice from "./product/product";

const Store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        categorie: categorieSlice.reducer,
        product: productSlice.reducer,
    }
});

export default Store;