import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import CategoryFilter from "../components/CategoryFilter";
import HomeHeader from "../components/HomeHeader";
import { getMenuItems, MenuItem } from "../../src/services/menuServices";
import { auth } from "@/src/services/FireBase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addItem } from "../../src/store/cartSlice";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    });

    return unsub;
  }, []);

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

  const filteredMenuWithSearch = filteredMenu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item: MenuItem) => {
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
    );
  };

  const categories = [
    "All",
    ...Array.from(new Set(menu.map((item) => item.category))),
  ];

  return (
    <View style={styles.container}>
      {/* 🔹 SEARCH + CART HEADER */}
      <View style={styles.headerWrapper}>
        <HomeHeader onSearch={setSearchQuery} />
      </View>

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
        data={filteredMenuWithSearch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const scale = new Animated.Value(1);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/food/[id]", params: { id: item.id } })
              }
              onPressIn={() =>
                Animated.spring(scale, {
                  toValue: 0.97,
                  useNativeDriver: true,
                }).start()
              }
              onPressOut={() =>
                Animated.spring(scale, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start()
              }
            >
              <Animated.View style={{ transform: [{ scale }] }}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>

                  {/* Add to Cart Button */}
                  <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.addCartText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
  },

  headerWrapper: {
    marginTop: 12, // small spacing above the header
    marginBottom: 10, // spacing below the header
  },
  categoryWrapper: {
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  desc: {
    color: "#777",
    marginVertical: 6,
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b00",
    marginTop: 4,
  },
  addCartBtn: {
    position: "absolute",
    bottom: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addCartText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});
