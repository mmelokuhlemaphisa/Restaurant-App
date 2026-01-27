import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

export default function AdminOrderDetails() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;

  useEffect(() => {
    if (!orderIdStr) return;
    fetchOrder();
  }, [orderIdStr]);

  const fetchOrder = async () => {
    try {
      const docRef = doc(db, "orders", orderIdStr);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);

        if (orderData.userId) {
          const userRef = doc(db, "users", orderData.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) setUser(userSnap.data());
        }
      } else {
        Alert.alert("Error", "Order not found!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch order.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderIdStr), {
        status,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Success", "Order status updated!");
      fetchOrder();
    } catch (error) {
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No order found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <Text>Order Number: {order.orderNumber}</Text>
      <Text>Status: {order.status}</Text>
      <Text>Total: R {order.total}</Text>

      <Text style={styles.subTitle}>User Details</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Phone: {user?.phone}</Text>
      <Text>Address: {user?.address}</Text>
      <Text>City: {user?.city}</Text>
      <Text>Postal Code: {user?.postalCode}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus("preparing")}
        >
          <Text style={styles.btnText}>Preparing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus("completed")}
        >
          <Text style={styles.btnText}>Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#ff6b00" },
  subTitle: { marginTop: 12, fontWeight: "bold" },
  buttons: { marginTop: 20 },
  btn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
