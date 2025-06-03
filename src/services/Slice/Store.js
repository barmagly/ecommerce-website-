import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth";

const Store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    }
});

export default Store;