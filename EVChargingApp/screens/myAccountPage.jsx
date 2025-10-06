import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Get user data from AsyncStorage
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (!parsedUser?.email) {
          Toast.show({
            type: "error",
            text1: "User not logged in",
          });
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/users/me?email=${parsedUser.email}`
        );
        setUser(res.data.user);
      } catch (error) {
        console.error("AxiosError", error);
        Toast.show({
          type: "error",
          text1: error.response?.data?.message || "Failed to load account details",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>My Account</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone: </Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Role: </Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#CCFBF1", // bg-teal-100
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    fontSize: 16,
    color: "#374151",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111827",
  },
  value: {
    fontSize: 16,
    color: "#374151",
  },
});
