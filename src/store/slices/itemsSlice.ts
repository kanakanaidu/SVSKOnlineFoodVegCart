import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  databaseId: string;
  calories: string;
  category: string;
  description:
    | "fashion"
    | "rice"
    | "fruits"
    | "vegetables"
    | "mobile accessories"
    | "icecreams"
    | "meet"
    | "drinks"
    | "others";
  id: string;
  imageUrl: string;
  price: string;
  title: string;
}

interface ItemsState {
  items: Item[] | null;
}

const initialState: ItemsState = {
  items: null,
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[] | null>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = itemsSlice.actions;

export default itemsSlice.reducer;
