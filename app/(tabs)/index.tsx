import { auth } from "@/src/services/FireBase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
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
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("../../(tabs)");
      } else {
        router.replace("..");
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
    } else if (selectedCategory === "Popular") {
      setFilteredMenu(menu.filter((item) => item.popular));
    } else if (selectedCategory === "New") {
      setFilteredMenu(menu.filter((item) => item.new));
    } else {
      setFilteredMenu(
        menu.filter(
          (item) => item.category === selectedCategory && !item.popular
        )
      );
    }
  }, [selectedCategory, menu]);

  const popularItems = menu.filter((item) => item.popular);
  const newItems = menu.filter((item) => item.new);

  const filteredPopular = popularItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNew = newItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    "Popular",
    "New",
    ...Array.from(new Set(menu.map((item) => item.category))),
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMenuWithSearch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.headerWrapper}>
              <HomeHeader onSearch={setSearchQuery} />
            </View>

            <View style={styles.categoryWrapper}>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </View>

            {/* SHOW POPULAR SECTION ONLY IF THERE ARE POPULAR ITEMS */}
            {selectedCategory === "All" && filteredPopular.length > 0 && (
              <>
                <Text style={styles.heading}>Popular Now</Text>

                <FlatList
                  data={filteredPopular}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => {
                    const scale = new Animated.Value(1);

                    return (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.popularCard}
                        onPress={() =>
                          router.push({
                            pathname: "/food/[id]",
                            params: { id: item.id },
                          })
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
                          <Image
                            source={{ uri: item.image }}
                            style={styles.popularImage}
                          />

                          <View style={styles.badgeRow}>
                            {item.popular && (
                              <Text style={styles.popularBadge}>
                                🔥 Popular
                              </Text>
                            )}
                            {item.new && (
                              <Text style={styles.newBadge}>🆕 New</Text>
                            )}
                          </View>

                          <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.desc}>{item.description}</Text>
                            <Text style={styles.price}>
                              R {item.price?.toFixed(2)}
                            </Text>

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
              </>
            )}

            {/* SHOW NEW SECTION ONLY IF THERE ARE NEW ITEMS */}
            {selectedCategory === "All" && filteredNew.length > 0 && (
              <>
                <Text style={styles.heading}>New Items</Text>

                <FlatList
                  data={filteredNew}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => {
                    const scale = new Animated.Value(1);

                    return (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.popularCard}
                        onPress={() =>
                          router.push({
                            pathname: "/food/[id]",
                            params: { id: item.id },
                          })
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
                          <Image
                            source={{ uri: item.image }}
                            style={styles.popularImage}
                          />

                          <View style={styles.badgeRow}>
                            {item.popular && (
                              <Text style={styles.popularBadge}>
                                🔥 Popular
                              </Text>
                            )}
                            {item.new && (
                              <Text style={styles.newBadge}>🆕 New</Text>
                            )}
                          </View>

                          <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.desc}>{item.description}</Text>
                            <Text style={styles.price}>
                              R {item.price?.toFixed(2)}
                            </Text>

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
              </>
            )}

            {/* SHOW CATEGORIES HEADING ONLY IF MENU HAS ITEMS */}
            {menu.length > 0 && <Text style={styles.heading}>Categories</Text>}
          </>
        }
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

                <View style={styles.badgeRow}>
                  {item.popular && (
                    <Text style={styles.popularBadge}>🔥 Popular</Text>
                  )}
                  {item.new && <Text style={styles.newBadge}>🆕 New</Text>}
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>

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
    marginTop: 12,
    marginBottom: 10,
  },
  categoryWrapper: {
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 6,
  },

  popularCard: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  popularImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 8,
  },
  popularBadge: {
    backgroundColor: "#ff6b00",
    color: "#fff",
    padding: 6,
    borderRadius: 10,
    fontWeight: "bold",
  },
  newBadge: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 6,
    borderRadius: 10,
    fontWeight: "bold",
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
