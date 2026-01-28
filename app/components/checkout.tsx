import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { useRouter } from "expo-router";

interface CheckoutProps {
  email: string;
  totalAmount: number; // in Rand
}

const Checkout: React.FC<CheckoutProps> = ({ email, totalAmount }) => {
  const { popup } = usePaystack();
  const router = useRouter();

  const handlePay = () => {
    popup.checkout({
      email,
      amount: totalAmount ,
      onSuccess: (res) => {
        console.log("Success:", res);
        Alert.alert("Payment Successful", "Thank you for your order!", [
          {
            text: "OK",
            onPress: () => router.replace("/home"), // redirect to Home
          },
        ]);
        // Optional: Dispatch Redux action to clear cart here
      },
      onCancel: () => {
        console.log("User cancelled");
        Alert.alert("Payment Cancelled", "Your payment was cancelled.", [
          {
            text: "OK",
            onPress: () => router.replace("/checkout"), // stay on checkout
          },
        ]);
      },
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePay}>
      <Text style={styles.buttonText}>Pay Now</Text>
    </TouchableOpacity>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
