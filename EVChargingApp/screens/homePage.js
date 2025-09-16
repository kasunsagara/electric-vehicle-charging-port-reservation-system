import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomePage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Text style={styles.title}>
          Electric Vehicle Charging Port Reservation System
        </Text>
        <Text style={styles.subtitle}>
          The future of electric vehicle charging is here with the ability to
          easily find, book, and manage your EV charging sessions.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PortStatus")}
        >
          <Text style={styles.buttonText}>Check Ports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4f1e0", // light green background
  },
  heroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f766e", // teal color
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563", // gray color
    textAlign: "center",
    marginBottom: 25,
    maxWidth: 300,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#0f766e",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0f766e",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});
