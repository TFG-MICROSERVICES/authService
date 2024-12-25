import express from "express";
import { 
    register, 
    loginCallBack, 
    getUserAuth, 
    getUsersAuth, 
    deleteUserAuth  
} from "../controllers/authController.js";
import { authentication } from "../middlewares/authentication.js";
import { isAdmin } from "../middlewares/admin.js";
import { userExists } from "../middlewares/userExists.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

//http://localhost:3001/auth/register
router.post("/register",validateApiKey, register);

//http://localhost:3001/auth/login
router.post("/login", validateApiKey, loginCallBack);

//http://localhost:3001/auth/check
router.get("/check", validateApiKey, authentication, userExists, auth, getUserAuth);

//http://localhost:3001/auth/
router.get("/", validateApiKey, authentication, userExists, auth, isAdmin, getUsersAuth);

//http://localhost:3001/auth/:email
router.delete("/:email", validateApiKey, authentication, isAdmin, deleteUserAuth);



export default router;