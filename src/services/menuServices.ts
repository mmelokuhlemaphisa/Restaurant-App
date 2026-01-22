import { collection, getDocs } from "firebase/firestore";
import { db } from "./FireBase";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean; // Optional: true if item is popular
  new?: boolean; // Optional: true if item is new
  // You can add more fields here in the future
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const snapshot = await getDocs(collection(db, "menu"));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<MenuItem, "id">;

    return {
      id: doc.id,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      image: data.image,
      popular: data.popular || false, // default false if not set
      new: data.new || false, // default false if not set
    };
  });
};
