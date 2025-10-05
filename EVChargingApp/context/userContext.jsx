import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from AsyncStorage when app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async (userData, token) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", token);
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
