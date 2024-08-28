import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase.config";
import { Item } from "../../store/slices/itemsSlice";
import { Retailer } from "../../store/types";
import ItemCardDisp from "../../components/reusables/ItemCardDisp";
<<<<<<< HEAD
=======
import { useForm } from "react-hook-form";
>>>>>>> 1dcdb2a71ce5a7b6f77404e2cccfd5d63131dae7
import { useNavigate } from "react-router-dom";

export const MyItemListPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>("");
  //   const searchParams = new URLSearchParams(location.search);
  //   const retailerId = searchParams.get("retailerId");
  const retailerId = localStorage.getItem("uid");
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

      // Query Firestore for the specific retailer based on the retailerId
      const q = query(
        collection(firestore, "retailers"),
        where("id", "==", retailerId)
      );
      const querySnapshot = await getDocs(q);

      // Filter the fetched retailers to find the one with the matching retailerId
      const fetchedRetailers = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((retailer) => retailer.id === retailerId); // Filter for the specific retailerId

      if (fetchedRetailers.length > 0) {
        setSelectedRetailer(fetchedRetailers[0].id);
      }
    };

    const fetchItems = async () => {
      const q = query(
        collection(firestore, "items"),
        where("retailer", "==", retailerId)
      );
      const querySnapshot = await getDocs(q);

      //   const itemSnapshot = await getDocs(collection(firestore, "items"));
      const itemList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
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
            value={selectedRetailer || ""}
            disabled
            onChange={(e) => {
              setSelectedRetailer(e.target.value);
              console.log("Filter by retailer", e.target.value);
            }}
          >
            <option value="">All Retailers</option>
            {/* Add retailer options dynamically here */}
            {retailers.map((retailer) => (
              <option id={retailer.id} value={retailer.id}>
                {retailer.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => navigate("/addItem")}
          className="bg-rose-500 text-white font-semibold py-2 px-4 rounded hover:bg-rose-600"
        >
          Add New Item
        </button>
      </div>

      {/* Item List */}
      {items.length <= 0 && (
        <div className="flex justify-center items-center">
          <h1 className="font-bold mb-4 text-center text-rose-500">
            no items added by you.
          </h1>
        </div>
      )}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items
            .filter(
              (item) =>
                selectedRetailer === "" || item.retailer === selectedRetailer
            )
            .map((item) => (
              <ItemCardDisp key={item.id} item={item} />
            ))}
        </div>
      )}
    </div>
  );
};
