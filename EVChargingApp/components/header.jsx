import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/userContext";

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>ChargeNow</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!user ? (
          <>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View>
              <TouchableOpacity style={styles.button} onPress={() => setDropdownOpen(!dropdownOpen)}>
                <Text style={styles.buttonText}>Profile</Text>
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdown}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate("MyAccount");
                      setDropdownOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>My Account</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("MyBookings");
                      setDropdownOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>My Bookings</Text>
                  </Pressable>
                </View>
              )}
            </View>

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
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, marginTop: 8 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { fontSize: 20, fontWeight: "700", color: "#0f766e" },
  buttonContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  button: { backgroundColor: "#0f766e", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  dropdown: { position: "absolute", top: 45, right: 0, width: 150, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 5, zIndex: 50 },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdownText: { fontWeight: "600", color: "#333" },
});
