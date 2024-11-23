import express from "express";
import { register, loginCallBack, getUserAuth, getUsersAuth } from "../controllers/authController.js";
import { authentication } from "../middlewares/authentication.js";
import { isAdmin } from "../middlewares/admin.js";
import { userExists } from "../middlewares/userExists.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/register",validateApiKey, register);

router.post("/login", validateApiKey, loginCallBack);

router.get("/check", validateApiKey, authentication, userExists, isAdmin, getUserAuth);

router.get("/", validateApiKey, authentication, userExists, auth, getUsersAuth);



export default router;