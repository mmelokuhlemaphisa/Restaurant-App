import { Alert, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function PayfastSuccess() {
  const router = useRouter();

  useEffect(() => {
    Alert.alert("Payment Success", "Your payment was successful!");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Payment Successful 🎉</Text>
      <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
        <Text style={{ marginTop: 20, color: "#ff6b00" }}>Go Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}
