import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../src/services/FireBase";

interface UserProfile {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  card: string;
  createdAt: any;
}

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openEditModal = () => {
    if (profile) setEditProfile({ ...profile });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editProfile || !profile) return;
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, "users", user.uid), editProfile);
      setProfile(editProfile);
      setModalVisible(false);
      Alert.alert("Success", "Profile updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👤 My Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>
          {profile.name} {profile.surname}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{profile.phone}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{profile.address}</Text>

        <Text style={styles.label}>Card Details</Text>
        <Text style={styles.value}>{profile.card}</Text>

        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>
          {profile.createdAt?.toDate
            ? profile.createdAt.toDate().toDateString()
            : new Date(profile.createdAt).toDateString()}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#ff6b00" }]}
          onPress={openEditModal}
        >
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#000" }]}
          onPress={handleLogout}
        >
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Profile</Text>

            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.name}
                onChangeText={(text) =>
                  setEditProfile((prev) => prev && { ...prev, name: text })
                }
              />

              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.surname}
                onChangeText={(text) =>
                  setEditProfile((prev) => prev && { ...prev, surname: text })
                }
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.phone}
                onChangeText={(text) =>
                  setEditProfile((prev) => prev && { ...prev, phone: text })
                }
              />

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.address}
                onChangeText={(text) =>
                  setEditProfile((prev) => prev && { ...prev, address: text })
                }
              />

              <Text style={styles.label}>Card Details</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.card}
                onChangeText={(text) =>
                  setEditProfile((prev) => prev && { ...prev, card: text })
                }
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ff6b00" }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.modalBtnText}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#ff6b00",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff7f0",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  label: { fontSize: 14, fontWeight: "bold", color: "#555", marginTop: 12 },
  value: { fontSize: 16, fontWeight: "600", marginTop: 4, color: "#333" },
  editBtn: {
    marginTop: 20,
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  editText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff6b00",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
