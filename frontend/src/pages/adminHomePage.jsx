import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/adminSidebar";
import AdminWelcomePage from "./admin/adminWelcomePage";
import AdminDashboardPage from "./admin/adminDashboardPage";
import AdminPortsPage from "./admin/adminPortsPage";
import AddPortPage from "./admin/addPortPage";
import UpdatePortPage from "./admin/updatePortPage";
import AdminUsersPage from "./admin/adminUserPage";
import AddAdminPage from "./admin/addAdminPage";
import AdminBookingsPage from "./admin/adminBookingsPage";
import AdminFeedbackPage from "./admin/adminFeedbackPage";
import NotFoundPage from "./notFoundPage";

export default function AdminHomePage() {
  return (
    <div className="w-full h-screen flex font-sans bg-gradient-to-br from-green-50 to-emerald-100">

      <AdminSidebar />

      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">

          <Routes>
            <Route path="/" element={<AdminWelcomePage />} />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/ports" element={<AdminPortsPage />} />
            <Route path="/ports/addPort" element={<AddPortPage />} />
            <Route path="/ports/updatePort" element={<UpdatePortPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/users/addAdmin" element={<AddAdminPage />} />
            <Route path="/bookings" element={<AdminBookingsPage />} />
            <Route path="/feedbacks" element={<AdminFeedbackPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}
