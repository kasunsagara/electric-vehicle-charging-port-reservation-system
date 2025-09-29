import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

// Distance calculator
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PortStatusPage({ navigation }) {
  const today = new Date().toISOString().split("T")[0];
  const [userLocation, setUserLocation] = useState({ lat: 8.6541, lng: 81.2139 });
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");

  // ✅ Detect user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Permission denied for location" });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  // ✅ Fetch ports data
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setLoading(true);

      // replace with your PC IP if testing on real phone
      const API_URL = `http://192.168.1.100:5000/api/ports?date=${selectedDate}&time=${selectedTime}`;

      axios
        .get(API_URL)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.data;
          const portsWithDistance = data.map((port) => ({
            ...port,
            distance: getDistanceFromLatLonInKm(
              userLocation.lat,
              userLocation.lng,
              port.coordinates.lat,
              port.coordinates.lng
            ),
          }));
          portsWithDistance.sort((a, b) => a.distance - b.distance);
          setPorts(portsWithDistance);
        })
        .catch((err) => {
          console.error("Error fetching ports:", err);
          Toast.show({ type: "error", text1: "Error fetching port data!" });
        })
        .finally(() => setLoading(false));
    }
  }, [userLocation, selectedDate, selectedTime]);

  // ✅ Booking handler
  const handleBooking = (portId, location, status) => {
    if (status === "available" && selectedDate && selectedTime) {
      Alert.alert("Booking", `Booking port ${portId} at ${location}`);
      // navigation.navigate("BookingPage", { portId, selectedDate, selectedTime, location });
    } else {
      Toast.show({ type: "error", text1: "Please select date and time first." });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Charging Port Status</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Date input */}
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={selectedDate}
        onChangeText={setSelectedDate}
      />

      {/* Time dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Time" value="" />
          <Picker.Item label="08:00 AM" value="08:00" />
          <Picker.Item label="01:00 PM" value="13:00" />
          <Picker.Item label="06:00 PM" value="18:00" />
        </Picker>
      </View>

      {/* Toggle buttons */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === "list" && styles.activeBtn]}
          onPress={() => setView("list")}
        >
          <Text>List View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === "map" && styles.activeBtn]}
          onPress={() => setView("map")}
        >
          <Text>Map View</Text>
        </TouchableOpacity>
      </View>

      {/* Loading spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="teal" style={{ marginTop: 20 }} />
      ) : (
        <>
          {view === "list" ? (
            <FlatList
              data={ports}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.portRow}>
                  <Text style={styles.portText}>
                    {item.portId} - {item.location} ({item.distance.toFixed(1)} km)
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      item.status !== "available" && styles.disabledBtn,
                    ]}
                    disabled={item.status !== "available"}
                    onPress={() => handleBooking(item.portId, item.location, item.status)}
                  >
                    <Text style={styles.bookBtnText}>
                      {item.status === "available" ? "Book Now" : "Unavailable"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }} title="You are here" />
              {ports.map((port) => (
                <Marker
                  key={port._id}
                  coordinate={{
                    latitude: port.coordinates.lat,
                    longitude: port.coordinates.lng,
                  }}
                  title={`Port ${port.portId}`}
                  description={`${port.location} - ${port.status}`}
                />
              ))}
            </MapView>
          )}
        </>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E6F4EA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold" },
  homeBtn: { backgroundColor: "teal", padding: 8, borderRadius: 6 },
  homeBtnText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#CFCFCF", padding: 8, borderRadius: 6, backgroundColor: "#fff", marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 6, backgroundColor: "#fff", marginBottom: 8 },
  picker: { height: 50, width: "100%" },
  toggleRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  toggleBtn: { padding: 10, backgroundColor: "#ddd", borderRadius: 6 },
  activeBtn: { backgroundColor: "#aaf" },
  portRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#fff", marginBottom: 6, borderRadius: 6 },
  portText: { fontSize: 14, flex: 1 },
  bookBtn: { backgroundColor: "orange", padding: 8, borderRadius: 6 },
  bookBtnText: { color: "#fff", fontWeight: "bold" },
  disabledBtn: { backgroundColor: "gray" },
  map: { flex: 1, marginTop: 10, borderRadius: 8 },
});
