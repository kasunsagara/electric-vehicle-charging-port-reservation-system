import express from 'express';
import { createUser, loginUser, getUsers, getUserProfile, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getUsers);
userRouter.get("/profile", getUserProfile);
userRouter.delete("/:email", deleteUser);

export default userRouter;


