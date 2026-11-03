const express = require("express");
const createError = require("http-errors");
const asyncHandler = require("../../../../utils/asyncHandler");
const validate = require("../../../../utils/validate");
const {
    signupVal,
    loginVal,
    phone: phoneVal,
    codephone,
    updateVal,
    resetpassval,
    refreshVal,
} = require("../../../../validation/user.auth.validation");
const {
    doesExistphone,
    hashPassword,
    signRefreshToken,
    creatUser,
    getUserByPhone,
    isValid,
    signAccessToken,
    updateUser,
    userPhoneVarify,
    getUserAnnounce,
    resetpass,
    verifyRefreshToken,
    revokeRefreshToken,
} = require("../../../../services/user/auth");
const { verifyAccessToken } = require("../../../middlewares/isAuth.middleware");
const { smsLimiter, authLimiter } = require("../../../middlewares/rateLimit");
const { sendVerificationCode, CheckIfCorrect, OTP_STATUS } = require("../../../../services/user/sms");

const router = express.Router();

// Sends the right response for a failed OTP check. Returns true if it did.
const rejectWrongCode = (status, res) => {
    if (status === OTP_STATUS.WRONG) {
        res.status(400).send("code is not true");
        return true;
    }
    if (status === OTP_STATUS.EXPIRED) {
        res.status(403).send("code expired");
        return true;
    }
    return false;
};

router.post("/register", smsLimiter, asyncHandler(async (req, res) => {
    const result = await validate(signupVal, req.body);
    if (await doesExistphone(result.phone)) {
        return res.status(409).send("phone already exists");
    }
    result.password = await hashPassword(result.password);
    await creatUser(result);
    await sendVerificationCode(result.phone);
    res.send("regester successful");
}));

router.post("/sendforgetpass", smsLimiter, asyncHandler(async (req, res) => {
    const { phone } = await validate(phoneVal, req.body);
    const user = await getUserByPhone(phone);
    if (!user) throw createError.NotFound("user not found");
    await sendVerificationCode(phone);
    res.send("code has been sended successful");
}));

router.post("/setnewpass", authLimiter, asyncHandler(async (req, res) => {
    const { phone, code, password } = await validate(resetpassval, req.body);
    const status = await CheckIfCorrect(code, phone);
    if (rejectWrongCode(status, res)) return;
    // updateUser hashes the password and logs out other sessions.
    await resetpass(phone, password);
    res.send("password has been changed successfully ");
}));

router.post("/verify", authLimiter, asyncHandler(async (req, res) => {
    const { phone, code } = await validate(codephone, req.body);
    const status = await CheckIfCorrect(code, phone);
    if (rejectWrongCode(status, res)) return;
    await userPhoneVarify(phone);
    res.status(200).send("phone has been varifyed");
}));

router.post("/newcode", smsLimiter, asyncHandler(async (req, res) => {
    const { phone } = await validate(phoneVal, req.body);
    const user = await getUserByPhone(phone);
    if (!user) throw createError.NotFound("user not found");
    await sendVerificationCode(phone);
    res.send("ok");
}));

router.post("/login", authLimiter, asyncHandler(async (req, res) => {
    const { phone, password } = await validate(loginVal, req.body);
    const user = await getUserByPhone(phone);
    // Same answer for an unknown phone and a wrong password, so the endpoint
    // cannot be used to find out which numbers are registered.
    if (!user || !(await isValid(password, user.password))) {
        return res.status(403).send("user or password is incorecet");
    }
    if (user.Blocked) {
        return res.status(403).send("this account has been blocked");
    }
    if (!user.phoneVarify) {
        return res.status(401).send("phone not varify");
    }
    const refreshToken = await signRefreshToken(user.phone);
    const AccessToken = signAccessToken(user.phone);
    res.send({
        refreshToken,
        AccessToken,
        name: user.full_name,
        phone: user.phone,
        role: user.admin,
    });
}));

// Exchanges a refresh token for a new access token and a new refresh token.
// The old refresh token stops working (rotation).
router.post("/refresh", authLimiter, asyncHandler(async (req, res) => {
    const { refreshToken } = await validate(refreshVal, req.body);
    const phone = await verifyRefreshToken(refreshToken);
    const user = await getUserByPhone(phone);
    if (!user || user.Blocked) {
        await revokeRefreshToken(phone);
        throw createError.Unauthorized();
    }
    const newRefreshToken = await signRefreshToken(phone);
    const accessToken = signAccessToken(phone);
    res.send({
        accessToken,
        AccessToken: accessToken,
        refreshToken: newRefreshToken,
    });
}));

router.put("/updateuser", verifyAccessToken, asyncHandler(async (req, res) => {
    const result = await validate(updateVal, req.body);
    await updateUser(req.user.phone, result);
    res.send("user has been updated");
}));

router.delete("/logout", asyncHandler(async (req, res) => {
    const refreshToken = req.body && req.body.refreshToken;
    if (!refreshToken) {
        throw createError.BadRequest("Refresh token is required!");
    }
    const phone = await verifyRefreshToken(refreshToken);
    await revokeRefreshToken(phone);
    res.sendStatus(204);
}));

router.get("/getAnnouncements", verifyAccessToken, asyncHandler(async (req, res) => {
    res.send(await getUserAnnounce(req.user.phone));
}));

module.exports = router;
