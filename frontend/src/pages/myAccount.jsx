import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Get email dynamically from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.email) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/users/me?email=${storedUser.email}`
        );
        setUser(res.data.user);
      } catch (error) {
        console.error("AxiosError", error);
        toast.error(
          error.response?.data?.message || "Failed to load account details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data available.</p>;

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-teal-50 shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Account</h1>
        <p className="mb-4">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="mb-4">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-4">
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}
