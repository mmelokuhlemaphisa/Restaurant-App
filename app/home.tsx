import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import CategoryFilter from "./components/CategoryFilter";
import { getMenuItems, MenuItem } from "../src/services/menuServices";
import CartIcon from "./components/CartIcon";

export default function Home() {
  const router = useRouter();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    getMenuItems().then((data) => {
      setMenu(data);
      setFilteredMenu(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredMenu(menu);
    } else {
      setFilteredMenu(
        menu.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory, menu]);

  const categories = [
    "All",
    ...Array.from(new Set(menu.map((item) => item.category))),
  ];

  return (
    <>
      {/* Stack header options */}
      <Stack.Screen
        options={{
          title: "CraveCart Menu",
          headerStyle: { backgroundColor: "#ff6b00" },
          headerTintColor: "#fff",
          headerRight: () => <CartIcon />,
        }}
      />

      <View style={styles.container}>
        {/* 🔹 HEADING */}
        <Text style={styles.title}>🍽️ CraveCart Menu</Text>

        {/* 🔹 CATEGORY FILTER */}
        <View style={styles.categoryWrapper}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

        {/* 🔹 FOOD LIST */}
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/food/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 12,
  },
  categoryWrapper: {
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b00",
  },
});
