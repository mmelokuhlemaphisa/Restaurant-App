import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../src/services/FireBase";
import { useDispatch } from "react-redux";
import { clearCart } from "../../src/store/cartSlice";

export default function PayfastScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { orderId } = params as any;

  const [payfastUrl, setPayfastUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = async () => {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setPayfastUrl(orderSnap.data().payfastUrl);
      } else {
        Alert.alert("Error", "Order not found");
        router.replace("/");
      }
    };

    fetchUrl();
  }, [orderId]);

  const handleNavigation = async (navState: any) => {
    const url = navState.url;

    // SUCCESS
    if (url.includes("payfast-success")) {
      await updateDoc(doc(db, "orders", orderId), {
        status: "paid",
        isPaid: true,
      });

      dispatch(clearCart());
      Alert.alert("Payment Success", "Your payment was successful!");
      router.replace("/");
    }

    // CANCEL
    if (url.includes("payfast-cancel")) {
      await updateDoc(doc(db, "orders", orderId), {
        status: "cancelled",
      });

      Alert.alert("Payment Cancelled", "You cancelled the payment.");
      router.replace("/checkout");
    }
  };

  if (!payfastUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: payfastUrl }}
      onNavigationStateChange={handleNavigation}
      onLoadEnd={() => setLoading(false)}
    />
  );
}
