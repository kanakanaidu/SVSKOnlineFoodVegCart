import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { fetchCategories, getItems } from "./utils/firebaseFunctions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "./store/slices/itemsSlice";
import { Item } from "./store/slices/itemsSlice";
import Cart from "./components/cart/Cart";
import { RootState } from "./store/store";
import { AnimatePresence } from "framer-motion";

export const CategoriesContext = React.createContext<string[]>([]);

const App = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const isCartOpen = useSelector((state: RootState) => state.cart.isCartOpen);
  const dispath = useDispatch();
  const fetchItems = async () => {
    const data = await getItems();
    dispath(setItems(data as Item[]));
  };
  const fetchCats = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  useEffect(() => {
    fetchItems();
    fetchCats();
  }, []);
  return (
    <div className="w-full h-auto flex flex-col ">
      <CategoriesContext.Provider value={categories}>
        <Header />
        <main className="mt-24 md:mt-28 w-full">
          <Outlet />
        </main>
        <AnimatePresence>{isCartOpen && <Cart />}</AnimatePresence>
      </CategoriesContext.Provider>
    </div>
  );
};
export default App;
