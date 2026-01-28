import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../src/services/FireBase";

type Admin = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  role: string;
  createdAt: Timestamp;
};

export default function AddAdminScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch admins from Firebase
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "admins"));
      const list: Admin[] = [];
      snap.forEach((d) =>
        list.push({ id: d.id, ...(d.data() as Omit<Admin, "id">) }),
      );
      setAdmins(list);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Reset form fields
  const resetForm = () => {
    setName("");
    setSurname("");
    setPhone("");
    setEmail("");
    setRole("admin");
    setPassword("");
    setEditingAdmin(null);
  };

  // Add new admin
  const handleAddAdmin = async () => {
    if (!name || !surname || !phone || !email || password.length < 6) {
      Alert.alert("Error", "All fields required (password min 6 chars)");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.toLowerCase(),
        password,
      );

      await setDoc(doc(db, "admins", cred.user.uid), {
        name,
        surname,
        phone,
        email: email.toLowerCase(),
        role,
        createdAt: serverTimestamp(),
      });

      resetForm();
      fetchAdmins();
      Alert.alert("Success", "Admin added");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Update existing admin
  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, "admins", editingAdmin.id), {
        name,
        surname,
        phone,
        email: email.toLowerCase(),
        role,
      });

      Alert.alert("Updated", "Admin updated successfully");
      resetForm();
      fetchAdmins();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = (admin: Admin) => {
    Alert.alert(
      "Remove Admin",
      `Are you sure you want to remove ${admin.name} ${admin.surname}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deleteAdmin(admin),
        },
      ],
    );
  };

  const deleteAdmin = async (admin: Admin) => {
    try {
      await deleteDoc(doc(db, "admins", admin.id));
      // Remove admin from state immediately
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      Alert.alert("Removed", "Admin deleted successfully");
      // If we were editing this admin, reset form
      if (editingAdmin?.id === admin.id) resetForm();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/admin/dashboard")}>
          <Ionicons name="arrow-back" size={26} color="#ff6b00" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {editingAdmin ? "Edit Admin Profile" : "Add Admin"}
        </Text>
      </View>

      {/* Form */}
      <TextInput
        placeholder="First Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      {!editingAdmin && (
        <TextInput
          placeholder="Temporary Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Role"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      {editingAdmin && (
        <Text style={{ marginBottom: 10, color: "#666" }}>
          Created: {editingAdmin.createdAt?.toDate().toLocaleString()}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
      >
        <Text style={styles.buttonText}>
          {editingAdmin ? "Update Admin" : "Create Admin"}
        </Text>
      </TouchableOpacity>

      {/* Admin List */}
      <Text style={styles.subTitle}>Admins</Text>
      <FlatList
        data={admins}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.adminCard}>
            <View>
              <Text style={styles.adminName}>
                {item.name} {item.surname}
              </Text>
              <Text style={styles.adminEmail}>{item.email}</Text>
              <Text style={{ color: "#666" }}>{item.phone}</Text>
              <Text style={{ color: "#666" }}>{item.role}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setEditingAdmin(item);
                  setName(item.name);
                  setSurname(item.surname);
                  setPhone(item.phone);
                  setEmail(item.email);
                  setRole(item.role);
                }}
              >
                <Ionicons name="create" size={22} color="#ff6b00" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAdmin(item)}>
                <Ionicons name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#ff6b00" },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  adminCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adminName: { fontWeight: "bold", fontSize: 16 },
  adminEmail: { color: "#666" },
  actions: { flexDirection: "row", gap: 16 },
});
