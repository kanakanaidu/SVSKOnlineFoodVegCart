import Select from "react-select";
import { CartItem } from "../../store/slices/cartSlice";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import Button from "../reusables/Button";
import { useNavigate } from "react-router-dom";

const quantityOption = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

interface CartItemProps {
  cartItem: CartItem;
  removeBuyNowBtn?: boolean;
}

const CartItemCard = ({ cartItem, removeBuyNowBtn = false }: CartItemProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col px-2 bg-white rounded-md">
      <div
        onClick={() => navigate(`/item/${cartItem.databaseId}`)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="w-24 h-24">
          <img
            className="w-full h-full object-contain"
            src={cartItem.imageUrl}
            alt={cartItem.title}
          />
        </div>
        <div>
          <span className="text-headingColor text-lg capitalize relative group">
            {cartItem.title}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full bg-black transition-all duration-300"></span>
          </span>
          <p className="text-sm truncate">{cartItem.description}</p>
          <p>
            ₹ <span>{cartItem.price}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-primary py-2">
        <Button
          variant="muted"
          onClick={() => dispatch(removeFromCart(cartItem.id))}
          className="flex-1"
        >
          Remove
        </Button>

        <Select
          onChange={(e) =>
            dispatch(updateQuantity({ id: cartItem.id, qty: e?.value || "1" }))
          }
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
          defaultValue={{ value: cartItem.qty, label: cartItem.qty }}
          className="flex-1"
          value={{ value: cartItem.qty, label: cartItem.qty }}
        />

        {!removeBuyNowBtn && (
          <Button
            onClick={() => navigate(`/checkout/${cartItem.databaseId}`)}
            className="flex-1"
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
