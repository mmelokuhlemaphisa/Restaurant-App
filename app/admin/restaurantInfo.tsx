import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function RestaurantInfo() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const docRef = doc(db, "restaurant", "info");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
      }
    };
    fetchInfo();
  }, []);

  const saveInfo = async () => {
    await setDoc(doc(db, "restaurant", "info"), {
      name,
      address,
      phone,
    });
    alert("Restaurant info saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Info</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.btn} onPress={saveInfo}>
        <Text style={styles.btnText}>Save Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
