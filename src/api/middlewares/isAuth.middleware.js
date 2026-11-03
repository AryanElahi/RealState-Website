const createError = require("http-errors");
const { getUserByAccessToken, getUserByPhone } = require("../../services/user/auth");
const { omitPassword } = require("../../utils/sanitize");

const getBearerToken = (req) => {
    const header = req.headers["authorization"] || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) return null;
    return token;
};

const loadUser = async (token) => {
    const phone = getUserByAccessToken(token);
    const user = await getUserByPhone(phone);
    if (!user) throw createError.Unauthorized("User not found");
    if (user.Blocked) throw createError.Forbidden("This account has been blocked");
    return omitPassword(user);
};

module.exports = {
    // Requires a valid access token. Sets req.user (without the password hash).
    verifyAccessToken: async (req, res, next) => {
        try {
            const token = getBearerToken(req);
            if (!token) return next(createError.Unauthorized());
            req.user = await loadUser(token);
            req.payload = { aud: req.user.phone, sub: req.user.phone };
            return next();
        } catch (err) {
            return next(err);
        }
    },

    // Same as verifyAccessToken, but lets anonymous requests through.
    // An invalid token is still rejected.
    optionalAuth: async (req, res, next) => {
        try {
            const token = getBearerToken(req);
            if (token) req.user = await loadUser(token);
            return next();
        } catch (err) {
            return next(err);
        }
    },

    // Must be used after verifyAccessToken.
    verifyadmin: (req, res, next) => {
        if (!req.user) return next(createError.Unauthorized());
        if (req.user.admin !== true) {
            return next(createError.Forbidden("Access denied: Admins only"));
        }
        return next();
    },
};
