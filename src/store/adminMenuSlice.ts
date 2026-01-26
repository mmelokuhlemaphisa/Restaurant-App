import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/FireBase";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
  new: boolean;
}

interface MenuState {
  menu: MenuItem[];
  loading: boolean;
}

const initialState: MenuState = {
  menu: [],
  loading: false,
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const snapshot = await getDocs(collection(db, "menu"));
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MenuItem, "id">),
  }));
  return list;
});

export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async (item: Omit<MenuItem, "id">) => {
    await addDoc(collection(db, "menu"), item);
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async (item: MenuItem) => {
    const docRef = doc(db, "menu", item.id);
    await updateDoc(docRef, {
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      popular: item.popular,
      new: item.new,
    });
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string) => {
    await deleteDoc(doc(db, "menu", id));
  }
);

const adminMenuSlice = createSlice({
  name: "adminMenu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default adminMenuSlice.reducer;
