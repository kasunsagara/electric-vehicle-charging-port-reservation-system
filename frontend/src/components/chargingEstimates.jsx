// src/components/ChargingEstimates.jsx
import React from "react";

// Example battery capacities per vehicle model (kWh)
const batteryCapacityMap = {
  "Tata Nexon EV": 30,
  "MG ZS EV": 44,
  "Hyundai Kona Electric": 39.2,
  "BYD Atto 3": 50,
  "Nissan Leaf": 40,
  "Revolt RV400": 3.24,
  "Hero Electric Optima": 1.6,
  "Ather 450X": 2.9,
  "Okinawa i-Praise": 2.0,
  "Tata Winger EV": 26,
  "Mahindra eSupro": 25,
  "Piaggio Ape Electric": 8,
};

const UNIT_RATE = 400; // Rs per hour

export default function ChargingEstimates({ chargerType, vehicleModel, port }) {
  if (!vehicleModel || !chargerType || !port) return null;

  const charger = port.chargerOptions.find(c => c.type === chargerType);
  if (!charger) return null;

  const batteryCapacity = batteryCapacityMap[vehicleModel] || 0; // kWh
  const chargingTime = batteryCapacity / charger.speed; // hours
  const estimatedCost = chargingTime * UNIT_RATE; // Rs

  return (
    <div className="bg-white text-gray-800 p-6 rounded-2xl border border-gray-400 mt-6">
      <h2 className="text-2xl font-bold mb-4 pb-2 text-center">Charging Estimates</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Battery Capacity:</span>
          <span className="font-medium">{batteryCapacity} kWh</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold">Estimated Charging Time:</span>
          <span className="font-medium">{chargingTime.toFixed(2)} hours</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold">Estimated Cost:</span>
          <span className="font-medium">Rs. {estimatedCost.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
