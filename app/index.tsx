import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/FireBase";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ Logged in → go straight to app
        router.replace("/(tabs)");
      } else {
        // ✅ Not logged in → show welcome screen
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Welcome to CraveCart</Text>
      <Text style={styles.subtitle}>
        Browse the menu, choose your favourite food, and order in seconds.
      </Text>

      {/* ✅ PUBLIC ACCESS */}
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.btnText}>Browse Menu</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.authBtn}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.authText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.authBtn, { backgroundColor: "#000" }]}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={[styles.authText, { color: "#fff" }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 18,
    fontSize: 16,
  },
  browseBtn: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  authBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ff6b00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  authText: {
    color: "#ff6b00",
    fontWeight: "bold",
  },
});
