import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminOrderDetails() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

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
    } catch {
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
    } catch {
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
      <View style={styles.center}>
        <Text style={styles.title}>No order found</Text>
      </View>
    );
  }

  const statusColor =
    order.status === "completed"
      ? "#16a34a"
      : order.status === "preparing"
        ? "#f59e0b"
        : "#6b7280";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/admin/orders")}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
          <Text style={styles.backText}>Orders</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      {/* 🧾 ORDER CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Order #{order.orderNumber}</Text>

        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>R {order.total}</Text>
        </View>
      </View>

      {/* 👤 CUSTOMER CARD */}
      <View style={styles.card}>
        <Text style={styles.subTitle}>Customer Details</Text>

        <Info label="Name" value={user?.name} />
        <Info label="Email" value={user?.email} />
        <Info label="Phone" value={user?.phone} />
        <Info label="Address" value={user?.address} />
        <Info label="City" value={user?.city} />
        <Info label="Postal Code" value={user?.postalCode} />
      </View>

      {/* 🔘 ACTIONS */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.prepareBtn]}
          onPress={() => updateStatus("preparing")}
        >
          <Text style={styles.btnText}>Mark as Preparing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.completeBtn]}
          onPress={() => updateStatus("completed")}
        >
          <Text style={styles.btnText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🔹 SMALL INFO ROW */
const Info = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 10,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    color: "#6b7280",
    fontWeight: "600",
  },

  value: {
    fontWeight: "600",
  },

  buttons: {
    marginTop: 10,
  },

  btn: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  prepareBtn: {
    backgroundColor: "#f59e0b",
  },

  completeBtn: {
    backgroundColor: "#16a34a",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
