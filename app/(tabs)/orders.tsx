import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db, auth } from "../../src/services/FireBase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(list);
  };

  return (
    <View style={styles.container}>
   
 <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <Text style={{ fontWeight: "bold" }}>Order ID: {item.id}</Text>
            <Text>Total: R {item.total}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 20,
  },
  order: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 10,
  },
});
