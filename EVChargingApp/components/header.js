import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
      navigation.navigate("Home");
      alert("Logged out successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
  };

  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Icon name="bolt" size={24} color="#14B8A6" />
        <Text style={styles.logoText}>ChargeNow</Text>
      </View>

      {/* Buttons */}
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
            {/* Dropdown */}
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text style={styles.buttonText}>Profile</Text>
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("MyAccount");
                      setDropdownOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>My Account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
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

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
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
    top: 40,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 50,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontWeight: "600",
    color: "#333",
  },
});
