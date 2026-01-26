import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../src/services/FireBase";

interface AdminProfile {
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  createdAt: any;
}

export default function AdminProfile() {
  const auth = getAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [editProfile, setEditProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace("../public/auth/login");
        return;
      }

      try {
        const ref = doc(db, "admins", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as AdminProfile);
        } else {
          // first time admin
          const newProfile: AdminProfile = {
            name: "",
            surname: "",
            email: user.email || "",
            phone: "",
            role: "admin",
            createdAt: new Date(),
          };
          await setDoc(ref, newProfile);
          setProfile(newProfile);
        }
      } catch (e) {
        console.error(e);
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
    if (!editProfile) return;
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, "admins", user.uid), editProfile);
      setProfile(editProfile);
      setModalVisible(false);
      Alert.alert("Success", "Admin profile updated");
    } catch (e: any) {
      Alert.alert("Error", e.message);
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
        <Text>No admin profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/admin/dashboard")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>🛠 Admin Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>
          {profile.name} {profile.surname}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{profile.phone}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{profile.role}</Text>

        <Text style={styles.label}>Admin Since</Text>
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

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Admin Profile</Text>

            <ScrollView>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.name}
                onChangeText={(t) =>
                  setEditProfile((p) => p && { ...p, name: t })
                }
              />

              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.surname}
                onChangeText={(t) =>
                  setEditProfile((p) => p && { ...p, surname: t })
                }
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.phone}
                onChangeText={(t) =>
                  setEditProfile((p) => p && { ...p, phone: t })
                }
              />

              {/* NEW EMAIL FIELD */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.email}
                onChangeText={(t) =>
                  setEditProfile((p) => p && { ...p, email: t })
                }
              />

              {/* NEW ROLE FIELD */}
              <Text style={styles.label}>Role</Text>
              <TextInput
                style={styles.input}
                value={editProfile?.role}
                onChangeText={(t) =>
                  setEditProfile((p) => p && { ...p, role: t })
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
  backBtn: { alignSelf: "flex-start", marginBottom: 10 },
  backText: { fontSize: 16, fontWeight: "bold" },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#ff6b00",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff7f0",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  label: { fontSize: 14, fontWeight: "bold", color: "#555", marginTop: 12 },
  value: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
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
