const crypto = require("crypto");
const createError = require("http-errors");
const { Token, VerificationCode } = require("sms-ir");
const { client } = require("../../loader/redis");
const config = require("../../config");

const token = new Token();
const verificationCode = new VerificationCode();

const OTP_STATUS = {
    OK: 1,
    WRONG: 2,
    EXPIRED: 3,
};

const otpKey = (phone) => `otp:${phone}`;
const cooldownKey = (phone) => `otp:cooldown:${phone}`;

// Cryptographically secure 5 digit code.
function getRandomInt() {
    return crypto.randomInt(10000, 100000);
}

async function sendSMS(code, number) {
    if (config.sms.dryRun) {
        console.log(`[SMS_DRY_RUN] verification code for ${number}: ${code}`);
        return;
    }
    const tokenResult = await token.get(config.sms.apiKey, config.sms.secretKey);
    return verificationCode.send(tokenResult, number, code);
}

// Generates a code, sends it and stores it in Redis with an expiry.
// The same number can only request a new code once per cooldown period.
async function sendVerificationCode(phone) {
    const allowed = await client.set(cooldownKey(phone), "1", {
        NX: true,
        EX: config.otp.resendCooldownSeconds,
    });
    if (!allowed) {
        throw createError(429, "Please wait before requesting a new code");
    }
    const code = getRandomInt();
    await client.set(otpKey(phone), JSON.stringify({ code: String(code), attempts: 0 }), {
        EX: config.otp.ttlSeconds,
    });
    try {
        await sendSMS(code, phone);
    } catch (err) {
        await client.del([otpKey(phone), cooldownKey(phone)]);
        throw err;
    }
}

// Returns OTP_STATUS.OK, WRONG or EXPIRED. After too many wrong attempts the
// code is removed and the user has to request a new one.
async function CheckIfCorrect(code, phone) {
    const raw = await client.get(otpKey(phone));
    if (!raw) return OTP_STATUS.EXPIRED;

    const saved = JSON.parse(raw);
    if (String(code) === saved.code) {
        await client.del(otpKey(phone));
        return OTP_STATUS.OK;
    }

    saved.attempts += 1;
    if (saved.attempts >= config.otp.maxAttempts) {
        await client.del(otpKey(phone));
    } else {
        await client.set(otpKey(phone), JSON.stringify(saved), { KEEPTTL: true });
    }
    return OTP_STATUS.WRONG;
}

module.exports = {
    OTP_STATUS,
    getRandomInt,
    sendSMS,
    sendVerificationCode,
    CheckIfCorrect,
};
