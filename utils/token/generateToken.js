import jwt from 'jsonwebtoken';

export async function generateToken(user) {
    const token = jwt.sign(
        {
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '60min',
        }
    );

    const refreshToken = jwt.sign(
        {
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );

    return { token, refreshToken };
}
