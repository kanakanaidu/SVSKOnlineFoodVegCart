import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase.config";
import { Item } from "../store/slices/itemsSlice";
import Select from "react-select";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { CheckoutFormSchema } from "../utils/zodSchemas";
import { OrderSummaryData } from "./CheckoutPage";
import OrderSummary from "../components/OrderSummary";
import { Skeleton } from "../components/Skeleton";
import { calculateDeliveryCharge } from "../utils/orderService";

const quantityOption = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

const ItemCheckout = () => {
  const params = useParams() as { itemId: string };
  const [qty, setQty] = useState(quantityOption[0]);
  const [item, setItem] = useState<Item | null>(null);
  const [orderSummaryData, setOrderSummaryData] =
    useState<OrderSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  // const deliveryCharges = useSelector((state: RootState) => {
  //   if (state.cart.cartTotal > 3000) return 0;
  //   if (state.cart.cartTotal > 500) return 100;
  //   if (state.cart.cartTotal > 100) return 50;
  //   return 10;
  // });
  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(firestore, "foodItems", params.itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const item = docSnap.data() as Item;
        setItem(item);
      }
      setLoading(false);
    };

    fetchItem();
  }, [params]);

  if (!item) {
    return;
  }

  const onSubmitHandler = (data: CheckoutFormSchema) => {
    const deliveryCharges = calculateDeliveryCharge(
      parseFloat(item.price) * qty.value
    );

    setOrderSummaryData({
      items: [{ ...item, qty: `${qty.value}` }],
      totalPrice: parseFloat(item.price) * qty.value,
      deliveryCharge: deliveryCharges,
      upiPaymentID: "",
      formData: data,
    });
  };

  return (
    <div className="">
      {orderSummaryData ? (
        <OrderSummary data={orderSummaryData} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full flex flex-col lg:w-[40%] px-4">
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <>
                <div className="w-full  mt-2 flex flex-col gap-4 bg-gray-300/50 p-4 items-center">
                  <div className="border border-gray-500 p-2 rounded-lg">
                    <img
                      className="w-60"
                      src={item.imageUrl}
                      alt={item.title}
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-headingColor text-2xl capitalize">
                      {item.title}
                    </p>
                    <p className="text-sm truncate">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-semibold">
                        ₹ <span>{item.price}</span>
                      </p>
                      <Select
                        options={quantityOption}
                        classNames={{
                          control: () => "",
                          indicatorsContainer: () => "cursor-pointer",
                          option: () => "!cursor-pointer",
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "#ea5765",
                            primary25: "#f7aaad",
                            primary50: "#f7aaad",
                          },
                        })}
                        placeholder="qty"
                        defaultValue={quantityOption[0]}
                        value={qty}
                        onChange={(value) => setQty(value!)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#e8eaed] p-2 border-white border-t-4">
                  <h4 className="text-headingColor font-semibold border-primary border-b py-2 text-sm">
                    PRICE DETAILS
                  </h4>
                  <div className="flex items-center justify-between my-1 text-sm">
                    <p>
                      Price x (<span>{qty.value}</span> qty)
                    </p>
                    <p>
                      ₹{" "}
                      <span>
                        {item.price} x {qty.value}
                      </span>
                    </p>
                  </div>
                  {/* <div className="my-1 flex items-center justify-between border-b  border-primary text-sm">
                    <p>Delivery Charges</p>
                    <p className="text-green-500">₹ {deliveryCharges}</p>
                  </div> */}
                  <div className="flex items-center justify-between my-2">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-semibold">
                      ₹ {parseFloat(item.price) * qty.value}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-1 px-4 relative max-lg:mb-10">
            <CheckoutForm
              totalPrice={parseFloat(item.price) * qty.value}
              onSubmitHandler={onSubmitHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCheckout;
