const express = require("express");
const createError = require("http-errors");
const asyncHandler = require("../../../../utils/asyncHandler");
const validate = require("../../../../utils/validate");
const { generateUid } = require("../../../../utils/uid");
const { creat, uidOnly, regionName } = require("../../../../validation/announce.crud.validation");
const { publicSearch } = require("../../../../validation/search.validation");
const { upload, removeUploadedFiles, fileUrl } = require("../../../middlewares/photoUploading");
const { verifyAccessToken, optionalAuth } = require("../../../middlewares/isAuth.middleware");
const {
    creatAnnouncement,
    getAllAnnouns,
    getByUid,
    confirmed,
    deleteAnnoun,
    photo_adding,
    search,
    searchregion,
} = require("../../../../services/anouncement/CRUD");
const { getAllregions } = require("../../../../services/adminpanel/region/CRUD");

const router = express.Router();

const canManage = (user, announcement) =>
    Boolean(user) && (user.admin === true || announcement.userID === user.phone);

router.post("/creatAnnounce", verifyAccessToken, asyncHandler(async (req, res) => {
    const result = await validate(creat, req.body);
    result.Uid = generateUid();
    const newA = await creatAnnouncement(result, req.user.phone);
    res.send({ message: "announcement has been created:", newA });
}));

// Only the owner of the announcement (or an admin) can change its photos.
router.post("/uploadPhotos", verifyAccessToken, upload, asyncHandler(async (req, res) => {
    try {
        const { Uid } = await validate(uidOnly, req.body);
        const announcement = await getByUid(Uid);
        if (!announcement) throw createError.NotFound("announcement not found");
        if (!canManage(req.user, announcement)) {
            throw createError.Forbidden("You can only change your own announcements");
        }
        const imageUrls = req.files.map(fileUrl);
        await photo_adding(Uid, imageUrls);
        res.status(200).json({
            success: 1,
            message: "success",
            files: imageUrls,
        });
    } catch (err) {
        await removeUploadedFiles(req.files);
        throw err;
    }
}));

router.get("/getallannounce", asyncHandler(async (req, res) => {
    res.send(await getAllAnnouns());
}));

router.post("/search", asyncHandler(async (req, res) => {
    const filters = await validate(publicSearch, req.body);
    res.send(await search(filters));
}));

// Approved announcements are public. Pending or rejected ones are only
// visible to their owner and to admins.
router.post("/getbyUid", optionalAuth, asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    const announcement = await getByUid(Uid);
    const isPublic = announcement && announcement.check && !announcement.reject;
    if (!announcement || (!isPublic && !canManage(req.user, announcement))) {
        throw createError.NotFound("announcement not found");
    }
    res.send(announcement);
}));

router.delete("/hdelete", verifyAccessToken, asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    const announcement = await getByUid(Uid);
    if (!announcement) throw createError.NotFound("announcement not found");
    if (!canManage(req.user, announcement)) {
        throw createError.Forbidden("You can only delete your own announcements");
    }
    await deleteAnnoun(Uid);
    res.send("the annonce has been deleted");
}));

router.get("/getAllregions", asyncHandler(async (req, res) => {
    res.send(await getAllregions());
}));

router.get("/confirmed_announce", asyncHandler(async (req, res) => {
    res.send(await confirmed());
}));

router.post("/search_region", asyncHandler(async (req, res) => {
    const { name } = await validate(regionName, req.body);
    res.send(await searchregion(name));
}));

module.exports = router;
