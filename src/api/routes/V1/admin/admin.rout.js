const express = require("express");
const createError = require("http-errors");
const prisma = require("../../../../loader/prisma");
const asyncHandler = require("../../../../utils/asyncHandler");
const validate = require("../../../../utils/validate");
const { generateUid } = require("../../../../utils/uid");
const { upload, removeUploadedFiles, fileUrl } = require("../../../middlewares/photoUploading");
const { verifyAccessToken, verifyadmin } = require("../../../middlewares/isAuth.middleware");
const { getAllUsers, updateUser } = require("../../../../services/user/auth");
const { getAll } = require("../../../../services/request/services");
const {
    creatannounce,
    inPrigressStates,
    deleted_or_not_confirmed,
    search,
    delete_photos,
    photo_adding,
    checkAnnounce,
    rejectAnnoun,
    updateAnnoun,
    getByUid,
} = require("../../../../services/adminpanel/adminannounce/announservices");
const { get_daily_visitors, count_all_visitors } = require("../../../../services/adminpanel/visitCountingServices");
const { creatvisit, getAllVisits, updateVisits, deleteVisits } = require("../../../../services/adminpanel/visit/CRUD");
const { creatdeal, getAlldeals, updatedeal, deletedeal } = require("../../../../services/adminpanel/deal/CRUD");
const { promotToAdmin } = require("../../../../services/adminpanel/userManagement/services");
const {
    getAllsliders,
    deleteslider,
    updateslider,
    creatslider,
    photo_adding_slider,
} = require("../../../../services/sliders/CRUD");
const { logoAdding, aboutUpdating, get_about } = require("../../../../services/setting/services");
const { creatteam, getAllteam, updateteam, deleteteam } = require("../../../../services/setting/teamCRUD");
const { getByStateCode } = require("../../../../services/anouncement/CRUD");
const { creatregion, deleteregion } = require("../../../../services/adminpanel/region/CRUD");
const { adminSearch } = require("../../../../validation/search.validation");
const { uidOnly } = require("../../../../validation/announce.crud.validation");
const schemas = require("../../../../validation/adminval");

const router = express.Router();

// Every route in this file is for admins only.
router.use(verifyAccessToken, verifyadmin);

// Runs `save` with the URLs of the uploaded images and removes the files again
// if saving fails, so failed requests do not leave orphan files on disk.
const handleImageUpload = (save) => asyncHandler(async (req, res) => {
    const imageUrls = req.files.map(fileUrl);
    try {
        await save(req, imageUrls);
    } catch (err) {
        await removeUploadedFiles(req.files);
        throw err;
    }
    res.status(200).json({
        success: 1,
        message: "success",
        files: imageUrls,
    });
});

// Dashboard
router.get("/dashboard", asyncHandler(async (req, res) => {
    const [announcements, users, inprogress, notConfirmed, uncheckedRequests, allVisitors, dailyVisitors] =
        await Promise.all([
            prisma.property.count(),
            prisma.user.count(),
            prisma.property.count({ where: { check: false, reject: false } }),
            prisma.property.count({ where: { reject: true } }),
            prisma.request.count({ where: { status: false } }),
            count_all_visitors(),
            get_daily_visitors(),
        ]);
    res.send({
        "all announcements": announcements.toString(),
        "all users": users.toString(),
        "in progress ": inprogress.toString(),
        "deleted or not confirmed": notConfirmed.toString(),
        "unchecked requests": uncheckedRequests.toString(),
        "all visitors": allVisitors.toString(),
        "daily visitors": dailyVisitors.toString(),
    });
}));

router.get("/notconfirmedrequests", asyncHandler(async (req, res) => {
    res.send(await deleted_or_not_confirmed());
}));

router.get("/getAllRequests", asyncHandler(async (req, res) => {
    res.send(await getAll());
}));

// Announcement management
router.post("/creatAnnouncement", asyncHandler(async (req, res) => {
    const result = await validate(schemas.creatval, req.body);
    result.check = true;
    result.Uid = generateUid();
    res.send(await creatannounce(result, req.user.phone));
}));

router.post("/uploadPhotos", upload, handleImageUpload(async (req, imageUrls) => {
    const { Uid } = await validate(uidOnly, req.body);
    await photo_adding(Uid, imageUrls);
}));

router.get("/inprogress", asyncHandler(async (req, res) => {
    res.send(await inPrigressStates());
}));

router.get("/notconfirmedannouncements", asyncHandler(async (req, res) => {
    res.send(await deleted_or_not_confirmed());
}));

router.post("/search", asyncHandler(async (req, res) => {
    const filters = await validate(adminSearch, req.body);
    res.send(await search(filters));
}));

router.post("/varifyannounce", asyncHandler(async (req, res) => {
    const { Uid, state } = await validate(schemas.verifyAnnounce, req.body);
    await checkAnnounce(Uid, state);
    res.send("the announcement has been aproved");
}));

router.post("/rejectannounce", asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    await rejectAnnoun(Uid);
    res.send("the announcement has been rejected");
}));

router.post("/getbyUid", asyncHandler(async (req, res) => {
    const { Uid } = await validate(uidOnly, req.body);
    const announcement = await getByUid(Uid);
    if (!announcement) throw createError.NotFound("announcement not found");
    res.send(announcement);
}));

