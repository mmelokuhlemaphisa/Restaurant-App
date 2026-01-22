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
import { Ionicons } from "@expo/vector-icons";


interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Mock sides and drinks
const SIDES = [
  { id: "chips", name: "Chips" },
  { id: "salad", name: "Salad" },
  { id: "pap", name: "Pap" },
];

const DRINKS = [
  { id: "coke", name: "Coke", price: 15 },
  { id: "juice", name: "Juice", price: 10 },
];

const EXTRAS = [
  { id: "cheese", name: "Extra Cheese", price: 10 },
  { id: "sauce", name: "Extra Sauce", price: 5 },
];

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const [food, setFood] = useState<FoodItem | null>(null);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
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

  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: (v: string[]) => void,
    max: number
  ) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length < max) setSelected([...selected, id]);
      else alert(`You can only select up to ${max}`);
    }
  };

  const totalPrice =
    ((food?.price || 0) +
      selectedDrinks.reduce(
        (sum, d) => sum + (DRINKS.find((item) => item.id === d)?.price || 0),
        0
      ) +
      selectedExtras.reduce(
        (sum, e) => sum + (EXTRAS.find((item) => item.id === e)?.price || 0),
        0
      )) *
    quantity;

  const handleAddToCart = () => {
    if (!food) return;
    dispatch(
      addItem({
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
        sides: selectedSides,
        drinks: selectedDrinks.map((d) => {
          const drink = DRINKS.find((item) => item.id === d)!;
          return { id: drink.id, name: drink.name, price: drink.price };
        }),
        extras: selectedExtras.map((e) => {
          const extra = EXTRAS.find((item) => item.id === e)!;
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
      <View style={styles.header}>
        {/* Back arrow at the start */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#ff6b00" />
        </TouchableOpacity>

        {/* Spacer to push CartIcon to the end */}
        <CartIcon />
      </View>

      <Image source={{ uri: food.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.desc}>{food.description}</Text>
        <Text style={styles.price}>R {food.price.toFixed(2)}</Text>

        {/* SIDES */}
        <Text style={styles.section}>Sides (Select 1 or 2)</Text>
        <View style={styles.optionsRow}>
          {SIDES.map((side) => (
            <TouchableOpacity
              key={side.id}
              style={[
                styles.optionBtn,
                selectedSides.includes(side.id) && styles.optionSelected,
              ]}
              onPress={() =>
                toggleSelection(side.id, selectedSides, setSelectedSides, 2)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSides.includes(side.id) && { color: "#fff" },
                ]}
              >
                {side.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DRINKS */}
        <Text style={styles.section}>Drinks</Text>
        <View style={styles.optionsRow}>
          {DRINKS.map((drink) => (
            <TouchableOpacity
              key={drink.id}
              style={[
                styles.optionBtn,
                selectedDrinks.includes(drink.id) && styles.optionSelected,
              ]}
              onPress={() =>
                toggleSelection(drink.id, selectedDrinks, setSelectedDrinks, 1)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedDrinks.includes(drink.id) && { color: "#fff" },
                ]}
              >
                {drink.name} (+R{drink.price})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EXTRAS */}
        <Text style={styles.section}>Extras</Text>
        <View style={styles.optionsRow}>
          {EXTRAS.map((extra) => (
            <TouchableOpacity
              key={extra.id}
              style={[
                styles.optionBtn,
                selectedExtras.includes(extra.id) && styles.optionSelected,
              ]}
              onPress={() =>
                toggleSelection(extra.id, selectedExtras, setSelectedExtras, 2)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedExtras.includes(extra.id) && { color: "#fff" },
                ]}
              >
                {extra.name} (+R{extra.price})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* QUANTITY */}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  backBtn: {
    marginRight: 16,
  },

  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  image: { width: "100%", height: 260 },
  content: { padding: 16, paddingTop: 20 },
  name: { fontSize: 26, fontWeight: "bold" },
  desc: { color: "#666", marginVertical: 4 },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#ff6b00",
  },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  optionSelected: { backgroundColor: "#ff6b00" },
  optionText: { color: "#000", fontWeight: "bold" },
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
