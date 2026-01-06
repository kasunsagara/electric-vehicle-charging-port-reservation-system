import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import emailExistence from "email-existence";

dotenv.config();

const checkEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    emailExistence.check(email, (error, response) => {
      if (error) return reject(error);
      resolve(response); 
    });
  });
};

export async function createUser(req, res) { 
  try {
    const newUserData = req.body;

    if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      return res.status(400).json({
         message: "Invalid email format" 
        });
    }

    const isValidEmail = await checkEmailExists(newUserData.email);
    if (!isValidEmail) {
      return res.status(400).json({ 
        message: "Email does not exist" 
      });
    }

    const existingUser = await User.findOne({ email: newUserData.email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already registered" 
      });
    }

    if (newUserData.role === "admin") {
      if (!req.user) {
        return res.status(401).json({ 
          message: "You are not logged in" 
        });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({ 
          message: "Only admin can add new admins" 
        });
      }
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10); 

    const user = new User(newUserData);
    await user.save();

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      message: "User creation failed",
      error: error.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    const users = await User.find({ email: req.body.email });

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
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

export async function getUserAccount(req, res) {
  try {
    const email = req.query.email; 
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

export async function updateUserAccount(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone, password } = req.body;

    if (email && email !== user.email) {
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const isValidEmail = await checkEmailExists(email);
      if (!isValidEmail) {
        return res.status(400).json({ message: "Email does not exist" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      user.email = email;
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Server error while updating user",
      error: error.message,
    });
  }
}

export async function deleteUserAccount(req, res) {
  const email = req.params.email;

  try {
    if (email === "kasunsagara689@gmail.com") {
      return res.status(403).json({
        message: "You cannot delete the main admin",
      });
    }

    if (req.user.role !== "admin" && req.user.email !== email) {
      return res.status(403).json({
        message: "You can only delete your own account",
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



