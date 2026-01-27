import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const ordersArray: any[] = [];
    querySnapshot.forEach((doc) => {
      ordersArray.push({ id: doc.id, ...doc.data() });
    });
    setOrders(ordersArray);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Admin Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/admin/AdminOrderDetails",
                params: { orderId: item.id }, // ✅ SAME NAME
              })
            }
          >
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: R {item.total}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#ff6b00" },
  card: { padding: 16, borderWidth: 1, marginBottom: 12, borderRadius: 10 },
  orderNumber: { fontWeight: "bold", fontSize: 18 },
});
