import {
    loginAuthService,
    registerAuthService,
    getAuthService,
    getAuthsService,
    getUpdateAdminAuthService,
    getUpdateEmailAuthService,
    deleteAuthService,
    updatePasswordAuthService,
} from '../db/services/authService.js';
import { authSchema } from '../schemas/authSchema.js';
import { authLoginSchema } from '../schemas/authLoginSchema.js';
import { authUpdateSchema } from '../schemas/authUpdateSchema.js';
import { generateToken } from '../utils/token/generateToken.js';
import { generateError } from '../utils/generateError.js';
import bcrypt from 'bcrypt';

export async function loginCallBack(req, res, next) {
    try {
        let user = null;
        if (!req.user) {
            const validate = await authLoginSchema.validateAsync(req.body, { stripUnknown: true });
            user = await loginAuthService(validate);
        } else {
            user = req.user;
        }

        const { token, refreshToken } = await generateToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function register(req, res, next) {
    try {
        const validate = await authSchema.validateAsync(req.body, { stripUnknown: true });

        const user = await registerAuthService(validate);

        res.status(201).json({
            status: 201,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function getUserAuth(req, res, next) {
    try {
        const { email } = req.user;
        const newToken = req.newToken;

        const user = await getAuthService(email);

        res.status(200).json({
            status: 200,
            user,
            newToken,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function getUsersAuth(req, res, next) {
    try {
        const users = await getAuthsService();

        res.status(200).json({
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateAdminUser(req, res, next) {
    try {
        const { email } = req.params;
        const { isAdmin } = req.body;

        await getUpdateAdminAuthService(email, isAdmin);

        res.status(200).json({
            status: 200,
            message: 'Rol del usuario actualizado correctamente',
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePasswordUser(req, res, next) {
    try {
        const { email } = req.params;
        const { current_password } = req.body;

        const user = await getAuthService(email);

        const data = user.toJSON();

        const isPasswordValid = await bcrypt.compare(current_password, data.password);

        if(!isPasswordValid){
            generateError('Contraseña actual incorrecta');
        }
        
        const validate = await authUpdateSchema.validateAsync(req.body, { stripUnknown: true });

        await updatePasswordAuthService(email, validate.password);

        res.status(200).json({
            status: 200,
            message: 'Usuario actualizado correctamente',
        });
    } catch (error) {
        next(error);
    }
}

export async function updateEmailUser(req, res, next) {
    try {
        const { email } = req.params;
        const validate = await authUpdateSchema.validateAsync(req.body, { stripUnknown: true });

        await getUpdateEmailAuthService(email, validate.email);

        res.status(200).json({
            status: 200,
            message: 'Correo actualizado correctamente',
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUserAuth(req, res, next) {
    try {
        const { email } = req.body;

        await deleteAuthService(email);

        res.status(200).json({
            status: 200,
            message: 'Usuario eliminado correctamente',
        });
    } catch (error) {
        next(error);
    }
}
