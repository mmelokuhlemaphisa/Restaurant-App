import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../src/store";
import { updateItemExtras } from "../../src/store/cartSlice";
import { auth } from "../../src/services/FireBase";
import { saveCartToFirestore } from "../../src/services/cartFirestore";

export default function EditExtrasScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ FIXED
  const dispatch = useDispatch<AppDispatch>();

  const cart = useSelector((state: RootState) => state.cart.items);
  const user = auth.currentUser;

  const itemId = params.id;

  const [item, setItem] = useState<any>(null);
  const [extras, setExtras] = useState<any[]>([]);
  const [drinks, setDrinks] = useState<any[]>([]);

  useEffect(() => {
    if (!itemId) return;

    const selectedItem = cart.find((c) => c.id === itemId);

    if (!selectedItem) {
      Alert.alert("Item not found", "This item is not in your cart.");
      router.back();
      return;
    }

    setItem(selectedItem);
    setExtras(selectedItem.extras || []);
    setDrinks(selectedItem.drinks || []);
  }, [itemId]);

  const toggleExtra = (extra: any) => {
    const exists = extras.some((e) => e.id === extra.id);

    if (exists) {
      setExtras(extras.filter((e) => e.id !== extra.id));
    } else {
      setExtras([...extras, extra]);
    }
  };

  const toggleDrink = (drink: any) => {
    const exists = drinks.some((d) => d.id === drink.id);

    if (exists) {
      setDrinks(drinks.filter((d) => d.id !== drink.id));
    } else {
      setDrinks([...drinks, drink]);
    }
  };

  const saveChanges = async () => {
    if (!item) return;

    dispatch(
      updateItemExtras({
        itemId: item.id,
        extras,
        drinks,
      })
    );

    if (user) {
      await saveCartToFirestore(user.uid, cart);
    }

    Alert.alert("Updated", "Extras updated successfully.");
    router.back();
  };

  const availableExtras = [
    { id: "e1", name: "Cheese", price: 5 },
    { id: "e2", name: "Bacon", price: 8 },
    { id: "e3", name: "Mushrooms", price: 4 },
  ];

  const availableDrinks = [
    { id: "d1", name: "Coke", price: 10 },
    { id: "d2", name: "Fanta", price: 10 },
    { id: "d3", name: "Sprite", price: 10 },
  ];

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Extras</Text>

      <Text style={styles.itemName}>{item.name}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Extras</Text>
        {availableExtras.map((extra) => (
          <TouchableOpacity
            key={extra.id}
            style={[
              styles.optionBtn,
              extras.some((e) => e.id === extra.id) && styles.selected,
            ]}
            onPress={() => toggleExtra(extra)}
          >
            <Text style={styles.optionText}>
              {extra.name} (+R{extra.price})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Drinks</Text>
        {availableDrinks.map((drink) => (
          <TouchableOpacity
            key={drink.id}
            style={[
              styles.optionBtn,
              drinks.some((d) => d.id === drink.id) && styles.selected,
            ]}
            onPress={() => toggleDrink(drink)}
          >
            <Text style={styles.optionText}>
              {drink.name} (+R{drink.price})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  optionBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  selected: {
    backgroundColor: "#ff6b00",
  },
  optionText: {
    fontWeight: "bold",
    color: "#000",
  },
  saveBtn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
