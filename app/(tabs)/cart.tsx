import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import {
  clearCart,
  decrementQty,
  incrementQty,
  removeItem,
  setCart,
} from "../../src/store/cartSlice";
import { auth } from "../../src/services/FireBase";
import {
  saveCartToFirestore,
  deleteCartFromFirestore,
  getCartFromFirestore,
} from "../../src/services/cartFirestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  // 🔥 Get user reliably
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 1️⃣ Load cart from Firestore
  useEffect(() => {
    if (!user) return;

    (async () => {
      const firestoreCart = await getCartFromFirestore(user.uid);
      dispatch(setCart(firestoreCart));
      setFirstLoad(false);
    })();
  }, [user]);

  // 2️⃣ Save cart to Firestore
  useEffect(() => {
    if (!user) return;
    if (firstLoad) return; // prevents overwriting during first load

    saveCartToFirestore(user.uid, cart);
  }, [cart, user, firstLoad]);

  const total = cart.reduce((sum, item) => {
    const drinksTotal = item.drinks?.reduce((a, d) => a + d.price, 0) || 0;
    const extrasTotal = item.extras?.reduce((a, e) => a + e.price, 0) || 0;
    return sum + item.quantity * (item.price + drinksTotal + extrasTotal);
  }, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.heading}>🛒 Loading Cart...</Text>
      </SafeAreaView>
    );
  }

  if (cart.length === 0)
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.heading}>🛒 My Cart</Text>
        <Text style={{ marginTop: 20 }}>Your cart is empty!</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              {item.sides && item.sides.length > 0 && (
                <Text style={styles.extra}>Sides: {item.sides.join(", ")}</Text>
              )}

              {item.drinks?.map((d) => (
                <Text key={d.id} style={styles.extra}>
                  Drink: {d.name} (+R{d.price})
                </Text>
              ))}

              {item.extras?.map((e) => (
                <Text key={e.id} style={styles.extra}>
                  Extra: {e.name} (+R{e.price})
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
          style={styles.checkoutBtn}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={async () => {
            dispatch(clearCart());
            if (user) {
              await deleteCartFromFirestore(user.uid);
            }
          }}
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
    paddingTop: 30,
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
  checkoutBtn: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  image: { width: 100, height: 100, borderRadius: 12 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  extra: { color: "#666", fontSize: 14, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
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
