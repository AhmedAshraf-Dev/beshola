import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentRow: {}, //payment like paypal
  },
  reducers: {
    updatePayment: (state, action) => {
      state.paymentRow = action.payload.paymentRow;
    },
  },
});
export const { updatePayment } = paymentSlice.actions;

export default paymentSlice.reducer;
