import { getAuthService } from '../db/services/authService.js';
import { generateError } from '../utils/generateError.js';

export async function isAdmin(req, res, next) {
    try {
        const apiKey = req.headers['x-internal-key'];

        if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
            return next();
        }

        if (req.user?.email) {
            const user = await getAuthService(req.user.email);
            if (!user.admin) generateError('Unauthorized', 401);
        }

        next();
    } catch (error) {
        next(error);
    }
}
