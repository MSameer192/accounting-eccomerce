import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import usersSlice from "../features/settings/profilesettings/profileSlice";
import productsSlice from "../features/products/productSlice";
import categoriesSlice from "../features/category/categorySlice";
import cashSlice from "../features/cash/cashSlice";
import purchaseOrderSlice from "../features/purchaseOrder/purchaseOrderSlice";
import orderSlice from "../features/orders/orderSlice";
import customerSlice from "../features/customers/customerSlice";
import supplierSlice from "../features/suppliers/supplierSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  user: usersSlice,
  product: productsSlice,
  category: categoriesSlice,
  cash: cashSlice,
  purchaseOrder: purchaseOrderSlice,
  order: orderSlice,
  customer: customerSlice,
  supplier: supplierSlice,
};

export default configureStore({
  reducer: combinedReducer,
});
