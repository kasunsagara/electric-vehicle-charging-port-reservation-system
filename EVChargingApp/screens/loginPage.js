import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        Toast.show({ type: "success", text1: "Login successful 🎉" });

        // Redirect based on role
        if (res.data.user.role === "admin") {
          navigation.navigate("Admin");
        } else {
          navigation.navigate("PortStatus");
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        Toast.show({ type: "error", text1: error.response.data.message || "Login failed ❌" });
      } else {
        Toast.show({ type: "error", text1: "Something went wrong! ❌" });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d1fae5", // green-100
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937", // gray-800
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // gray-700
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#111827", // gray-900
  },
  button: {
    backgroundColor: "#0f766e", // teal-700
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signupText: {
    marginTop: 16,
    textAlign: "center",
    color: "#6b7280", // gray-500
    fontSize: 14,
  },
  signupLink: {
    color: "#0f766e", // teal-700
    textDecorationLine: "underline",
  },
});
