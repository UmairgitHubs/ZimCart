import jwt from 'jsonwebtoken';
import config from '../config/config.js';
export const generateAccessToken = (user) => {
    return jwt.sign({ ...user }, config.JWT_SECRET, { expiresIn: '15m' });
};
export const generateRefreshToken = (user) => {
    return jwt.sign({ ...user }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};
//# sourceMappingURL=token.utils.js.map