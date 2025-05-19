import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { ProtectRoute } from "../middleware/auth.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.put("/update-profile", ProtectRoute, updateProfile);
UserRouter.get("/check", ProtectRoute, checkAuth);

export default UserRouter;
