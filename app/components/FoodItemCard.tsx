// app/components/FoodItemCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface FoodItemCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  onPress: () => void;
}

export default function FoodItemCard({
  name,
  description,
  price,
  image,
  onPress,
}: FoodItemCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  name: { fontWeight: "bold", fontSize: 16 },
  description: { fontSize: 12, color: "#555" },
  price: { fontWeight: "bold", color: "#ff6b00", fontSize: 14 },
});
