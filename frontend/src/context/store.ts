import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: { auth: authSlice },
});
export type { AppDispatch, RootState } from "@/types/store";

export default store;
