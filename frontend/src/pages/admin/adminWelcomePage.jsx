import { useState, useEffect } from "react";
import { FaChargingStation, FaUsers, FaCalendarCheck } from "react-icons/fa";

export default function AdminWelcomePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Error parsing user:", err);
        }
    }
}, []);

return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
        <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaChargingStation className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Welcome, {user ? user.name || user.username || "Admin" : "Admin"}!
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                This is your admin dashboard where you can manage ports,
                users, and view reports for the ChargeNow EV charging system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaChargingStation className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                    Port Management
                </h3>
                <p className="text-gray-600 text-sm">
                    Manage charging stations and availability
                </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaUsers className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                    User Management
                </h3>
                <p className="text-gray-600 text-sm">
                    View and manage system users
                </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FaCalendarCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                        Booking Reports
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Monitor all charging sessions
                    </p>
                </div>
            </div>
        </div>
    </div>
)
}

        