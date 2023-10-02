import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import instance from "../../utils/axios-config";

export const getSuppliersContent = createAsyncThunk(
  "/suppliers/content",
  async () => {
    const userId = localStorage.getItem("userId");
    const response = await instance.get(
      process.env.REACT_APP_BASE_URL + `/supplier`
    );
    return response.data;
  }
);

export const suppliersSlice = createSlice({
  name: "suppliers",
  initialState: {
    isLoading: false,
    suppliers: [],
  },
  reducers: {
    addNewSupplier: (state, action) => {
      state.suppliers.unshift(action.payload);
      // let {newOrderObj} = action.payload
      // state.orders = [...state.orders, action.payload]
    },

    deleteSupplier: (state, action) => {
      let { index } = action.payload;
      state.suppliers.splice(index, 1);
    },

    updateNewSupplier: (state, action) => {
      let { data, index } = action.payload;
      state.suppliers[index] = data;
    },
  },

  extraReducers: {
    [getSuppliersContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getSuppliersContent.fulfilled]: (state, action) => {
      state.suppliers = action.payload.data;
      state.isLoading = false;
    },
    [getSuppliersContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewSupplier, deleteSupplier, updateNewSupplier } =
  suppliersSlice.actions;

export default suppliersSlice.reducer;
