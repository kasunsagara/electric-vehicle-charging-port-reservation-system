import express from 'express';
import { createUser, loginUser,logoutUser, getUsers, getUserProfile, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/", getUsers);
userRouter.get("/profile", getUserProfile);
userRouter.delete("/:email", deleteUser);

export default userRouter;


