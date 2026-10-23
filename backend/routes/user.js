import { Router } from "express";
import { verifytoken } from "../middleware/verify.js";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";

const userRoute = Router();

userRoute.get("/:id", getUser);
userRoute.put("/:id", verifytoken, updateUser);
userRoute.delete("/:id", verifytoken, deleteUser);

export default userRoute;