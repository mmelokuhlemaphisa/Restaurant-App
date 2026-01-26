import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../src/services/FireBase";
import { RootState } from "../../src/store";
import { serverTimestamp } from "firebase/firestore";

import { clearCart } from "../../src/store/cartSlice";
import { deleteCartFromFirestore } from "../../src/services/cartFirestore";

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const user = auth.currentUser;

  const [address, setAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Visa **** 4242");

  // 🔥 FIXED: Auth redirect
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user]);

  // 🔥 FIXED: Fetch address correctly
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setAddress(userSnap.data().address || "");
      }
    };

    fetchAddress();
  }, [user]);

  const total = cartItems.reduce((sum, item) => {
    const extrasTotal = item.extras?.reduce((a, e) => a + e.price, 0) || 0;
    const drinksTotal = item.drinks?.reduce((a, d) => a + d.price, 0) || 0;

    return sum + item.quantity * (item.price + extrasTotal + drinksTotal);
  }, 0);

  const saveAddress = async () => {
    if (!user || !address.trim()) {
      Alert.alert("Error", "Please enter a valid address");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      address,
    });

    setEditingAddress(false);
  };

  const placeOrder = async () => {
    if (!address) {
      Alert.alert("Missing Address", "Please add a delivery address");
      return;
    }

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    try {
      const orderItems = cartItems.map((item) => {
        const extrasTotal =
          item.extras?.reduce((sum, e) => sum + e.price, 0) || 0;

        const drinksTotal =
          item.drinks?.reduce((sum, d) => sum + d.price, 0) || 0;

        return {
          itemId: item.id,
          name: item.name,
          image: item.image,
          basePrice: item.price,
          quantity: item.quantity,

          extras: item.extras || [],
          drinks: item.drinks || [],

          itemTotal: item.quantity * (item.price + extrasTotal + drinksTotal),
        };
      });

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.itemTotal,
        0
      );

      await addDoc(collection(db, "orders"), {
        orderNumber: `ORD-${Date.now()}`,

        userId: user.uid,
        userEmail: user.email || "",

        items: orderItems,

        subtotal,
        deliveryFee: 0,
        total: subtotal,

        address,
        paymentMethod,

        status: "pending",
        isPaid: false,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // ✅ CLEAR CART HERE
      dispatch(clearCart());
      await deleteCartFromFirestore(user.uid);

      Alert.alert("Order Placed 🎉", "Your order is being processed");
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to place order");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Checkout</Text>

      {/* ORDER SUMMARY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {cartItems.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text>
              {item.name} x{item.quantity}
            </Text>
            <Text>R {(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* DELIVERY ADDRESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        {editingAddress ? (
          <>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter delivery address"
              multiline
            />
            <TouchableOpacity onPress={saveAddress}>
              <Text style={styles.link}>Save Address</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.text}>{address || "No address saved"}</Text>
            <TouchableOpacity onPress={() => setEditingAddress(true)}>
              <Text style={styles.link}>Change Address</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* PAYMENT METHOD */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text>{paymentMethod}</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Mastercard **** 1189")}
        >
          <Text style={styles.link}>Change Card</Text>
        </TouchableOpacity>
      </View>

      {/* TOTAL */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>R {total.toFixed(2)}</Text>
      </View>

      {/* PLACE ORDER */}
      <TouchableOpacity style={styles.button} onPress={placeOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  text: {
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  link: {
    color: "#ff6b00",
    marginTop: 8,
    fontWeight: "600",
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  button: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
