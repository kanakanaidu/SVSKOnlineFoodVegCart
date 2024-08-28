import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase.config";
import { Item } from "../store/slices/itemsSlice";

const itemstbl = "items";

interface Config {
  configValue: string;
}

export const saveItem = async (data: any) => {
  const id = crypto.randomUUID();
  data.id = id; // Set the ID field in the data to match the document ID
  await setDoc(doc(firestore, itemstbl, id), data, {
    merge: true,
  });
};

export const updateItem = async (data: any) => {
  const id = data.id;
  if (id) {
    const docRef = doc(firestore, itemstbl, id);
    await updateDoc(docRef, data);
  }
};

export const deleteItem = async (id: any)=>{
    if (id) {
      const docRef = doc(firestore, itemstbl, id);
      await deleteDoc(docRef);
    }
}

export const getItems = async () => {
  const items = await getDocs(query(collection(firestore, itemstbl)));
  return items.docs.map((doc) => {
    return { databaseId: doc.id, ...doc.data() };
  });
};

export const getItemWithId = async (id: string) => {
  const docRef = doc(firestore, itemstbl, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const item = { ...docSnap.data(), databaseId: docSnap.id } as Item;
    const itemsRef = collection(firestore, itemstbl);
    const q = query(itemsRef, where("category", "==", item.category));
    const querySnapshot = await getDocs(q);
    const similarItems = querySnapshot.docs.map((doc) => {
      return { databaseId: doc.id, ...doc.data() } as Item;
    });

    return {
      item,
      similarItems,
    };
  } else {
    return {
      item: null,
      simlarItems: null,
    };
  }
};

export const searchItemWithTitle = async (title: string) => {
  const foodItemsRef = collection(firestore, itemstbl);
  const q = query(
    foodItemsRef,
    where("title", ">=", title.toLowerCase()),
    where("title", "<", title.toLowerCase() + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);
  const searchedItems = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), databaseId: doc.id } as Item;
  });

  return searchedItems;
};

export const fetchConfig = async (API_ENDPOINT: string): Promise<Config> => {
  const docRef = doc(firestore, "config", API_ENDPOINT);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Config;
  } else {
    throw new Error("No such document!");
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "categories"));
    const categoriesList: string[] = querySnapshot.docs.map(
      (doc) => doc.data().name
    );
    return categoriesList;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return [];
  }
};
