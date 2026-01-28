import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Switch,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../src/store";
import {
  fetchMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItem,
} from "../../src/store/adminMenuSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ManageMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.adminMenu);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // form states
  const [itemId, setItemId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [popular, setPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // search & filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "popular" | "new">("all");

  useEffect(() => {
    dispatch(fetchMenu());
  }, []);

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl("");
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const imageRef = ref(storage, `menu/${Date.now()}.jpg`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  /* ---------------- MODAL HANDLERS ---------------- */
  const openAddModal = () => {
    setIsEdit(false);
    setItemId("");
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage("");
    setImageUrl("");
    setPopular(false);
    setIsNew(false);
    setModalVisible(true);
  };

  const openEditModal = (item: MenuItem) => {
    setIsEdit(true);
    setItemId(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setDescription(item.description);
    setImage("");
    setImageUrl(item.image);
    setPopular(item.popular);
    setIsNew(item.new);
    setModalVisible(true);
  };

  const saveItem = async () => {
    let finalImage = imageUrl;

    if (image.startsWith("file://")) {
      finalImage = await uploadImage(image);
    }

    const data = {
      name,
      category,
      price: Number(price),
      description,
      image: finalImage,
      popular,
      new: isNew,
    };

    if (isEdit) {
      await dispatch(updateMenuItem({ id: itemId, ...data }));
    } else {
      await dispatch(addMenuItem(data));
    }

    setModalVisible(false);
    dispatch(fetchMenu());
  };

  /* ---------------- SEARCH & FILTER ---------------- */
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "all"
          ? true
          : filter === "popular"
            ? item.popular
            : item.new;

      return matchSearch && matchFilter;
    });
  }, [menu, search, filter]);

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Manage Menu</Text>
      </View>

      {/* SEARCH */}
      <TextInput
        style={styles.search}
        placeholder="Search food or category..."
        value={search}
        onChangeText={setSearch}
      />

      {/* FILTER */}
      <View style={styles.filterRow}>
        {["all", "popular", "new"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f as any)}
          >
            <Text
              style={[styles.filterText, filter === f && { color: "#fff" }]}
            >
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ADD */}
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumb} />

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>R {item.price}</Text>
              <Text>{item.category}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => dispatch(deleteMenuItem(item.id))}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {isEdit ? "Edit Item" : "Add Item"}
          </Text>

          {(image || imageUrl) && (
            <Image source={{ uri: image || imageUrl }} style={styles.preview} />
          )}

          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.btnText}>Pick Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChangeText={(text) => {
              setImageUrl(text);
              setImage("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.switchRow}>
            <Text>Popular</Text>
            <Switch value={popular} onValueChange={setPopular} />
          </View>

          <View style={styles.switchRow}>
            <Text>New</Text>
            <Switch value={isNew} onValueChange={setIsNew} />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backText: { fontWeight: "bold" },

  title: { fontSize: 24, fontWeight: "bold", color: "#ff6b00" },

  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  filterRow: { flexDirection: "row", gap: 10, marginBottom: 10 },

  filterBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff6b00",
    alignItems: "center",
  },

  filterActive: { backgroundColor: "#ff6b00" },

  filterText: { fontWeight: "bold", color: "#ff6b00" },

  addBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },

  addText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  card: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
  },

  thumb: { width: 60, height: 60, borderRadius: 10 },

  itemName: { fontWeight: "bold", fontSize: 16 },

  actions: { gap: 6 },

  editBtn: { backgroundColor: "#000", padding: 8, borderRadius: 8 },

  deleteBtn: { backgroundColor: "#ff6b00", padding: 8, borderRadius: 8 },

  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },

  modal: { flex: 1, padding: 20 },

  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#ff6b00" },

  preview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginVertical: 10,
  },

  imageBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#ff6b00",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  cancelBtn: { padding: 14, alignItems: "center" },
});
