// app/food/[id].tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/services/FireBase";
import { useDispatch } from "react-redux";
import { addItem } from "../../src/store/cartSlice";
import CartIcon from "../components/CartIcon";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const EXTRAS = [
  { id: "chips", name: "Extra Chips", price: 10 },
  { id: "cheese", name: "Extra Cheese", price: 8 },
  { id: "sauce", name: "Extra Sauce", price: 5 },
];

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchFood = async () => {
      const ref = doc(db, "menu", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFood({ id: snap.id, ...(snap.data() as Omit<FoodItem, "id">) });
      }
    };

    fetchFood();
  }, [id]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((e) => e !== extraId)
        : [...prev, extraId]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = EXTRAS.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const totalPrice = ((food?.price || 0) + extrasTotal) * quantity;

  const handleAddToCart = () => {
    if (!food) return;

    dispatch(
      addItem({
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
        extras: selectedExtras.map((extraId) => {
          const extra = EXTRAS.find((e) => e.id === extraId)!;
          return { id: extra.id, name: extra.name, price: extra.price };
        }),
      })
    );

    alert("Added to cart!");
  };

  if (!food) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cart Icon in top-right */}
      <View style={styles.header}>
        <CartIcon />
      </View>

      <Image source={{ uri: food.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.desc}>{food.description}</Text>

        <Text style={styles.section}>Extras</Text>
        {EXTRAS.map((extra) => (
          <TouchableOpacity
            key={extra.id}
            style={[
              styles.extraRow,
              selectedExtras.includes(extra.id) && styles.extraSelected,
            ]}
            onPress={() => toggleExtra(extra.id)}
          >
            <Text
              style={[
                styles.extraText,
                selectedExtras.includes(extra.id) && { color: "#fff" },
              ]}
            >
              {extra.name} (+R{extra.price})
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.section}>Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.total}>Total: R {totalPrice.toFixed(2)}</Text>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: "#ff6b00", marginTop: 10 }]}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.addText}>Go to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { position: "absolute", top: 40, right: 16, zIndex: 10 },
  image: { width: "100%", height: 260 },
  content: { padding: 16, paddingTop: 20 },
  name: { fontSize: 26, fontWeight: "bold" },
  desc: { color: "#666", marginVertical: 8 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  extraRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  extraSelected: { backgroundColor: "#ff6b00" },
  extraText: { color: "#000", fontWeight: "bold" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyBtn: { backgroundColor: "#ff6b00", padding: 12, borderRadius: 8 },
  qtyText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtyValue: { fontSize: 18, marginHorizontal: 16, fontWeight: "bold" },
  total: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  addBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
