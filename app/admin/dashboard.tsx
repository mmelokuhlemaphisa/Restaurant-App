import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/services/FireBase";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [menuCount, setMenuCount] = useState(0);
  const [popularCount, setPopularCount] = useState(0);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "menu"));
        const items = snapshot.docs.map((doc) => doc.data());

        setMenuCount(items.length);
        setPopularCount(items.filter((i) => i.popular).length);
        setNewCount(items.filter((i) => i.new).length);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [menuCount, popularCount, newCount, 5, 7, 10, 12] }],
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Restaurant overview</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/admin/adminProfile")}>
          <Ionicons name="person-circle-outline" size={40} color="#ff6b00" />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="restaurant" size={26} color="#ff6b00" />
          <Text style={styles.statNumber}>{menuCount}</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="star" size={26} color="#ff6b00" />
          <Text style={styles.statNumber}>{popularCount}</Text>
          <Text style={styles.statLabel}>Popular</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="sparkles" size={26} color="#ff6b00" />
          <Text style={styles.statNumber}>{newCount}</Text>
          <Text style={styles.statLabel}>New Items</Text>
        </View>
      </View>

      {/* CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Menu Activity</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#ff6b00",
            labelColor: () => "#555",
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#ff6b00",
            },
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/admin/restaurantInfo")}
      >
        <Ionicons name="storefront" size={22} color="#fff" />
        <Text style={styles.btnText}>Restaurant Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/admin/manageMenu")}
      >
        <Ionicons name="fast-food" size={22} color="#fff" />
        <Text style={styles.btnText}>Manage Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/admin/orders")}
      >
        <Ionicons name="clipboard" size={22} color="#fff" />
        <Text style={styles.btnText}>Orders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  subtitle: { color: "#777" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    elevation: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#333",
  },

  btn: {
    backgroundColor: "#ff6b00",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
