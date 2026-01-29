import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { getMenuItems, MenuItem } from "../../src/services/menuServices";
import { addItem } from "../../src/store/cartSlice";
import CategoryFilter from "../components/CategoryFilter";
import HomeHeader from "../components/HomeHeader";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* FETCH MENU (PUBLIC) */
  useEffect(() => {
    getMenuItems().then((data) => setMenu(data));
  }, []);

  /* FILTER + SEARCH */
  const finalMenu = useMemo(() => {
    let filtered = menu;

    if (selectedCategory !== "All") {
      if (selectedCategory === "Popular")
        filtered = filtered.filter((i) => i.popular);
      else if (selectedCategory === "New")
        filtered = filtered.filter((i) => i.new);
      else filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    ...Array.from(new Set(menu.map((i) => i.category))),
  ];
  const popularItems = menu.filter((i) => i.popular);
  const newItems = menu.filter((i) => i.new);

  /*** HERO CAROUSEL ***/
  const heroData = [
    {
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      text: "Delicious Food",
    },
    {
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      text: "Hot & Fresh",
    },
    {
      image:
        "https://images.unsplash.com/photo-1705537748124-926009973f94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHBpenphJTIwc3BlY2lhbHxlbnwwfHwwfHx8MA%3D%3D",
      text: "Try Our Specials",
    },
  ];

  const heroRef = useRef<FlatList>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % heroData.length;
      heroRef.current?.scrollToIndex({ index, animated: true });
    }, 3000); // auto scroll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={finalMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <HomeHeader onSearch={setSearchQuery} />

            {/* HERO CAROUSEL */}
            <View style={{ marginVertical: 16 }}>
              <FlatList
                ref={heroRef}
                data={heroData}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.heroCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                      <Text style={styles.heroText}>{item.text}</Text>
                    </View>
                  </View>
                )}
              />
            </View>

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
                  keyExtractor={(i) => i.id}
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
                  keyExtractor={(i) => i.id}
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
  container: { flex: 1, backgroundColor: "#fefefe", paddingHorizontal: 16, marginTop: 15 },
  listContent: { paddingBottom: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginVertical: 12 },
  heroCard: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 12,
  },
  heroText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  popularCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
  },
  popularImage: { width: "100%", height: 140 },
  card: { backgroundColor: "#fff", borderRadius: 16, marginBottom: 16 },
  image: { width: "100%", height: 180 },
  info: { padding: 14 },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#777", marginVertical: 6 },
  price: { color: "#ff6b00", fontWeight: "bold" },
  addCartBtn: {
    position: "absolute",
    right: 14,
    bottom: 2,
    backgroundColor: "#ff6b00",
    flexDirection: "row",
    padding: 6,
    borderRadius: 20,
  },
  addCartText: { color: "#fff", marginLeft: 6 },
});
