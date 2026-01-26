import { db } from "./FireBase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export const saveCartToFirestore = async (userId: string, items: any[]) => {
  const cartDoc = doc(db, "carts", userId);
  await setDoc(cartDoc, { items });
};

export const deleteCartFromFirestore = async (userId: string) => {
  const cartDoc = doc(db, "carts", userId);
  await deleteDoc(cartDoc);
};

export const getCartFromFirestore = async (userId: string) => {
  const cartDoc = doc(db, "carts", userId);
  const snapshot = await getDoc(cartDoc);

  if (snapshot.exists()) {
    return snapshot.data().items || [];
  }
  return [];
};