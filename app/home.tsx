import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { getMenuItems, MenuItem } from "../src/services/menuService";

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    getMenuItems().then(setMenu);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ CraveCart Menu</Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>
                R {item.price ? item.price.toFixed(2) : "0.00"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: 160 },
  info: { padding: 12 },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#666", marginVertical: 4 },
  price: { fontSize: 16, fontWeight: "bold", color: "#ff6b00" },
});
