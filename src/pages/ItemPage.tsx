import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemWithId } from "../utils/firebaseFunctions";
import { Item } from "../store/slices/itemsSlice";
import { AiFillTag } from "react-icons/ai";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";
import ItemsSlider from "../components/reusables/ItemsSlider";
import { Skeleton } from "../components/Skeleton";
import Button from "../components/reusables/Button";

const ItemPage = () => {
  const params = useParams() as { itemId: string };
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const { item, similarItems } = await getItemWithId(params.itemId);
      setItem(item);
      const simillarItemsWithoutCurrentItem = similarItems?.filter(
        (similarItem) => similarItem.id !== item.id
      );
      setSimilarItems(simillarItemsWithoutCurrentItem);
      setLoading(false);
    };

    fetchItem();
  }, [params]);

  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispath = useDispatch();
  const isCartItem =
    cartItems.filter((cartItem) => cartItem.id === item?.id).length > 0;

  const toggleCartItem = () => {
    if (!item) return;
    if (isCartItem) {
      dispath(removeFromCart(item.id));
    } else {
      dispath(addToCart({ ...item, qty: "1" }));
    }
  };

  return (
    <div className="container-padding">
      {loading ? (
        <div className="flex flex-col lg:flex-row gap-4 bg-cardOverlay shadow-lg p-4">
          <Skeleton className="w-full max-w-[400px] h-[250px] lg:w-[400px] lg:h-[400px]" />
          <div className="p-2 flex w-full flex-col gap-2">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <div className="flex flex-col gap-1 w-1/2 mt-4">
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        </div>
      ) : item ? (
        <>
          <div className="flex flex-col lg:flex-row gap-4 bg-cardOverlay shadow-lg p-2 sm:p-4">
            <div className="flex flex-col gap-2">
              <div className="w-full h-[50vh] lg:w-[400px] lg:h-[400px] border border-black">
                <img
                  src={item.imageUrl}
                  className="object-contain w-full h-full object-center"
                  alt="Product Image"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={toggleCartItem}
                  className="text-base xs:text-lg sm:text-xl md:text-2xl  uppercase"
                >
                  {isCartItem ? "Remove" : "Add to Cart"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/checkout/${item.databaseId}`)}
                  className="text-base xs:text-lg sm:text-xl md:text-2xl  uppercase"
                >
                  <BsFillLightningChargeFill />
                  Buy now
                </Button>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <span className="capitalize text-3xl md:text-5xl sm:text-6xl font-semibold text-headingColor">
                {item.title}
              </span>
              <p className="text-sm sm:text-lg">-{item.description}</p>
              <div className="">
                <span className="sm:text-sm text-green-600">Special Price</span>
                <p className="text-lg sm:text-2xl text-textColor">
                  ₹ {item.price}
                </p>
              </div>
              <div className="">
                <span className="sm:text-sm text-green-600">Calories</span>
                <p className="text-lg sm:text-2xl text-textColor">
                  {item.calories} <span className="text-sm">per 100gm</span>
                </p>
              </div>

              {/* <div>
                <span className="text-base sm:text-lg py-2 block">
                  Available offers
                </span>
                <div className="text-xs sm:text-sm flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <AiFillTag size={16} className="text-green-600" />
                    <p>
                      Extra ₹500 Off on Bikes & Scooters on purchase of ₹30,000
                      or moreT&C
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiFillTag size={16} className="text-green-600" />
                    <p>
                      Partner OfferSign-up for Flipkart Pay Later & get free
                      Times Prime Benefits worth ₹10,000*Know More
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiFillTag size={16} className="text-green-600" />
                    <p>Bank Offer5% Cashback on Flipkart Axis Bank CardT&C</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiFillTag size={16} className="text-green-600" />
                    <p>
                      Special PriceGet extra 9% off (price inclusive of
                      cashback/coupon)T&C
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {similarItems && similarItems.length !== 0 && (
            <ItemsSlider title="Similar Products" items={similarItems} />
          )}
        </>
      ) : (
        <div className="text-lg text-center mt-10 text-textColor">
          No such items exist!!!
        </div>
      )}
    </div>
  );
};

export default ItemPage;
