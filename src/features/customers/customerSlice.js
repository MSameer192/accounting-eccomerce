import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import instance from "../../utils/axios-config";

export const getCustomersContent = createAsyncThunk(
  "/customers/content",
  async () => {
    const userId = localStorage.getItem("userId");
    const response = await instance.get(process.env.REACT_APP_BASE_URL + `/customer`);
    return response.data;
  }
);

export const customersSlice = createSlice({
  name: "customers",
  initialState: {
    isLoading: false,
    customers: [],
  },
  reducers: {
    addNewCustomer: (state, action) => {
      state.customers.unshift(action.payload);
      // let {newOrderObj} = action.payload
      // state.orders = [...state.orders, action.payload]
    },

    deleteCustomer: (state, action) => {
      let { index } = action.payload;
      state.customers.splice(index, 1);
    },

    updateNewCustomer: (state, action) => {
      let { data, index } = action.payload;
      state.customers[index] = data;
    },
  },

  extraReducers: {
    [getCustomersContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getCustomersContent.fulfilled]: (state, action) => {
      state.customers = action.payload.data;
      state.isLoading = false;
    },
    [getCustomersContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewCustomer, deleteCustomer, updateNewCustomer } =
  customersSlice.actions;

export default customersSlice.reducer;
