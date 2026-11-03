const express = require("express");
const createError = require("http-errors");
const asyncHandler = require("../../../../utils/asyncHandler");
const validate = require("../../../../utils/validate");
const { generateUid } = require("../../../../utils/uid");
const { request, uidOnly } = require("../../../../validation/request.validation");
const { verifyAccessToken, verifyadmin } = require("../../../middlewares/isAuth.middleware");
const { authLimiter } = require("../../../middlewares/rateLimit");
const {
    creatRequest,
    getByUid,
    getAll,
    getchecked,
    getunchecked,
    check,
} = require("../../../../services/request/services");

const router = express.Router();
const adminOnly = [verifyAccessToken, verifyadmin];

router.post("/creatrequest", authLimiter, asyncHandler(async (req, res) => {
    const result = await validate(request, req.body);
    result.Uid = generateUid();
    await creatRequest(result);
    res.send("request has been recived");
}));

router.get("/getAll", adminOnly, asyncHandler(async (req, res) => {
    res.send(await getAll());
}));

router.get("/getchecked", adminOnly, asyncHandler(async (req, res) => {
    res.send(await getchecked());
}));

router.get("/getunchecked", adminOnly, asyncHandler(async (req, res) => {
    res.send(await getunchecked());
}));

router.post("/getbyUid", adminOnly, asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    const found = await getByUid(Uid);
    if (!found) throw createError.NotFound("request not found");
    res.send(found);
}));

router.put("/check", adminOnly, asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    res.send(await check(Uid));
}));

module.exports = router;
