import { Router } from "express";
import { verifytoken } from "../middleware/verify.ts";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller.ts";

const userRoute = Router();

userRoute.get("/:id", getUser);
userRoute.put("/:id", verifytoken, updateUser);
userRoute.delete("/:id", verifytoken, deleteUser);

export default userRoute;
