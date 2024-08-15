import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import CartItemCard from "../components/cart/CartItemCard";
import CartTotal from "../components/cart/CartTotal";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { CheckoutFormSchema } from "../utils/zodSchemas";
import OrderSummary from "../components/OrderSummary";
import { useState } from "react";
import { CartItem } from "../store/slices/cartSlice";
import { calculateDeliveryCharge } from "../utils/orderService";

export type OrderSummaryData = {
  items: CartItem[];
  formData: CheckoutFormSchema;
  totalPrice: number;
  deliveryCharge: number;
  // upiPaymentID: string;
};

const CheckoutPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: RootState) => state.cart.cartTotal);
  const [orderSummaryData, setOrderSummaryData] =
    useState<OrderSummaryData | null>(null);

  const onSubmitHandler = async (data: CheckoutFormSchema) => {
    // const upiPaymentID = await fetchConfig("REACT_APP_UPI_PAYMNET_ID");
    // const upiID = upiPaymentID
    //   ? // @ts-ignore
    //     upiPaymentID?.REACT_APP_UPI_PAYMNET_ID
    //   : "Configure UPI ID in firestore database.";

    const deliveryCharges = await calculateDeliveryCharge(totalPrice);
    console.log("submited Data from checkout form", data);
    setOrderSummaryData({
      items: cartItems,
      formData: data,
      totalPrice: totalPrice,
      deliveryCharge: deliveryCharges,
      // upiPaymentID: upiID,
    });
  };

  return (
    <div className="">
      {orderSummaryData ? (
        <OrderSummary data={orderSummaryData} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full flex flex-col lg:w-[40%] p-2 lg:pb-8 lg:px-4">
            <div className="w-full mt-2 flex flex-col gap-4 bg-gray-300/50 p-4">
              {cartItems.map((item) => (
                <CartItemCard removeBuyNowBtn key={item.id} cartItem={item} />
              ))}
            </div>
            <CartTotal removeProceedBtn />
          </div>
          <div className="flex-1 px-4 relative max-lg:mb-10">
            <CheckoutForm
              onSubmitHandler={onSubmitHandler}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
