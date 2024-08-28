import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase.config";
import { Item } from "../../store/slices/itemsSlice";
import { Retailer } from "../../store/types";
import ItemCardDisp from "../../components/reusables/ItemCardDisp";

export const ItemListPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string>("");

  useEffect(() => {
    const fetchRetailers = async () => {
      const retailerSnapshot = await getDocs(
        collection(firestore, "retailers")
      );
      const retailerList = retailerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Retailer[];
      setRetailers(retailerList);
    };

    const fetchItems = async () => {
      const itemSnapshot = await getDocs(collection(firestore, "items"));
      const itemList = itemSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      //   const filteredItems = itemList?.filter(
      //     (item) => item.retailer === selectedRetailer
      //   );
      setItems(itemList);
    };

    fetchRetailers();
    fetchItems();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Left-aligned Item List Title */}
        <h2 className="text-2xl font-bold">Items List</h2>

        {/* Right-aligned Label and Select Controls */}
        <div className="flex items-center space-x-2">
          <label htmlFor="retailer" className="text-lg font-medium">
            Filter by Retailer:
          </label>
          <select
            id="retailer"
            className="border border-gray-300 rounded-md p-2"
            onChange={(e) => {
              setSelectedRetailer(e.target.value);
              console.log("Filter by retailer", e.target.value);
            }}
          >
            <option value="">All Retailers</option>
            {/* Add retailer options dynamically here */}
            {retailers.map((retailer)=>(
              <option id={retailer.id} value={retailer.id}>{retailer.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Item List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          .filter(
            (item) =>
              selectedRetailer === "" || item.retailer === selectedRetailer
          )
          .map((item) => (
            <ItemCardDisp key={item.id} item={item} />
            // <div key={item.id} className="border p-4 rounded-md shadow-sm">
            //   <h2 className="text-lg font-semibold">{item.title}</h2>
            //   <p>Category: {item.category}</p>
            //   <p>Price: ₹{item.price}</p>
            //   <p>
            //     Retailer: {retailers.find((r) => r.id === item.retailer)?.name}
            //   </p>
            // </div>
          ))}
      </div>
    </div>
  );
};
