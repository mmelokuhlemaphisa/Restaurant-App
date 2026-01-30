import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
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
import { clearCart } from "../../src/store/cartSlice";
import { deleteCartFromFirestore } from "../../src/services/cartFirestore";
import Checkout from "../components/checkout";

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = auth.currentUser;

  const [address, setAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [editingPayment, setEditingPayment] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [userProfile, setUserProfile] = useState<any>(null);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [user]);

  /* ---------- FETCH USER ---------- */
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        setAddress(data.address || "");
        setPaymentMethod(data.paymentMethod || null);
      }
    };
    fetchUser();
  }, [user]);

  /* ---------- TOTAL ---------- */
  const total = cartItems.reduce((sum, item) => {
    const extras = item.extras?.reduce((a, e) => a + e.price, 0) || 0;
    const drinks = item.drinks?.reduce((a, d) => a + d.price, 0) || 0;
    return sum + item.quantity * (item.price + extras + drinks);
  }, 0);

  /* ---------- SAVE ADDRESS ---------- */
  const saveAddress = async () => {
    if (!address.trim() || !user) {
      Alert.alert("Error", "Invalid address");
      return;
    }
    await updateDoc(doc(db, "users", user.uid), { address });
    setEditingAddress(false);
  };

  /* ---------- SAVE CARD ---------- */
  const savePayment = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      Alert.alert("Error", "All card fields required");
      return;
    }

    const payment = { cardName, cardNumber, expiry, cvv };
    await updateDoc(doc(db, "users", user!.uid), {
      paymentMethod: payment,
    });

    setPaymentMethod(payment);
    setEditingPayment(false);
  };

  /* ---------- PAYSTACK SUCCESS ---------- */
  const handleSuccessfulPayment = async () => {
    if (!user || !address || !paymentMethod) {
      Alert.alert("Error", "Missing checkout info");
      return;
    }

    try {
      const items = cartItems.map((item) => {
        const extras = item.extras?.reduce((a, e) => a + e.price, 0) || 0;
        const drinks = item.drinks?.reduce((a, d) => a + d.price, 0) || 0;

        return {
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          extras: item.extras || [],
          drinks: item.drinks || [],
          itemTotal: item.quantity * (item.price + extras + drinks),
        };
      });

      const subtotal = items.reduce((s, i) => s + i.itemTotal, 0);

      await addDoc(collection(db, "orders"), {
        orderNumber: `ORD-${Date.now()}`,
        userId: user.uid,
        userEmail: user.email,
        customer: {
          name: userProfile?.name || "",
          surname: userProfile?.surname || "",
          phone: userProfile?.phone || "",
          email: user.email,
        },
        items,
        subtotal,
        total: subtotal,
        address,
        paymentMethod,
        status: "paid",
        isPaid: true,
        createdAt: serverTimestamp(),
      });

      dispatch(clearCart());
      await deleteCartFromFirestore(user.uid);

      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Order failed");
    }
  };

  const maskCard = (num: string) => `**** **** **** ${num.slice(-4)}`;

  /* ---------- UI ---------- */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Checkout</Text>

      {/* SUMMARY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((i) => (
          <View key={i.id} style={styles.row}>
            <Text>
              {i.name} x{i.quantity}
            </Text>
            <Text>R {(i.price * i.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* ADDRESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {editingAddress ? (
          <>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity onPress={saveAddress}>
              <Text style={styles.link}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text>{address || "No address saved"}</Text>
            <TouchableOpacity onPress={() => setEditingAddress(true)}>
              <Text style={styles.link}>Change</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* PAYMENT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {editingPayment ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={setCardName}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="number-pad"
              onChangeText={setCardNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Expiry MM/YY"
              onChangeText={setExpiry}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              secureTextEntry
              onChangeText={setCvv}
            />
            <TouchableOpacity onPress={savePayment}>
              <Text style={styles.link}>Save Card</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text>
              {paymentMethod
                ? `${paymentMethod.cardName} • ${maskCard(paymentMethod.cardNumber)}`
                : "No card saved"}
            </Text>
            <TouchableOpacity onPress={() => setEditingPayment(true)}>
              <Text style={styles.link}>Change</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* TOTAL */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>R {total.toFixed(2)}</Text>
      </View>

      {/* PAYSTACK */}
      <Checkout
        email={user?.email || "customer@example.com"}
        totalAmount={total}
        onSuccess={handleSuccessfulPayment}
      />
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },
  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  link: { color: "#ff6b00", marginTop: 6, fontWeight: "600" },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  totalText: { fontSize: 20, fontWeight: "bold" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#ff6b00" },
});
