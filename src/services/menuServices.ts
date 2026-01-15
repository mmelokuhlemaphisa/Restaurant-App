import { collection, getDocs } from "firebase/firestore";
import { db } from "./FireBase";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const snapshot = await getDocs(collection(db, "menu"));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<MenuItem, "id">;

    return {
      id: doc.id,
      ...data,
    };
  });
};
