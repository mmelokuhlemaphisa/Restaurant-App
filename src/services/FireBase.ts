// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfAszDTxcjd_o5DhCRC6_s6h0934YJgHI",
  authDomain: "restaurant-app-cravecart.firebaseapp.com",
  projectId: "restaurant-app-cravecart",
  storageBucket: "restaurant-app-cravecart.firebasestorage.app",
  messagingSenderId: "329898132472",
  appId: "1:329898132472:web:2b8810c7384faaf6cc8c0d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
