import jwt from "jsonwebtoken";

export async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (authorization) {
            const token = authorization.split(" ")[1]; // Bearer

            try {
                const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
                req.user = tokenInfo;
                return next();
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    const { refreshToken } = req.cookies;

                    if (refreshToken) {
                        try {
                            const refreshTokenInfo = jwt.verify(
                                refreshToken,
                                process.env.REFRESH_TOKEN_SECRET
                            );

                            const expiresIn = refreshTokenInfo.exp * 1000 - Date.now();
                            const expiresInHours = expiresIn / (1000 * 60 * 60);

                            if (expiresInHours < 1) {
                                const newRefreshToken = jwt.sign(
                                    { 
                                        email: refreshTokenInfo.email,
                                    },
                                    process.env.REFRESH_TOKEN_SECRET,
                                    { expiresIn: "1d" }
                                );

                                res.cookie("refreshToken", newRefreshToken, {
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: "None",
                                    maxAge: 24 * 60 * 60 * 1000,
                                });
                            }

                            const newToken = jwt.sign(
                                { 
                                    email: refreshTokenInfo.email,
                                },
                                process.env.JWT_SECRET,
                                { expiresIn: "15m" }
                            );

                            res.setHeader("Authorization", `Bearer ${newToken}`);
                            req.user = refreshTokenInfo;

                            return next();
                        } catch (refreshError) {
                            req.user = null;
                            return res.status(401).json({ 
                                message: "Invalid refresh token" 
                            });
                        }
                    } else {
                        return res.status(401).json({ 
                            message: "No refresh token provided" 
                        });
                    }
                } else {
                    return res.status(401).json({ 
                        message: "Invalid token" 
                    });
                }
            }
        } else {
            return res.status(401).json({ 
                message: "Authorization header missing" 
            });
        }
    } catch (error) {
        req.user = null;
        return next(error);
    }
}
