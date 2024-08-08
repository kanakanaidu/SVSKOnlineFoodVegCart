import { User } from "../store/slices/userSlice";
import { CartItem } from "../store/slices/cartSlice";
import { Location } from "../store/types";

interface CartInfo {
  cartItems: CartItem[];
  numOfCartItems: number;
  cartTotal: number;
}

export const fetchUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const fetchCartItems = (): CartInfo | null => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : null;
};

export const fetchLocation = (): Location =>{
  const custLocation = localStorage.getItem("custLocation");
  const custLoc = custLocation ? JSON.parse(custLocation) : null;
  // return custLoc ? `${custLoc.lat},${custLoc.lng}` : '';
  return custLoc ? custLoc : null;
}