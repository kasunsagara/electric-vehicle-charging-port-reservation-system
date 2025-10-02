import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Login successful 🎉");

        // Save token + user in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // 🔹 Redirect based on role
        if (res.data.user.role === "admin") {
          navigate("/admin"); // Admin dashboard
        } else {
          navigate("/port-status"); // Normal user
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message || "Login failed ❌");
      } else {
        toast.error("Something went wrong! ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-teal-700 mb-2 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md font-medium hover:bg-teal-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-teal-700 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
