import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff6b00",
        headerStyle: { backgroundColor: "#ff6b00" },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/logo.png")} // <-- your logo path
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Menu</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/logo.png")} // <-- your logo path
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Cart</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/logo.png")} // <-- your logo path
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Orders</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="checkout"
        options={{
          title: "Checkout",
          tabBarButton: () => null, // 👈 hide from tab bar
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
