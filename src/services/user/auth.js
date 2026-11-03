const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const prisma = require("../../loader/prisma");
const { client } = require("../../loader/redis");
const config = require("../../config");
const { omitPassword } = require("../../utils/sanitize");

const BCRYPT_ROUNDS = 10;
const refreshKey = (phone) => `refresh:${phone}`;

async function doesExistphone(phone) {
    const exist = await prisma.user.findUnique({ where: { phone } });
    return Boolean(exist);
}

async function hashPassword(pass) {
    return bcrypt.hash(pass, BCRYPT_ROUNDS);
}

async function isValid(pass, hashed) {
    if (!pass || !hashed) return false;
    return bcrypt.compare(pass, hashed);
}

async function creatUser(data) {
    const newuser = await prisma.user.create({ data });
    return omitPassword(newuser);
}

async function userPhoneVarify(phone) {
    await prisma.user.update({
        where: { phone },
        data: { phoneVarify: true },
    });
}

async function getUserByPhone(phone) {
    return prisma.user.findUnique({ where: { phone } });
}

async function getAllUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            full_name: true,
            phone: true,
            admin: true,
            Blocked: true,
            phoneVarify: true,
        },
        orderBy: { id: "asc" },
    });
    return { users, number: users.length };
}

// `data` must already be validated. A new password is hashed here so that no
// caller can store it in plain text by mistake.
async function updateUser(phone, data) {
    const update = { ...data };
    if (update.password) {
        update.password = await hashPassword(update.password);
    }
    const updated = await prisma.user.update({
        where: { phone },
        data: update,
    });
    if (update.password) {
        await revokeRefreshToken(phone);
    }
    return omitPassword(updated);
}

async function resetpass(phone, newPassword) {
    return updateUser(phone, { password: newPassword });
}

async function getUserAnnounce(phone) {
    return prisma.property.findMany({
        where: { userID: phone },
        orderBy: { id: "desc" },
    });
}

function signAccessToken(phone) {
    return JWT.sign({}, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessTtl,
        issuer: config.jwt.issuer,
        subject: phone,
    });
}

async function signRefreshToken(phone) {
    const token = JWT.sign({}, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshTtl,
        issuer: config.jwt.issuer,
        subject: phone,
    });
    const { exp } = JWT.decode(token);
    const ttlSeconds = Math.max(exp - Math.floor(Date.now() / 1000), 1);
    // Only the latest refresh token per user is valid.
    await client.set(refreshKey(phone), token, { EX: ttlSeconds });
    return token;
}

// Returns the phone number stored in a valid access token, or throws 401.
function getUserByAccessToken(accessToken) {
    try {
        const payload = JWT.verify(accessToken, config.jwt.accessSecret, {
            issuer: config.jwt.issuer,
        });
        if (!payload.sub) throw new Error("missing subject");
        return payload.sub;
    } catch (err) {
        throw createError.Unauthorized("Invalid or expired access token");
    }
}

// Returns the phone number stored in a valid, not revoked refresh token, or throws 401.
async function verifyRefreshToken(refreshToken) {
    let payload;
    try {
        payload = JWT.verify(refreshToken, config.jwt.refreshSecret, {
            issuer: config.jwt.issuer,
        });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw createError.Unauthorized("Refresh token expired");
        }
        throw createError.Unauthorized("Invalid refresh token");
    }
    const phone = payload.sub;
    const storedToken = phone ? await client.get(refreshKey(phone)) : null;
    if (!storedToken || storedToken !== refreshToken) {
        throw createError.Unauthorized("Refresh token is not valid anymore");
    }
    return phone;
}

async function revokeRefreshToken(phone) {
    return client.del(refreshKey(phone));
}

module.exports = {
    doesExistphone,
    hashPassword,
    creatUser,
    getUserByPhone,
    getAllUsers,
    isValid,
    updateUser,
    getUserByAccessToken,
    getUserAnnounce,
    signRefreshToken,
    signAccessToken,
    verifyRefreshToken,
    revokeRefreshToken,
    userPhoneVarify,
    resetpass,
};
