import { Auth } from '../../models/auth.js';
import bcrypt from 'bcrypt';
import { generateError } from '../../utils/generateError.js';

export async function registerAuthService(data) {
    try {
        const existsUser = await Auth.findOne({
            where: {
                email: data.email,
            },
        });

        if (existsUser) generateError('Este email ya existe', 400);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.admin = false;

        const user = await Auth.create({
            email: data.email,
            password: hashedPassword,
            admin: data.admin,
        });

        if (!user) generateError('Error al crear el usuario', 500);

        return user;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function getAuthsService() {
    try {
        const users = await Auth.findAll();

        if (!users) generateError('Users not found', 404);

        return users;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function getAuthService(email) {
    try {
        const user = await Auth.findOne({
            attributes: ['email', 'admin', 'id', 'password'],
            where: {
                email: email,
            },
        });

        return user;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function loginAuthService(data) {
    try {
        const user = await Auth.findOne({
            where: {
                email: data.email,
            },
        });

        if (!user) generateError('User not found', 404);

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) generateError('Invalid password', 400);

        return user;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function getUpdateAdminAuthService(email, isAdmin) {
    try {
        const user = await Auth.update(
            { admin: isAdmin },
            {
                where: {
                    email: email,
                },
            }
        );

        if (!user) generateError('User not found', 404);

        const newUser = await Auth.findOne({
            where: {
                email: email,
            },
        });

        return newUser;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function updatePasswordAuthService(email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Auth.update(
            { password: hashedPassword },
            {
                where: {
                    email: email,
                },
            }
        );

        if (!user) generateError('User not found', 404);

        const newUser = await Auth.findOne({
            where: {
                email: email,
            },
        });

        return newUser;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function getUpdateEmailAuthService(email, newEmail) {
    try {
        const existsUser = await Auth.findOne({
            where: {
                email: email,
            },
        });

        if (!existsUser) generateError('Usuario no encontrado', 404);

        const existsNewEmail = await Auth.findOne({
            where: {
                email: newEmail,
            },
        });

        if (existsNewEmail) generateError('Este correo ya existe', 400);

        const user = await Auth.update(
            { email: newEmail },
            {
                where: {
                    email: email,
                },
            }
        );

        if (!user) generateError('EL correo no ha podido ser actualizado', 500);

        return true;
    } catch (error) {
        generateError(error.message, error.status);
    }
}

export async function deleteAuthService(email) {
    try {
        const user = await Auth.findOne({
            where: {
                email: email,
            },
        });

        if (!user) generateError('Usuario no encontrado', 404);

        await user.destroy();

        return user;
    } catch (error) {
        generateError(error.message, error.status);
    }
}