router.post("/getbystatecode", asyncHandler(async (req, res) => {
    const { state_code } = await validate(schemas.stateCode, req.body);
    const announcement = await getByStateCode(state_code);
    if (!announcement) throw createError.NotFound("announcement not found");
    res.send(announcement);
}));

router.put("/updateannoun", asyncHandler(async (req, res) => {
    const result = await validate(schemas.update, req.body);
    await updateAnnoun(result);
    res.send("The announcement has been updated successfully");
}));

router.put("/delete_photos", asyncHandler(async (req, res) => {
    // The frontend sends "uid" here and "Uid" everywhere else.
    const { Uid } = await validate(uidOnly, { Uid: req.body.Uid ?? req.body.uid });
    await delete_photos(Uid);
    res.send("photo has been deleted from announce");
}));

// Visits
router.post("/creatVisit", asyncHandler(async (req, res) => {
    const data = await validate(schemas.creatVisit, req.body);
    data.Uid = generateUid();
    await creatvisit(data);
    res.send("the visit has been added successfully");
}));

router.get("/getAllVisits", asyncHandler(async (req, res) => {
    res.send(await getAllVisits());
}));

router.put("/updateVisits", asyncHandler(async (req, res) => {
    const { ID, ...data } = await validate(schemas.updateVisit, req.body);
    res.send(await updateVisits(ID, data));
}));

router.delete("/deleteVisit", asyncHandler(async (req, res) => {
    const { ID } = await validate(schemas.recordUid, req.body);
    await deleteVisits(ID);
    res.send("the record has been deleted successfully");
}));

// Deals
router.post("/creatdeal", asyncHandler(async (req, res) => {
    const data = await validate(schemas.creatDeal, req.body);
    data.Uid = generateUid();
    await creatdeal(data);
    res.send("deal has been created successfully");
}));

router.get("/getAlldeals", asyncHandler(async (req, res) => {
    res.send(await getAlldeals());
}));

router.post("/updatedeal", asyncHandler(async (req, res) => {
    const { ID, ...data } = await validate(schemas.updateDeal, req.body);
    res.send(await updatedeal(ID, data));
}));

router.delete("/deletedeal", asyncHandler(async (req, res) => {
    const { ID } = await validate(schemas.recordUid, req.body);
    await deletedeal(ID);
    res.send(await getAlldeals());
}));

// User management
router.get("/alluseres", asyncHandler(async (req, res) => {
    res.send(await getAllUsers());
}));

router.put("/updateuser", asyncHandler(async (req, res) => {
    const { phone, ...data } = await validate(schemas.adminUpdateUser, req.body);
    // updateUser hashes a new password and never returns the hash.
    res.send(await updateUser(phone, data));
}));

router.put("/promotToAdmin", asyncHandler(async (req, res) => {
    const { phone } = await validate(schemas.phoneOnly, req.body);
    res.send(await promotToAdmin(phone));
}));

// Sliders
router.post("/creatslider", asyncHandler(async (req, res) => {
    const data = await validate(schemas.creatSlider, req.body);
    res.send(await creatslider(data));
}));

router.post("/uploadsliderPhotos", upload, handleImageUpload(async (req, imageUrls) => {
    const { id } = await validate(schemas.numericId, { id: req.body.id });
    await photo_adding_slider(id, imageUrls);
}));

router.get("/getAllSliders", asyncHandler(async (req, res) => {
    res.send(await getAllsliders());
}));

router.post("/updateslider", asyncHandler(async (req, res) => {
    const { id, ...data } = await validate(schemas.updateSlider, req.body);
    res.send(await updateslider(id, data));
}));

router.delete("/deleteslider", asyncHandler(async (req, res) => {
    const { id } = await validate(schemas.numericId, req.body);
    await deleteslider(id);
    res.send("the slider has been deleted successfully");
}));

// Site settings
router.get("/getabout", asyncHandler(async (req, res) => {
    res.send(await get_about());
}));

router.put("/uploadLogo", upload, handleImageUpload(async (req, imageUrls) => {
    await logoAdding(imageUrls);
}));

router.put("/aboutUpdating", asyncHandler(async (req, res) => {
    const data = await validate(schemas.about, req.body);
    res.send(await aboutUpdating(data));
}));

// Team
router.post("/creatteam", asyncHandler(async (req, res) => {
    const data = await validate(schemas.creatTeam, req.body);
    await creatteam(data);
    res.send(" team member has been added");
}));

router.get("/getAllteam", asyncHandler(async (req, res) => {
    res.send(await getAllteam());
}));

router.post("/updateteam", asyncHandler(async (req, res) => {
    const { id, ...data } = await validate(schemas.updateTeam, req.body);
    res.send(await updateteam(id, data));
}));

router.delete("/deleteteam", asyncHandler(async (req, res) => {
    const { id } = await validate(schemas.numericId, req.body);
    await deleteteam(id);
    res.send("team member has been deleted");
}));

// Regions
router.post("/creatregion", asyncHandler(async (req, res) => {
    const data = await validate(schemas.creatRegion, req.body);
    res.status(200).send(await creatregion(data));
}));

router.delete("/deleteregion", asyncHandler(async (req, res) => {
    const { id } = await validate(schemas.numericId, req.body);
    await deleteregion(id);
    res.send("region has been deleted");
}));

module.exports = router;
