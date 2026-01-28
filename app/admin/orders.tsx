import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersArray: any[] = [];

      querySnapshot.forEach((doc) => {
        ordersArray.push({ id: doc.id, ...doc.data() });
      });

      setOrders(ordersArray);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/admin/dashboard")}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Admin Orders</Text>
      </View>

      {/* 📦 ORDERS LIST */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {item.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.total}>Total: R {item.total}</Text>

            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() =>
                router.push({
                  pathname: "/admin/order-details",
                  params: { orderId: item.id },
                })
              }
            >
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backText: {
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },

  statusBadge: {
    backgroundColor: "#ff6b00",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  total: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },

  viewBtn: {
    marginTop: 14,
    backgroundColor: "#ff6b00",
    paddingVertical: 12,
    borderRadius: 10,
  },

  viewBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
