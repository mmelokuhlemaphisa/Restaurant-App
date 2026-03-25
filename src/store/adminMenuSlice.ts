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

/* ---------------- TYPES ---------------- */
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

/* ---------------- FETCH MENU ---------------- */
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const snapshot = await getDocs(collection(db, "menu"));
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MenuItem, "id">),
  }));
  return list;
});

/* ---------------- ADD ITEM ---------------- */
export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async (item: Omit<MenuItem, "id">) => {
    const docRef = await addDoc(collection(db, "menu"), item);

    return {
      id: docRef.id,
      ...item,
    };
  },
);

/* ---------------- UPDATE ITEM ---------------- */
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

    return item; // 🔥 return updated item
  },
);

/* ---------------- DELETE ITEM ---------------- */
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string) => {
    await deleteDoc(doc(db, "menu", id));
    return id; // 🔥 return id for reducer
  },
);

/* ---------------- SLICE ---------------- */
const adminMenuSlice = createSlice({
  name: "adminMenu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* -------- FETCH -------- */
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.loading = false;
      })

      /* -------- ADD -------- */
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.menu.push(action.payload);
      })

      /* -------- UPDATE -------- */
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.menu.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.menu[index] = action.payload;
        }
      })

      /* -------- DELETE (🔥 FIXED) -------- */
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menu = state.menu.filter((item) => item.id !== action.payload);
      });
  },
});

export default adminMenuSlice.reducer;
