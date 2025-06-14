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

//GET http://localhost:3001/auth/
router.get('/', validateApiKey, authentication, userExists, auth, isAdmin, getUsersAuth);

//GET http://localhost:3001/auth/google/callback
router.get('/google/callback', validateApiKey, loginCallBackGoogle, loginCallBack);

//POST http://localhost:3001/auth/register
router.post('/register', validateApiKey, register);

//POST http://localhost:3001/auth/login
router.post('/login', validateApiKey, loginCallBack);

//POST http://localhost:3001/auth/check
router.post('/check', validateApiKey, authentication, userExists, auth, getUserAuth);

//PATCH http://localhost:3001/auth/:id
router.patch('/:id', validateApiKey, authentication, userExists, auth, isAdmin, updateAdminUser);

//PATCH http://localhost:3001/auth/password/:id
router.patch('/password/:email', validateApiKey, authentication, userExists, auth, updatePasswordUser);

//PATCH http://localhost:3001/auth/email/:email
router.patch('/email/:email', validateApiKey, authentication, userExists, auth, updateEmailUser);

//DELETE http://localhost:3001/auth/:email
router.delete('/:email', validateApiKey, authentication, userExists, auth, isAdmin, deleteUserAuth);

export default router;
