import { Auth } from "../../models/auth.js";
import bcrypt from "bcrypt"
import { generateError } from "../../utils/generateError.js";

export async function registerAuthService(data){
    try{
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.admin = false;

        const user = await Auth.create({
            email: data.email,
            password: hashedPassword,
            admin: data.admin,
        });

        if(!user) generateError("Error al crear el usuario", 500);

        return user;
    }catch(error){
        generateError(error.message, error.status);
    }
}

export async function getAuthsService(){
    try{
        const users = await Auth.findAll();

        if(!users) generateError("Users not found", 404);

        return users;
    }catch(error){
        generateError(error.message, error.status);
    }
}


export async function getAuthService(email){
    try{
        const user = await Auth.findOne({
            where: {
                email: email,
            }
        });

        if(!user) generateError("User not found", 404);

        return user;
    }catch(error){
        generateError(error.message, error.status);
    }
}

export async function loginAuthService(data){
    try{
        const user = await Auth.findOne({
            where: {
                email: data.email,
            }
        });

        if(!user) generateError("User not found", 404);

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if(!isPasswordValid) generateError("Invalid password", 400);

        return user;
    }catch(error){
        generateError(error.message, error.status);
    }
}