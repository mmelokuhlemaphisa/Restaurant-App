import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
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
        router.replace("/(tabs)/home"); // ✅ FIXED
      } else {
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
      {/* 🎨 Gradient Background */}
      <View style={styles.topGradient} />

      {/* 🍔 Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>CraveCart</Text>
        <Text style={styles.heroSubtitle}>
          Get your favourite food delivered in minutes.
        </Text>

        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.push("/(tabs)/home")} // ✅ FIXED
          >
            <Text style={styles.primaryText}>Browse Menu</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.secondaryText}>Create Account</Text>
          </Pressable>
        </View>

        <Text style={styles.smallText}>
          Sign in if you already have an account
        </Text>
      </View>

      {/* 🍽️ Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        }}
        style={styles.image}
      />

      {/* ⭐ Feature Cards */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🚀 Fast Delivery</Text>
          <Text style={styles.featureText}>
            Order now and get your food in less than 30 minutes.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🍔 Fresh Food</Text>
          <Text style={styles.featureText}>
            Only the best ingredients, cooked fresh.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>💳 Secure Payments</Text>
          <Text style={styles.featureText}>
            Pay safely with PayFast or Cash on Delivery.
          </Text>
        </View>
      </View>

      {/* 📌 Footer */}
      <Text style={styles.footer}>
        By using CraveCart, you agree to our terms & privacy policy.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  topGradient: {
    position: "absolute",
    top: -200,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#ff6b00",
    opacity: 0.25,
  },

  heroCard: {
    width: "100%",
    padding: 22,
    borderRadius: 25,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginTop: 40,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },

  heroTitle: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 6,
  },

  heroSubtitle: {
    color: "#333",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 8,
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6b00",
    marginLeft: 8,
  },

  btnPressed: {
    opacity: 0.7,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  secondaryText: {
    color: "#ff6b00",
    fontWeight: "bold",
    fontSize: 16,
  },

  smallText: {
    marginTop: 10,
    color: "#888",
    fontSize: 12,
  },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 25,
    marginBottom: 18,
  },

  features: {
    width: "100%",
  },

  featureCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    elevation: 5,
  },

  featureTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#ff6b00",
  },

  featureText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },

  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 14,
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

  authBtnBlack: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  authText: {
    color: "#ff6b00",
    fontWeight: "bold",
  },

  authTextWhite: {
    color: "#fff",
  },

  footer: {
    marginTop: 18,
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    width: "100%",
    marginBottom: 40,
  },
});
