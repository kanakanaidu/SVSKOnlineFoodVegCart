import { BiDish } from "react-icons/bi";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ItemCard from "../reusables/ItemCard";
import { CategoriesContext } from "../../App";
// import { categories } from "../../pages/AddItemPage";

const MenuContainer = () => {
  const items = useSelector((state: RootState) => state.items.items);
  // const [inputCategory, setInputCategory] = useState<string>(categories[0]);
  const categories = useContext(CategoriesContext);
  const [inputCategory, setInputCategory] = useState<string>("");
  
  const filteredItems = items?.filter(
    (item) => item.category === inputCategory
  );

  return (
    <section className="my-6 container-padding" id="menu">
      <h2 className="relative inline text-2xl font-semibold text-headingColor">
        Fresh Catalog
        <span className="absolute -bottom-1 left-0 w-1/2 h-[2px] bg-primary" />
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-4 my-8">
        {categories.map((category) => (
          <motion.label
            whileTap={{
              scale: 0.9,
            }}
            htmlFor={category}
            key={category}
            className={`${
              inputCategory === category && "bg-primary text-white"
            } w-20 h-20 shadow-md hover:shadow-lg cursor-pointer rounded-md border border-gray-400 flex flex-col items-center justify-center gap-1`}
          >
            <BiDish
              className={`${
                inputCategory === category
                  ? "text-gray-500 bg-white"
                  : "text-white bg-primary"
              } text-[35px] rounded-full p-1`}
            />
            <p className="text-sm capitalize font-light">{category}</p>
            <input
              onChange={(e) => setInputCategory(e.target.value)}
              className="sr-only"
              name="category"
              id={category}
              type="radio"
              value={category}
            />
          </motion.label>
        ))}
      </div>
      {filteredItems && filteredItems?.length > 0 ? (
        <div
          id="menu-items"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6"
        >
          {filteredItems.map((filteredItem) => (
            <ItemCard key={filteredItem.id} item={filteredItem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <img
            className="h-40 sm:h-60"
            src="/images/2.png"
            alt="Not found image!"
          />

          <p className="text-xl sm:text-2xl mt-4 font-semibold text-center">
            Looks like we're out of stock. Check out our other tasty offerings!
          </p>
        </div>
      )}
    </section>
  );
};

export default MenuContainer;

//
