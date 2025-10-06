import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Bookings fetched:", res.data);
      const bookingsArray = res.data.bookings || [];
      setBookings(bookingsArray);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      Toast.show({
        type: "error",
        text1: "Failed to fetch bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }} />
      ) : (
        <>
          {bookings.length === 0 ? (
            <View style={styles.alertRed}>
              <Text>No bookings available.</Text>
            </View>
          ) : (
            <ScrollView horizontal>
              <View style={styles.table}>
                {/* ===== Table Header ===== */}
                <View style={styles.tableHeader}>
                  <Text style={styles.th}>Booking ID</Text>
                  <Text style={styles.th}>Port ID</Text>
                  <Text style={styles.th}>Vehicle</Text>
                  <Text style={styles.th}>Charger</Text>
                  <Text style={styles.th}>Date & Time</Text>
                  <Text style={styles.th}>Estimated Info</Text>
                </View>

                {/* ===== Table Rows ===== */}
                {bookings.map((booking) => (
                  <View key={booking._id} style={styles.tableRow}>
                    <Text style={styles.td}>{booking.bookingId}</Text>
                    <Text style={styles.td}>{booking.portId}</Text>

                    <View style={[styles.td, { flexDirection: "column" }]}>
                      <Text>{booking.vehicleType || "-"}</Text>
                      <Text>{booking.vehicleModel || ""}</Text>
                    </View>

                    <Text style={styles.td}>{booking.chargerType}</Text>

                    <View style={[styles.td, { flexDirection: "column" }]}>
                      <Text>{new Date(booking.bookingDate).toLocaleDateString()}</Text>
                      <Text>{booking.bookingTime}</Text>
                    </View>

                    {/* === Combined Estimated Info === */}
                    <View style={[styles.td, { flexDirection: "column" }]}>
                      <Text>Battery: {booking.estimatedBatteryCapacity || "-"}</Text>
                      <Text>Time: {booking.estimatedChargingTime || "-"}</Text>
                      <Text>Cost: Rs. {booking.estimatedCost || "-"}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#CCFBF1", // bg-teal-100
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  alertRed: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  table: { minWidth: 800 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D1D5DB", // gray-300
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  th: {
    flex: 1,
    fontWeight: "bold",
  },
  td: {
    flex: 1,
  },
});
