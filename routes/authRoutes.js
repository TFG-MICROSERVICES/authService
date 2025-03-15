import express from 'express';
import {
    register,
    loginCallBack,
    getUserAuth,
    getUsersAuth,
    updateAdminUser,
    deleteUserAuth,
    updatePasswordUser,
    updateEmailUser,
} from '../controllers/authController.js';
import { authentication } from '../middlewares/authentication.js';
import { isAdmin } from '../middlewares/admin.js';
import { userExists } from '../middlewares/userExists.js';
import { validateApiKey } from '../middlewares/validateApiKey.js';
import { auth } from '../middlewares/auth.js';
import { loginCallBackGoogle } from '../db/services/googleService.js';
const router = express.Router();

//http://localhost:3001/auth/register
router.post('/register', validateApiKey, register);

//http://localhost:3001/auth/login
router.post('/login', validateApiKey, loginCallBack);

//http://localhost:3001/auth/google/callback
router.get('/google/callback', validateApiKey, loginCallBackGoogle, loginCallBack);

//http://localhost:3001/auth/:id
router.patch('/:id', validateApiKey, authentication, userExists, auth, isAdmin, updateAdminUser);

//http://localhost:3001/auth/password/:id
router.patch('/password/:id', validateApiKey, authentication, userExists, auth, updatePasswordUser);

//http://localhost:3001/auth/email/:id
router.patch('/email/:id', validateApiKey, authentication, userExists, auth, updateEmailUser);

//http://localhost:3001/auth/check
router.post('/check', validateApiKey, authentication, userExists, auth, getUserAuth);

//http://localhost:3001/auth/
router.post('/', validateApiKey, authentication, userExists, auth, isAdmin, getUsersAuth);

//http://localhost:3001/auth/:id
router.delete('/:email', validateApiKey, authentication, userExists, auth, isAdmin, deleteUserAuth);

export default router;
