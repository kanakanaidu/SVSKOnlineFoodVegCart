import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  databaseId: string;
  quantity: string;
  category: string;
  description:
    | "fashion"
    | "food"
    | "fruits"
    | "vegetables"
    | "mobile accessories"
    | "icecreams"
    | "meet"
    | "drinks"
    | "groceries";
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
