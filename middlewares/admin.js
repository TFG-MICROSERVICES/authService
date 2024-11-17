import { getAuthService } from "../db/services/authService.js";
import { generateError } from "../utils/generateError.js";

export async function isAdmin(req, res, next) {
    try{
        if(req.user?.email){
            const user = await getAuthService(req.user.email);
            if(!user.admin) generateError("Unauthorized", 401);
        }
        next();
    }catch(error){
        next(error);
    }
}