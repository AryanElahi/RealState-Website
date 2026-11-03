const rateLimit = require("express-rate-limit");

const message = (text) => ({ success: 0, status: 429, message: text });

// Endpoints that send an SMS cost money and can be used to spam a number.
const smsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: message("Too many code requests, please try again later"),
});

// Slows down password and OTP guessing.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: message("Too many attempts, please try again later"),
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: message("Too many requests, please try again later"),
});

module.exports = {
    smsLimiter,
    authLimiter,
    apiLimiter,
};
