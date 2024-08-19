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
import AdminApprovalPage from "./components/admin/AdminPartners.tsx";
import DeliveryBoyRegistration from "./pages/DeliveryBoyRegistration.tsx";
import RetailerOrderPage from "./pages/RetailerOrderPage.tsx";
import PartnerLogin from "./components/PartnerLogin.tsx";
import { ToastContainer } from "react-toastify";
import DeliveryOrderPage from "./pages/DeliveryOrderPage.tsx";
import Unauthorized from "./components/Unauthorized.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
// import ComingSoon from "./pages/ComingSoon.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // element: <ComingSoon/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/Home",
        element: <HomePage />,
      },
      {
        path: "/addItem",
        element: <ProtectedRoute element={<AddItemPage />} allowedRoles={["admin", "retailer"]} />,
      },
      {
        path: "/admin",
        element: <ProtectedRoute element={<AdminPage />} allowedRoles={["admin"]} />,
      },
      {
        path: "/orderProcess",
        element: <ProtectedRoute element={<OrderProcessing />} allowedRoles={["admin"]} />,
      },
      {
        path: "/myOrders",
        element: <MyOrdersPage />,
      },
      {
        path: "/adminOrders",
        element: <ProtectedRoute element={<AdminOrdersPage />} allowedRoles={["admin"]} />,
      },
      {
        path: "/adminForm",
        element: <ProtectedRoute element={<AdminForm />} allowedRoles={["admin"]} />,
      },
      {
        path: "/retailerRegister",
        element: <ProtectedRoute element={<RetailerRegistration />} allowedRoles={["admin"]} />,
      },
      {
        path: "/deliveryBoyRegistration",
        element: <ProtectedRoute element={<DeliveryBoyRegistration />} allowedRoles={["admin"]} />,
      },
      {
        path: "/AdminApprovalPage",
        element: <ProtectedRoute element={<AdminApprovalPage />} allowedRoles={["admin"]} />,
      },
      {
        path: "/retailerOrderPage",
        element: <ProtectedRoute element={<RetailerOrderPage />} allowedRoles={["retailer"]} />,
      },
      {
        path: "/deliveryOrderPage",
        element: <ProtectedRoute element={<DeliveryOrderPage />} allowedRoles={["dBoy"]} />,
      },
      {
        path: "/partnerLogin",
        element: <PartnerLogin />,
      },
      {
        path: "/checkout",
        element: <ProtectedRoute element={<CheckoutPage />} allowedRoles={["user"]} />,
      },
      {
        path: "/checkout/:itemId",
        element: <ProtectedRoute element={<CheckoutPage />} allowedRoles={["user"]} />,
      },
      {
        path: "/item/:itemId",
        element: <ItemPage />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized/>
      }
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
