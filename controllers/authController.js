import { 
    loginAuthService, 
    registerAuthService, 
    getAuthService, 
    getAuthsService,
    getUpdateAdminAuthService,
    getUpdatePasswordAuthService,
    getUpdateEmailAuthService,
    deleteAuthService,
} from '../db/services/authService.js';
import { authSchema } from '../schemas/authSchema.js';
import { authLoginSchema } from '../schemas/authLoginSchema.js';
import { authUpdateSchema } from '../schemas/authUpdateSchema.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/token/generateToken.js';

export async function loginCallBack(req, res, next) {
    try {
        const validate = await authLoginSchema.validateAsync(req.body, { stripUnknown: true });

        const user = await loginAuthService(validate);

        const { token, refreshToken } = await generateToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Cambia a true si usas HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        res.status(200).json({
            message: "User logged in successfully",
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function register(req, res, next) {
    try {
        const validate = await authSchema.validateAsync(req.body);

        const user = await registerAuthService(validate);

        const { token, refreshToken } = await generateToken(user);

        console.log("token",token,"refresh token", refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Cambia a true si usas HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
            token,
        });
    }catch(error){
        console.log(error);
        next(error);
    }
}

export async function getUserAuth(req, res, next) {
    try {
        const { email } = req.user;

        const user = await getAuthService(email);

        res.status(200).json({
            user,
        });
    }catch(error){
        next(error);
    }
}

export async function getUsersAuth(req, res, next) {
    try {
        const users = await getAuthsService();

        res.status(200).json({
            users,
        });
    }catch(error){
        next(error);
    }
}

export async function updateAdminUser(req, res, next) {
    try {
        const { email } = req.params;
        const { isAdmin } = req.body;

        const user = await getUpdateAdminAuthService(email,isAdmin);

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }catch(error){
        next(error);
    }
}

export async function updatePasswordUser(req, res, next) {
    try {
        const { email } = req.params;
        const validate = await authUpdateSchema.validateAsync(req.body);

        const user = await getUpdatePasswordAuthService(email,validate.password);


        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }catch(error){
        next(error);
    }
}

export async function updateEmailUser(req, res, next) {
    try {
        const { email } = req.params;
        const validate = await authUpdateSchema.validateAsync(req.body);

        const user = await getUpdateEmailAuthService(email,validate.email);


        res.status(200).json({
            message: "Email updated successfully",
            user,
        });
    }catch(error){
        next(error);
    }
}

export async function deleteUserAuth(req, res, next) {
    try {
        const { email } = req.params;

        const user = await deleteAuthService(email);

        res.status(200).json({
            message: "User deleted successfully",
            user,
        });
    }catch(error){
        next(error);
    }
}
    
