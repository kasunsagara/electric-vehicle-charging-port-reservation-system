import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function createUser(req, res) { 
  try {
    const newUserData = req.body;

    // ✅ If creating admin, only main admin can do it
    if (newUserData.role === "admin") {
      if (!req.user) {
        return res.status(401).json({ message: "You are not logged in" });
      }

      if (req.user.email !== "kasunsagara689@gmail.com") {
        return res.status(403).json({ message: "Only main admin can add new admins" });
      }
    }

    // Hash password
    newUserData.password = bcrypt.hashSync(newUserData.password, 10); 

    const user = new User(newUserData);
    await user.save();

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: "User creation failed",
      error: error.message
    });
  }
}

export async function loginUser(req, res) {
    try {
        const users = await User.find({ email: req.body.email });

        if (users.length == 0) {
            res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (isPasswordCorrect) {
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }, process.env.JWT_SECRET);

            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                }
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Login failed"
        });
    }
}

export async function logoutUser(req, res) {
    try {
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed"
        });
    }
}

export async function getUsers(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not an admin",
    });
  }

  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users, 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
}

export async function getUserProfile(req, res) {
  try {
    const email = req.query.email; // GET request: use query params
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
}


export async function deleteUser(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not an admin",
    });
  }

  const email = req.params.email;

  try {
    // Prevent deleting the main admin
    if (email === "kasunsagara689@gmail.com") {
      return res.status(403).json({
        message: "You cannot delete the main admin",
      });
    }

    const result = await User.deleteOne({ email: email });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
}
