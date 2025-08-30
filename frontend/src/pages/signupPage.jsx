import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 👈 add this

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();  // 👈 initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const res = await axios.post("http://localhost:5000/api/users", {
        ...formData,
        role: "customer",
      });

      if (res.status === 201 || res.status === 200) {
        alert("Signup successful 🎉");
        navigate("/login");   // 👈 redirect to login page
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Signup failed ❌");
      } else {
        alert("Something went wrong!");
      }
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="w-full max-w-md bg-teal-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md font-medium hover:bg-teal-800 transition"
          >
            Create an account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-teal-700 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
