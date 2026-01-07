import { FiBattery, FiClock, FiDollarSign } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";

const batteryCapacityMap = {
  "Tata Nexon EV": 30.2,
  "Tata Tigor EV": 26.2,
  "MG ZS EV": 44,
  "Hyundai Kona Electric": 39.2,
  "BYD Atto 3": 49.8,
  "Nissan Leaf": 40,

  "Revolt RV400": 3.2,
  "Hero Electric Optima": 1.6,
  "Okinawa i-Praise": 2.0,
  "TVS iQube": 3.4,
  "Bajaj Chetak Electric": 3,
  "Ola S1 Pro": 4,

  "NanoCar EV": 10.5,
  "Micro Luxury EV": 12.8,
  "VIdeo Tron EV": 9,

  "Tata Winger EV": 26,
  "Mahindra eSupro": 25,
  "Piaggio Ape Electric": 8,
};

const getUnitRateByPower = (power) => {
  if (power >= 20) return 800; 
  return 300; 
};

export default function ChargingEstimates({ chargerType, vehicleModel, port }) {
  if (!vehicleModel || !chargerType || !port) return null;

  const charger = port.chargerOptions.find(
    (c) => c.type === chargerType
  );
  if (!charger) return null;

  const batteryCapacity = batteryCapacityMap[vehicleModel] || 0; 
  const chargingTime = batteryCapacity / charger.speed; 
  const unitRate = getUnitRateByPower(charger.speed);
  const estimatedCost = chargingTime * unitRate;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 shadow-lg mt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <FaCalculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Charging Estimates
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBattery className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Battery Capacity
              </span>
              <p className="text-sm text-gray-500">Total battery size</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600">
              {batteryCapacity}
            </span>
            <span className="text-gray-600 ml-1">kWh</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-orange-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Estimated Time
              </span>
              <p className="text-sm text-gray-500">For full charge</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-orange-600">
              {chargingTime.toFixed(2)}
            </span>
            <span className="text-gray-600 ml-1">hours</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Estimated Cost
              </span>
              <p className="text-sm text-gray-500">
                Total charging cost
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-red-600">
              Rs. {estimatedCost.toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
