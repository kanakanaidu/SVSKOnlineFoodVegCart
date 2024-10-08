import { OrderSummaryData } from "../pages/CheckoutPage";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import Button from "./reusables/Button";
import { useNavigate } from "react-router-dom";
import sendWhatsApp from "../utils/sendMessage";
import uploadImage from "../utils/uploadImage";
import { Location, Order, OrderItem } from "../store/types";
import { fetchLocation, fetchUser } from "../utils/fetchLocalStorage";
import { addOrder } from "../utils/orderService";
import { clearCart } from "../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { fetchConfig } from "../utils/firebaseFunctions";

type OrderSummaryProps = {
  // SendMessage: (event: SyntheticEvent) => void;
  data: OrderSummaryData;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  // @ts-ignore
  data: { items, formData, totalPrice, deliveryCharge },
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const issuer = Payment.fns.cardType(formData.number);
  const captureRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  // const [customerName, setCustomerName] = useState("");
  // @ts-ignore
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  // @ts-ignore
  const [itemName, setItemName] = useState("");
  // @ts-ignore
  const [quantity, setQuantity] = useState("1");
  // @ts-ignore
  const [price, setPrice] = useState("0");
  const [status, setStatus] = useState<Order["status"]>("pending");
  // @ts-ignore
  const [ordLocation, setOrdLocation] = useState<Location[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // @ts-ignore
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>("");

  const SubmitOrder = async () => {
    const adminNumber = await fetchConfig("REACT_APP_ADMIN_NUMBER");

    setIsSubmitting(true);
    setIsSubmitted(false);
    try {
      //capturescreenshot
      if (captureRef.current) {
        const canvas = await html2canvas(captureRef.current); // Adjust scale to reduce size
        const imgData = canvas.toDataURL("image/png", 1.0);
        const currUser = fetchUser();
        if (!currUser) {
          toast.warning("You need to be logged in to submit the order.😉");
        } else {
          // Upload the screenshot to an image hosting service
          // const imageUrl = await uploadImage(imgData);
          const imageUrl = await uploadImage(imgData);
          // downloadImage(imgData, "invoice");

          for (let index = 0; index < items.length; index++) {
            const element = items[index];
            const newItem: OrderItem = {
              itemName: element.title,
              quantity: element.qty,
              price: element.price,
            };
            // setItemName(element.description);
            // setQuantity(element.qty);
            // setPrice(element.price);
            setOrders([...orders, newItem]);
          }

          // if (currUser?.displayName) {
          //   setCustomerName(currUser.displayName);
          // }
          if (formData.address) {
            setAddress(formData.address);
          }
          const custLocation: Location = fetchLocation();

          const newOrder: Order = {
            customerName: currUser?.displayName ? currUser.displayName : "",
            customerEmail: currUser?.email ? currUser.email : "",
            address: formData.address,
            orderItems: items,
            orderValue: totalPrice.toString(),
            status: status,
            location: custLocation,
            paymentRef: paymentReference,
          };
          if (!paymentConfirmed || !paymentReference) {
            alert(
              "Please confirm that the payment has been made and reference added."
            );
            return;
          }
          const orderId = await addOrder(newOrder);
          // setCustomerName("");
          setAddress("");
          setOrders([]);
          setStatus("pending");
          setPaymentReference("");
          // clearCart();
          // Send the order copy via WhatsApp
          await sendWhatsApp(
            formData.phone,
            "Please find the invoice copy for your order...",
            imageUrl
          );

          // send order copy to admin
          await sendWhatsApp(
            // @ts-ignore
            adminNumber?.REACT_APP_ADMIN_NUMBER,
            `Please find the invoice copy for Order ID: ${orderId}`,
            imageUrl
          );

          dispatch(clearCart());
          toast.success(
            `Order submitted successfully, your order ID: ${orderId} 😍`
          );
          setIsSubmitted(true);
        }
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error(`Order submission failed: ${error} 🙄`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // @ts-ignore
  const downloadImage = (blob: string, fileName: string) => {
    const fakeLink = window.document.createElement("a");
    // fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  };

  // @ts-ignore
  // added this function to take screenshot before unloading the page.
  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 overflow-auto w-screen z-[50] bg-gray-200">
      <div className="w-full p-4 sm:p-10 flex flex-col items-center justify-center">
        {isSubmitting ? (
          <div className="flex flex-col items-center">
            <RingLoader color="#36D7B7" />
            <p className="mt-4 text-lg">Submitting your order...</p>
          </div>
        ) : (
          <div
            id="toPdf"
            className="w-[min(100%,720px)] min-h-screen flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden"
          >
            <div className="h-auto w-full md:w-[40%] py-3 px-1 bg-white flex items-center ">
              <div className="flex w-full h-fit flex-wrap gap-2 items-center justify-center">
                {items.length === 1 ? (
                  <div className="w-full p-2 border border-primary rounded-lg">
                    <img
                      src={items[0].imageUrl}
                      alt={items[0].title}
                      className="object-contain w-full"
                    />
                  </div>
                ) : (
                  items.map((item) => {
                    return (
                      <div className="w-24 p-2 border border-primary rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-contain w-full"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div
              ref={captureRef}
              className="h-auto flex-1 bg-primary p-4 text-white flex flex-col items-center "
            >
              <span className="text-3xl sm:text-4xl font-semibold underline underline-offset-4">
                Order Summary
              </span>
              <div className="flex flex-col justify-between h-full  gap-1 mt-4 max-w-[350px] w-full pb-8">
                {/* Price Details */}
                <div className="">
                  {items.map((item) => {
                    return (
                      <div className="flex items-center justify-between">
                        <span>
                          {item.qty} x{" "}
                          <span className="capitalize">{item.title}</span>
                          <span className="capitalize">{` @ ₹ ${item.price}`}</span>
                        </span>
                        <span className="font-semibold">
                          ₹ {parseInt(item.qty) * parseInt(item.price)}
                        </span>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between mt-4">
                    <span>Delivery</span>
                    <span className="font-semibold">₹ {deliveryCharge}</span>
                  </div>
                  <div className="flex items-center justify-between ">
                    <span>Service Charge</span>
                    <span className="font-semibold">₹ {totalPrice * 0.06}</span>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-2 border-t border-white">
                    <span>Grand Total</span>
                    <span className="font-semibold">
                      ₹ {totalPrice + deliveryCharge + totalPrice * 0.06}
                    </span>
                  </div>
                </div>

                {/* Person Details */}
                <table>
                  <tr>
                    <td>Recipent</td>
                    <td>:</td>
                    <td>
                      {formData.firstName} {formData.lastName}
                    </td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>:</td>
                    <td>{formData.address}</td>
                  </tr>
                </table>
                {/* Payment Details */}
                <table>
                  <tr>
                    <td colSpan={3}>
                      <div className="mb-4">
                        <p>Scan the QR code to complete your payment:</p>
                        <img
                          src="/images/GooglePay_QR.png"
                          alt="QR Code"
                          className="w-40 h-40"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <br />
                      <input
                        type="checkbox"
                        id="paymentConfirmed"
                        checked={paymentConfirmed}
                        onChange={(e) => setPaymentConfirmed(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="paymentConfirmed" className="text-sm">
                        I confirm that the payment of ₹{totalPrice} has been
                        made.
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-red-500">
                      <label
                        htmlFor="paymentReference"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Reference:
                      </label>
                      <input
                        type="text"
                        id="paymentReference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Enter your payment reference"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Payment</td>
                    <td>:</td>
                    <td>
                      <span className="uppercase">{issuer}</span> ending with{" "}
                      <span>{formData.number.slice(-4)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td>{formData.name}</td>
                  </tr> */}
                </table>
              </div>
              <Button
                color="rgb(234 87 101)"
                variant="outline"
                scale={0.98}
                className="w-full mt-6 font-semibold justify-around text-lg"
                onClick={async () => {
                  // await sendWhatsApp(to, message);
                  // await sendWhatsApp(formData.phone, "this message from react project...");
                  await SubmitOrder();
                  navigate("/");
                }}
              >
                <span className="flex gap-4 items-center">Submit Order</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
