import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import AddItemPage from "./pages/AddItemPage.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import ItemPage from "./pages/ItemPage.tsx";
import Error from "./components/Error.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import ItemCheckout from "./pages/ItemCheckout.tsx";
import MyOrdersPage from "./pages/MyOrdersPage.tsx";
import AdminOrdersPage from "./components/admin/AdminOrdersPage.tsx";
import AdminPage from "./components/admin/AdminPage.tsx";
import OrderProcessing from "./components/admin/OrderProcessing.tsx";
import AdminForm from "./components/admin/ManageRetailernDelivery.tsx";
import RetailerRegistration from "./pages/RetailerRegistration.tsx";
import AdminApprovalPage from "./components/admin/AdminApprovalPage.tsx";
import DeliveryBoyRegistration from "./pages/DeliveryBoyRegistration.tsx";
import RetailerOrderPage from "./pages/RetailerOrderPage.tsx";
import PartnerLogin from "./components/PartnerLogin.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // element: <ComingSoon/>,
    children: [
      {
        path: "/",
        element: <ComingSoon />,
      },
      {
        path: "/Home",
        element: <HomePage />,
      },
      {
        path: "/addItem",
        element: <AddItemPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/orderProcess",
        element: <OrderProcessing />,
      },
      {
        path: "/myOrders",
        element: <MyOrdersPage />,
      },
      {
        path: "/adminOrders",
        element: <AdminOrdersPage />,
      },
      {
        path: "/adminForm",
        element: <AdminForm />,
      },
      {
        path: "/retailerRegister",
        element: <RetailerRegistration />,
      },
      {
        path: "/deliveryBoyRegistration",
        element: <DeliveryBoyRegistration />,
      },
      {
        path: "/AdminApprovalPage",
        element: <AdminApprovalPage />,
      },
      {
        path: "/retailerOrderPage",
        element: <RetailerOrderPage />,
      },
      {
        path: "/partnerLogin",
        element: <PartnerLogin />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/checkout/:itemId",
        element: <ItemCheckout />,
      },
      {
        path: "/item/:itemId",
        element: <ItemPage />,
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "/search",
    element: <SearchPage />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    <ToastContainer position="top-center" autoClose={5000} />
  </React.StrictMode>
);
