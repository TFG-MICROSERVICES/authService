import jwt from "jsonwebtoken";

export async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;
        const { refreshToken } = req.body;

        if (!authorization || authorization === "undefined") {
            req.user = null;
            return next();
        }

        const token = authorization.split(" ")[1].replace(/"/g, ''); // Remove quotes from Bearer token
        console.log("token:", token);

        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
            const expiresInMinutes = (tokenInfo.exp * 1000 < Date.now() + 4 * 60 * 1000);

            if (expiresInMinutes && refreshToken && refreshToken !== "undefined") {
                const refreshTokenInfo = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const newToken = jwt.sign(
                    { 
                        email: refreshTokenInfo.email,
                    }, 
                    process.env.JWT_SECRET,
                    { 
                        expiresIn: '15min' 
                    }
                );
                console.log("Nuevo token:", newToken);
                res.setHeader("Authorization", `Bearer ${newToken}`);
                const newTokenInfo = jwt.verify(newToken, process.env.JWT_SECRET);
                req.user = newTokenInfo;
                req.newToken = newToken;
                return next();
            }

            req.user = tokenInfo;
            return next();
        } catch (jwtError) {
            console.log("Error específico de JWT:", jwtError.message);
            req.user = null;
            return next(jwtError);
        }
    } catch (error) {
        console.log("Error general:", error);
        req.user = null;
        return next(error);
    }
}
