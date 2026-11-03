const path = require("path");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
if (process.env.SMS_DRY_RUN !== "true") {
    required.push("SMSIR_API_KEY", "SMSIR_SECRET_KEY");
}
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different");
}

const port = Number(process.env.PORT) || 3000;

const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : "*";
if (corsOrigin === "*" && isProduction) {
    console.warn("CORS_ORIGIN is not set: the API accepts requests from any origin.");
}

module.exports = {
    isProduction,
    port,
    publicUrl: (process.env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/+$/, ""),
    photosDir: process.env.PHOTOS_DIR || path.join(__dirname, "..", "photos"),
    corsOrigin,
    trustProxy: process.env.TRUST_PROXY === "true",
    redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessTtl: process.env.ACCESS_TOKEN_TTL || "1h",
        refreshTtl: process.env.REFRESH_TOKEN_TTL || "30d",
        issuer: process.env.JWT_ISSUER || "zhinge",
    },
    sms: {
        dryRun: process.env.SMS_DRY_RUN === "true",
        apiKey: process.env.SMSIR_API_KEY,
        secretKey: process.env.SMSIR_SECRET_KEY,
    },
    otp: {
        ttlSeconds: Number(process.env.OTP_TTL_SECONDS) || 120,
        resendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
        maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
    },
};
