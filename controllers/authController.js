import { 
    loginAuthService, 
    registerAuthService, 
    getAuthService, 
    getAuthsService,
    deleteAuthService,
} from '../db/services/authService.js';
import { authSchema } from '../schemas/authSchema.js';
import { authLoginSchema } from '../schemas/authLoginSchema.js';
import jwt from 'jsonwebtoken';

export async function loginCallBack(req, res, next) {
    try {
        const validate = await authLoginSchema.validateAsync(req.body, { stripUnknown: true });

        const user = await loginAuthService(validate);

        const token = jwt.sign(
            { 
                email: user.email,
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '30min' 
            }
        );

        const refreshToken = jwt.sign(
            { 
                email: user.email,
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '1d' 
            }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
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

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }catch(error){
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

export async function deleteUserAuth(req, res, next) {
    try {
        const { email } = req.user;

        const user = await deleteAuthService(email);

        await user.destroy();

        res.status(200).json({
            message: "User deleted successfully",
        });
    }catch(error){
        next(error);
    }
}
    
