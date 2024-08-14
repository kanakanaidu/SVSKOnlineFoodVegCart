import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Button from "../reusables/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

type CartTotalProps = {
  className?: string;
  removeProceedBtn?: boolean;
};

const CartTotal: React.FC<CartTotalProps> = ({
  className,
  removeProceedBtn = false,
}) => {
  const navigate = useNavigate();
  const totalPrice = useSelector((state: RootState) => state.cart.cartTotal);
  const deliveryCharges = useSelector((state: RootState) => {
    if (state.cart.cartTotal > 3000) return 0;
    if (state.cart.cartTotal > 500) return 100;
    if (state.cart.cartTotal > 100) return 50;
    return 10;
  });
  const numOfCartItems = useSelector(
    (state: RootState) => state.cart.numOfCartItems
  );
  return (
    <div
      className={clsx(
        `w-full bg-[#e8eaed] p-2 border-white border-t-4`,
        className
      )}
    >
      <h4 className="text-headingColor border-primary border-b py-2 text-sm">
        PRICE DETAILS
      </h4>
      <div className="flex items-center justify-between my-1 text-sm">
        <p>
          Price (<span>{numOfCartItems}</span> item)
        </p>
        <p>
          ₹ <span>{totalPrice}</span>
        </p>
      </div>
      <div className="my-1 flex items-center justify-between border-b  border-primary text-sm">
        <p>Delivery Charges</p>
        {/* <p className="text-green-500">Free</p> */}
        <p className="text-green-500">₹ {deliveryCharges}</p>
      </div>
      <div className="flex items-center justify-between my-2">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-lg font-semibold">₹ {totalPrice+deliveryCharges}</p>
      </div>
      {!removeProceedBtn && (
        <Button onClick={() => navigate("/checkout")} className="w-full">
          Proceed
        </Button>
      )}
    </div>
  );
};

export default CartTotal;
