import { generateError } from "../utils/generateError.js";

export function auth(req, res, next) {
    if (!req.user) {
        return generateError("Error, no está logueado", 401);
    }
    next();
}