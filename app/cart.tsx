import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../src/store";
import {
  incrementQty,
  decrementQty,
  removeItem,
  clearCart,
} from "../src/store/cartSlice";

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.price + (item.extras?.reduce((a, e) => a + e.price, 0) || 0)),
    0
  );

  if (cart.length === 0)
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.heading}>🛒 My Cart</Text>
        <Text style={{ marginTop: 20 }}>Your cart is empty!</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 HEADING */}
      <Text style={styles.heading}>🛒 My Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              {item.extras?.map((e) => (
                <Text key={e.id} style={styles.extra}>
                  + {e.name} (R{e.price})
                </Text>
              ))}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(decrementQty(item.id))}
                >
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(incrementQty(item.id))}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => dispatch(removeItem(item.id))}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total: R {total.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => dispatch(clearCart())}
        >
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 30, // space for status bar
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ff6b00",
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 100, height: 100, borderRadius: 12 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  extra: { color: "#666", fontSize: 14 },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  qtyBtn: {
    backgroundColor: "#ff6b00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  qtyValue: { fontSize: 16, fontWeight: "bold", marginHorizontal: 10 },
  removeBtn: { marginLeft: 12 },
  removeText: { color: "red", fontWeight: "bold" },
  totalRow: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  totalText: { fontSize: 20, fontWeight: "bold" },
  clearBtn: {
    marginTop: 8,
    backgroundColor: "#ff6b00",
    padding: 12,
    borderRadius: 10,
  },
  clearText: { color: "#fff", fontWeight: "bold" },
});
