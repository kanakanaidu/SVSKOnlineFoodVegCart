import { RiEditCircleFill } from "react-icons/ri";
import { Item } from "../../store/slices/itemsSlice";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

interface ItemCardProps {
  item: Item;
}

const ItemCardDisp = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();

  // const isCartItem =
  //   cartItems.filter((cartItem) => cartItem.id === item?.id).length > 0;

  const toggleCartItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edititem/${item.id}`);
  };

  return (
    <Link
      to={''}
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
          <p className="text-sm">Edit</p>
          <RiEditCircleFill className="text-lg rotate-0" />
        </Button>
      </div>
    </Link>
  );
};

export default ItemCardDisp;
