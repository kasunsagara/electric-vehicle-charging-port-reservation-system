import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/userContext";

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ChargeNow</Text>

        <View style={styles.buttonContainer}>
          {!user ? (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text style={styles.buttonText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  await logout();
                  setDropdownOpen(false);
                  navigation.navigate("Home");
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Dropdown - render outside header for overlay fix */}
      {dropdownOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => {
              console.log("✅ Navigating to MyAccount...");
              navigation.navigate("MyAccount");
              setDropdownOpen(false);
            }}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>My Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("✅ Navigating to MyBookings...");
              navigation.navigate("MyBookings");
              setDropdownOpen(false);
            }}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative", // parent for dropdown
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 16,
    elevation: 3,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f766e",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    backgroundColor: "#0f766e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 58, // adjust if needed
    right: 16,
    width: 160,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
    zIndex: 9999,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontWeight: "600",
    color: "#333",
  },
});
