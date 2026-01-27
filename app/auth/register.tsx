import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../src/services/FireBase";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ CARD FIELDS
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        name,
        surname,
        email,
        phone,
        address,

        // 💳 Save card as payment method
        paymentMethod: {
          cardName,
          cardNumber,
          expiry,
          cvv,
        },

        createdAt: new Date(),
      });

      router.replace("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Surname"
        style={styles.input}
        onChangeText={setSurname}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        onChangeText={setPhone}
      />
      <TextInput
        placeholder="Address"
        style={styles.input}
        onChangeText={setAddress}
      />

      {/* ================= CARD DETAILS ================= */}
      <Text style={styles.subTitle}>Card Details</Text>

      <TextInput
        placeholder="Cardholder Name"
        style={styles.input}
        onChangeText={setCardName}
      />
      <TextInput
        placeholder="Card Number (16 digits)"
        style={styles.input}
        keyboardType="number-pad"
        onChangeText={setCardNumber}
      />
      <TextInput
        placeholder="Expiry Date (MM/YY)"
        style={styles.input}
        onChangeText={setExpiry}
      />
      <TextInput
        placeholder="CVV"
        style={styles.input}
        keyboardType="number-pad"
        secureTextEntry
        onChangeText={setCvv}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff6b00",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15, color: "#ff6b00" },
});
