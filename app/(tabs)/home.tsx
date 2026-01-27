import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { getMenuItems, MenuItem } from "../../src/services/menuServices";
import { addItem } from "../../src/store/cartSlice";
import CategoryFilter from "../components/CategoryFilter";
import HomeHeader from "../components/HomeHeader";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* FETCH MENU (PUBLIC) */
  useEffect(() => {
    getMenuItems().then((data) => {
      setMenu(data);
    });
  }, []);

  /* FILTER + SEARCH (fixed) */
  const finalMenu = useMemo(() => {
    let filtered = menu;

    if (selectedCategory !== "All") {
      if (selectedCategory === "Popular") {
        filtered = filtered.filter((item) => item.popular);
      } else if (selectedCategory === "New") {
        filtered = filtered.filter((item) => item.new);
      } else {
        filtered = filtered.filter(
          (item) => item.category === selectedCategory,
        );
      }
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [menu, selectedCategory, searchQuery]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      }),
    );
  };

  const categories = [
    "All",
    "Popular",
    "New",
    ...Array.from(new Set(menu.map((item) => item.category))),
  ];

  const popularItems = menu.filter((item) => item.popular);
  const newItems = menu.filter((item) => item.new);

  return (
    <View style={styles.container}>
      <FlatList
        data={finalMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <HomeHeader onSearch={setSearchQuery} />

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* 🔥 POPULAR */}
            {selectedCategory === "All" && popularItems.length > 0 && (
              <>
                <Text style={styles.heading}>Popular Now</Text>
                <FlatList
                  data={popularItems}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.popularCard}
                      onPress={() =>
                        router.push({
                          pathname: "/food/[id]",
                          params: { id: item.id },
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.popularImage}
                      />
                      <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>
                          R {item.price.toFixed(2)}
                        </Text>

                        <TouchableOpacity
                          style={styles.addCartBtn}
                          onPress={() => handleAddToCart(item)}
                        >
                          <Ionicons name="cart" size={18} color="#fff" />
                          <Text style={styles.addCartText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {/* 🆕 NEW ITEMS */}
            {selectedCategory === "All" && newItems.length > 0 && (
              <>
                <Text style={styles.heading}>New Items</Text>
                <FlatList
                  data={newItems}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.popularCard}
                      onPress={() =>
                        router.push({
                          pathname: "/food/[id]",
                          params: { id: item.id },
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.popularImage}
                      />
                      <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>
                          R {item.price.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {menu.length > 0 && <Text style={styles.heading}>Categories</Text>}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/food/[id]", params: { id: item.id } })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>R {item.price.toFixed(2)}</Text>

              <TouchableOpacity
                style={styles.addCartBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="cart" size={18} color="#fff" />
                <Text style={styles.addCartText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fefefe", paddingHorizontal: 16 },
  listContent: { paddingBottom: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginVertical: 12 },
  popularCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
  },
  popularImage: { width: "100%", height: 140 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
  },
  image: { width: "100%", height: 180 },
  info: { padding: 14 },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#777", marginVertical: 6 },
  price: { color: "#ff6b00", fontWeight: "bold" },
  addCartBtn: {
    position: "absolute",
    right: 14,
    bottom: 14,
    backgroundColor: "#ff6b00",
    flexDirection: "row",
    padding: 8,
    borderRadius: 20,
  },
  addCartText: { color: "#fff", marginLeft: 6 },
});
