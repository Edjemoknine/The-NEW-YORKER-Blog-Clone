import express from "express";
const userRoute = express.Router();

import { verifytoken } from "../middleware/verify.ts";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller.ts";

userRoute.get("/:id", getUser);
userRoute.put("/:id", verifytoken, updateUser);
userRoute.delete("/:id", verifytoken, deleteUser);

export default userRoute;
