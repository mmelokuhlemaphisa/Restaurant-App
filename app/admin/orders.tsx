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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Orders</Text>
        <Text style={styles.headerSub}>
          View and manage all customer orders
        </Text>
      </View>

      {/* ORDERS LIST */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/admin/AdminOrderDetails",
                params: { orderNumber: item.id },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
              <View
                style={[
                  styles.statusDot,
                  item.status === "completed" && { backgroundColor: "#28a745" },
                  item.status === "preparing" && { backgroundColor: "#ff6b00" },
                  item.status === "rejected" && { backgroundColor: "#d11a2a" },
                ]}
              />
            </View>

            <Text style={styles.statusText}>Status: {item.status}</Text>
            <Text style={styles.totalText}>Total: R {item.total}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // HEADER
  header: {
    marginBottom: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#ff6b00" },
  headerSub: { fontSize: 14, color: "#666", marginTop: 4 },

  // CARD
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: { fontWeight: "bold", fontSize: 18 },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff6b00",
  },

  statusText: { marginTop: 6, color: "#444" },
  totalText: { marginTop: 6, fontWeight: "bold" },
});
