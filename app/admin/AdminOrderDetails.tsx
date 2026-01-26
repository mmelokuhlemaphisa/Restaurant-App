import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function AdminOrderDetails({ route }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      // 1️⃣ Fetch order
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);

        // 2️⃣ Fetch user using userId from order
        if (orderData.userId) {
          const userRef = doc(db, "users", orderData.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data());
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success", "Order status updated!");
      fetchOrder();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>No Order Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      {/* ✅ ORDER INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Order Number:</Text>
        <Text>{order.orderNumber}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text>{order.status}</Text>

        <Text style={styles.label}>Total:</Text>
        <Text>R {order.total}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text>{order.address}</Text>
      </View>

      {/* ✅ USER INFO */}
      <Text style={styles.subTitle}>User Details</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text>{user?.name || "Not Available"}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text>{user?.email || "Not Available"}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text>{user?.phone || "Not Available"}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text>{user?.address || "Not Available"}</Text>
      </View>

      {/* ITEMS */}
      <Text style={styles.subTitle}>Items</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>Total: R {item.itemTotal.toFixed(2)}</Text>
          </View>
        )}
      />

      {/* STATUS BUTTONS */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus("preparing")}
        >
          <Text style={styles.btnText}>Set Preparing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus("completed")}
        >
          <Text style={styles.btnText}>Set Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnReject}
          onPress={() => updateStatus("rejected")}
        >
          <Text style={styles.btnText}>Reject Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#ff6b00" },
  subTitle: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
  infoBox: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: { fontWeight: "bold", marginTop: 8 },
  itemBox: {
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  itemName: { fontWeight: "bold" },
  buttons: { marginTop: 20 },
  btn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnReject: {
    backgroundColor: "#d11a2a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
