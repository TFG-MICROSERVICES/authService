import { getAuthService } from "../db/services/authService.js";
import { generateError } from "../utils/generateError.js";

export async function userExists(req, res, next) {
    try {
        if (req.user?.email) {
            const { email } = req.user;
            const usuario = await getAuthService(email);

            if (!usuario) generateError("Error, el usuario con el que intenta acceder no existe",401);

            req.user = {
                email: usuario.email,
            };
        }

        next();
    } catch (error) {
        next(error);
    }
}