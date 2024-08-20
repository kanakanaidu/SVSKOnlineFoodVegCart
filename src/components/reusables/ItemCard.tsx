import { RiAddFill } from "react-icons/ri";
import { Item } from "../../store/slices/itemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/slices/cartSlice";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import Button from "./Button";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispath = useDispatch();

  const isCartItem =
    cartItems.filter((cartItem) => cartItem.id === item?.id).length > 0;

  const toggleCartItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCartItem) {
      dispath(removeFromCart(item.id));
    } else {
      dispath(addToCart({ ...item, qty: "1" }));
    }
  };

  return (
    <Link
      to={`/item/${item.databaseId}`}
      className="min-w-[calc((100%-16px)/2)] sm:min-w-[calc((100%-32px)/3)] md:min-w-[calc((100%-48px)/4)] xl:min-w-[calc((100%-96px)/5)] group relative cursor-pointer h-full bg-gray-300/50 backdrop-blur-md rounded-md"
    >
      <div className="w-full flex items-center justify-center p-2 border-b-2 border-primary">
        <img
          className="h-40 group-hover:scale-110 transition duration-500 object-contain"
          src={item.imageUrl}
          alt={`${item.title}-Image`}
        />
      </div>
      <div className="flex flex-col gap-[2px] px-2 sm:px-3">
        <p className="text-sm xs:text-base capitalize sm:text-lg truncate mt-[6px] mb-[4px] text-textColor font-semibold">
          {item.title}
        </p>
        <p className="text-xs xs:text-sm truncate">{item.description}</p>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center text-sm font-sans">
          <p className="text-xs xs:text-sm font-medium">
            Price - ₹ <span className="font-semibold">{item.price}</span>
          </p>
          <p className="text-xs xs:text-sm font-medium">
            Quantity - <span className="font-semibold">{item.quantity}</span>
          </p>
        </div>

        <Button
          onClick={toggleCartItem}
          className="w-full sm:w-1/2 my-2"
          size={"sm"}
        >
          {isCartItem ? (
            <>
              <p className="text-sm">Remove</p>
              <RiAddFill className="text-lg rotate-45" />
            </>
          ) : (
            <>
              <p className="text-sm">Add</p>
              <RiAddFill className="text-lg" />
            </>
          )}
        </Button>
      </div>
    </Link>
  );
};

export default ItemCard;
