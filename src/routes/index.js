// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));
const Products = lazy(() => import("../pages/protected/Products"));
const Orders = lazy(() => import("../pages/protected/Orders"));
const Customers = lazy(() => import("../pages/protected/Customers"));
const Suppliers = lazy(() => import("../pages/protected/Suppliers"));
const PurchaseOrder = lazy(() => import("../pages/protected/PurchaseOrder"));
const PurchaseOrderForm = lazy(() =>
  import("../pages/protected/PurchaseOrderForm")
);
const SaleOrder = lazy(() => import("../pages/protected/SaleOrder"));
const SaleOrderForm = lazy(() => import("../pages/protected/SaleOrderForm"));
const Sale = lazy(() => import("../pages/protected/Sale"));
const Category = lazy(() => import("../pages/protected/Category"));
const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Cash = lazy(() => import("../pages/protected/Cash"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/welcome", // the url
    component: Welcome, // view rendered
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/sale",
    component: Sale,
  },
  {
    path: "/category",
    component: Category,
  },
  {
    path: "/purchase-order",
    component: PurchaseOrder,
  },
  {
    path: "/purchase-order/form",
    component: PurchaseOrderForm,
  },
  {
    path: "/sale-order",
    component: SaleOrder,
  },
  {
    path: "/sale-order/form",
    component: SaleOrderForm,
  },
  {
    path: "/order",
    component: Orders,
  },
  {
    path: "/customer",
    component: Customers,
  },
  {
    path: "/supplier",
    component: Suppliers,
  },
  {
    path: "/calendar",
    component: Calendar,
  },
  {
    path: "/cash",
    component: Cash,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },

  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
