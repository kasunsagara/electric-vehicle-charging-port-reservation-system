import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Picker } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // web-only
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';


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

export default function PortStatusPage() {
  const today = new Date().toISOString().split("T")[0];
  const [userLocation, setUserLocation] = useState({ lat: 8.6541, lng: 81.2139 });
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const navigation = useNavigation();

  // Detect user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 8.6541, lng: 81.2139 }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Fetch ports
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/ports?date=${selectedDate}&time=${selectedTime}`)
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
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Error fetching port data!",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [userLocation, selectedDate, selectedTime]);

  // Booking handler
  const handleBooking = (portId, location, status) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Toast.show({
        type: "error",
        text1: "You must log in to book a charging port!",
      });
      navigation.navigate("Login");
      return;
    }
    if (status === "available" && selectedDate && selectedTime) {
      const encodedLocation = encodeURIComponent(location);
      navigation.navigate("PortBooking", {
        portId,
        date: selectedDate,
        bookingTime: selectedTime,
        location: encodedLocation,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Please select date and time slot first.",
      });
    }
  };

  // Manual location search
  const handleManualLocationSearch = async () => {
    if (!manualLocation) {
      Toast.show({ type: "error", text1: "Please enter a location name!" });
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          manualLocation
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        Toast.show({ type: "success", text1: `Location set to ${manualLocation}` });
      } else {
        Toast.show({ type: "error", text1: "Location not found!" });
      }
    } catch {
      Toast.show({ type: "error", text1: "Failed to fetch location!" });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Charging Port Status</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.manualLocation}>
        <TextInput
          placeholder="Enter manual location"
          value={manualLocation}
          onChangeText={setManualLocation}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleManualLocationSearch}>
          <Text style={styles.buttonText}>Set Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleView}>
        <TouchableOpacity
          style={[styles.toggleButton, view === "list" && styles.activeToggle]}
          onPress={() => setView("list")}
        >
          <Text>List View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, view === "map" && styles.activeToggle]}
          onPress={() => setView("map")}
        >
          <Text>Map View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateTime}>
        <TextInput style={styles.input} value={selectedDate} onChangeText={setSelectedDate} />
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Time" value="" />
          <Picker.Item label="08:00" value="08:00" />
          <Picker.Item label="13:00" value="13:00" />
          <Picker.Item label="18:00" value="18:00" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }} />
      ) : (
        <>
          {view === "list" && (
            <>
              {!selectedDate || !selectedTime ? (
                <View style={styles.alertYellow}>
                  <Text>Please select date and time to view charging port details.</Text>
                </View>
              ) : ports.length === 0 ? (
                <View style={styles.alertRed}>
                  <Text>No ports available for the selected time.</Text>
                </View>
              ) : (
                <ScrollView horizontal>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.th}>Port</Text>
                      <Text style={styles.th}>Status</Text>
                      <Text style={styles.th}>Location</Text>
                      <Text style={styles.th}>Distance</Text>
                      <Text style={styles.th}>Action</Text>
                    </View>
                    {ports.map((port) => (
                      <View key={port._id} style={styles.tableRow}>
                        <Text style={styles.td}>{port.portId}</Text>
                        <Text style={styles.td}>
                          {port.status === "available" ? "Available" : "Booked"}
                        </Text>
                        <Text style={styles.td}>{port.location}</Text>
                        <Text style={styles.td}>{port.distance.toFixed(1)} km</Text>
                        <TouchableOpacity
                          disabled={port.status !== "available"}
                          style={[
                            styles.bookButton,
                            port.status !== "available" && styles.disabledButton,
                          ]}
                          onPress={() => handleBooking(port.portId, port.location, port.status)}
                        >
                          <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </>
          )}

          {view === "map" && (
            <View style={{ height: 500, marginVertical: 10 }}>
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
                {ports.map((port) => (
                  <Marker
                    key={port._id}
                    position={[port.coordinates.lat, port.coordinates.lng]}
                  >
                    <Popup>
                      <Text>Port {port.portId}</Text>
                      <Text>{port.location}</Text>
                      <Text>Distance: {port.distance.toFixed(2)} km</Text>
                      <Text>Status: {port.status}</Text>
                      <TouchableOpacity
                        disabled={port.status !== "available"}
                        onPress={() => handleBooking(port.portId, port.location, port.status)}
                        style={[
                          styles.bookButton,
                          port.status !== "available" && styles.disabledButton,
                        ]}
                      >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </View>
          )}
        </>
      )}

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#CCFBF1" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  button: { backgroundColor: "#059669", padding: 10, borderRadius: 6 },
  buttonText: { color: "white", fontWeight: "bold" },
  manualLocation: { flexDirection: "row", marginBottom: 16 },
  input: { flex: 1, padding: 8, borderRadius: 6, backgroundColor: "white", marginRight: 8 },
  toggleView: { flexDirection: "row", marginBottom: 16 },
  toggleButton: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 6, marginRight: 8, backgroundColor: "white" },
  activeToggle: { backgroundColor: "#A7F3D0", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  dateTime: { flexDirection: "row", marginBottom: 16, alignItems: "center", width: '90%' },
  picker: { height: 40, width: 120, backgroundColor: "white", borderRadius: 6 },
  alertYellow: { backgroundColor: "#FEF3C7", padding: 10, borderRadius: 6, marginBottom: 16 },
  alertRed: { backgroundColor: "#FEE2E2", padding: 10, borderRadius: 6, marginBottom: 16 },
  table: { minWidth: 600 },
  tableHeader: { flexDirection: "row", backgroundColor: "#D1D5DB", padding: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: 8, alignItems: "center" },
  th: { flex: 1, fontWeight: "bold" },
  td: { flex: 1 },
  bookButton: { backgroundColor: "#F97316", padding: 6, borderRadius: 6 },
  bookButtonText: { color: "white", fontWeight: "bold" },
  disabledButton: { backgroundColor: "#9CA3AF" },
});
