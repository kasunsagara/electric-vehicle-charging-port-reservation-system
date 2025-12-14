import express from 'express';
import { createUser, loginUser,logoutUser, getUsers, getUserAccount, updateUserAccount, deleteUserAccount } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/", getUsers);
userRouter.get("/me", getUserAccount);
userRouter.put("/:id", updateUserAccount);
userRouter.delete("/:email", deleteUserAccount);

export default userRouter;


