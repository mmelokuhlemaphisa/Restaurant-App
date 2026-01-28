import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  FlatList,
  Alert,
} from "react-native";
import { db } from "../../src/services/FireBase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RestaurantInfo() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState<any[]>([]); // List of saved info
  const [hasInfo, setHasInfo] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const docRef = doc(db, "restaurant", "info");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setRestaurantInfo([data]); // show saved info as list
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
        setHasInfo(true);
      }
    } catch (error) {
      console.error("Failed to fetch info:", error);
    }
  };

  const saveInfo = async () => {
    if (!name || !address || !phone) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      const info = { name, address, phone };
      await setDoc(doc(db, "restaurant", "info"), info);

      Keyboard.dismiss();
      Alert.alert("Success", "Restaurant info saved!");

      // Update list immediately
      setRestaurantInfo([info]);

      // Clear form for next entry
      setName("");
      setAddress("");
      setPhone("");
      setHasInfo(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save info.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/admin/dashboard")}
      >
        <Ionicons name="arrow-back" size={24} color="#ff6b00" />
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>

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
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveInfo}>
        <Text style={styles.saveBtnText}>
          {hasInfo ? "Update Info" : "Add Info"} 💾
        </Text>
      </TouchableOpacity>

      {/* 🔹 LIST OF SAVED INFO */}
      {restaurantInfo.length > 0 && (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.listTitle}>Saved Info</Text>
          <FlatList
            data={restaurantInfo}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>Name: {item.name}</Text>
                <Text style={styles.cardText}>Address: {item.address}</Text>
                <Text style={styles.cardText}>Phone: {item.phone}</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#ff6b00",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#ff6b00",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffe6cc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
