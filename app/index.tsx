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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("../../(tabs)");
      } else {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

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

      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => router.push("/")}
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

      {/* Bottom Section - No empty space */}
      <View style={styles.bottom}>
        <Text style={styles.bottomTitle}>Why choose CraveCart?</Text>

        <View style={styles.benefitRow}>
          <Text style={styles.benefitDot}>•</Text>
          <Text style={styles.benefitText}>Fast delivery & easy ordering</Text>
        </View>

        <View style={styles.benefitRow}>
          <Text style={styles.benefitDot}>•</Text>
          <Text style={styles.benefitText}>Best deals & daily specials</Text>
        </View>

        <View style={styles.benefitRow}>
          <Text style={styles.benefitDot}>•</Text>
          <Text style={styles.benefitText}>Browse without signing in</Text>
        </View>
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
    paddingHorizontal: 10,
  },
  browseBtn: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  authBtn: {
    flex: 1,
    backgroundColor: "#fff",
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
  bottom: {
    width: "100%",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
  },
  bottomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  benefitDot: {
    fontSize: 18,
    marginRight: 8,
    color: "#ff6b00",
  },
  benefitText: {
    fontSize: 15,
    color: "#666",
  },
});
