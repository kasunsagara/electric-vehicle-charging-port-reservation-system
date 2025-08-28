import { Link, Routes, Route } from "react-router-dom";

export default function AdminHomePage() {
  return (
    <div className="w-full h-screen flex font-sans">
      {/* Sidebar */}
      <div className="w-[20%] h-screen bg-green-600 flex flex-col shadow-lg">
        <h2 className="text-white text-2xl font-bold p-6">
          Admin Panel
        </h2>
        <nav className="flex flex-col mt-4">
          <Link
            to="/admin/dashboard"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Users
          </Link>
          <Link
            to="/admin/settings"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-[80%] h-screen bg-green-100 p-8 overflow-y-auto">
        
        <Routes path="/*">
          <Route path="/" element={
            <div className="max-w-4xl mx-auto flex flex-col items-center mt-50">
              <h1 className="text-[54px] font-bold text-teal-700 mb-6">Welcome, Admin!</h1>
              <p className="text-[18px] text-gray-600">
                This is your admin dashboard where you can manage users, view reports, and configure system settings.
              </p>
            </div>
        } />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/users" element={<h1>Users</h1>} />
          <Route path="/settings" element={<h1>Settings</h1>} />
        </Routes>
      </div>
    </div>
  );
}
