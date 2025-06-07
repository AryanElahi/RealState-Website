const express = require("express")
const router = express.Router()
const createError = require("http-errors")
const {creat, update} = require("../../../../validation/announce.crud.validation")
const upload = require('./../../../middlewares/photoUploading'); 

const { 
    creatAnnouncement,
    getByStateCode,
    getAllAnnouns,
    getByUid,
    updateAnnoun,
    confirmed,
    deleteAnnoun,
    photo_adding,
    search,
    searchregion
} = require("../../../../services/anouncement/CRUD")
const {getUserByAccessToken} = require ("./../../../../services/user/auth")
const {verifyAccessToken} = require("../../../middlewares/isAuth.middleware")
const {
    getAllregions,
} = require("../../../../services/adminpanel/region/CRUD")
    router.post ("/creatAnnounce", verifyAccessToken , async (req, res, next) => {
    try {
        let result = await creat.validateAsync(req.body)
        const authheader = req.headers["authorization"]
        const bearertoken = authheader.split(' ')
        const token = bearertoken[1]
        const userId = await getUserByAccessToken(token)
        result.Uid = String(new Date().getTime()) 
        const  newA = await creatAnnouncement(result, userId)
        const message = "announcement has been created:"
        console.log(newA)
        res.send({message, newA})
    } catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
})
router.post("/uploadPhotos",verifyAccessToken , async (req, res, next) => {
    try {
        upload(req, res, async (err) => { 
            if (err) {
                return res.status(400).json({
                    success: 0,
                    message: err.message
                });
            }
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: 0,
                    message: 'file doesnt exist'
                });
            }
            const imageUrls = req.files.map(file => `http://185.231.115.236:3000/photos/${file.filename}`);
            try {
                const adding = await photo_adding(req.body.Uid, imageUrls)
                res.status(200).json({
                    success: 1,
                    message: "success",
                    files: imageUrls
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: 0,
                    message: "error while uploading"
                });
            }
        });        
    } catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
});
router.get("/getallannounce" , async (req, res, next) => {
    try {
        res.send(await getAllAnnouns())        
    } catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
})
router.post("/search" , async (req, res, next) => {
    try {
        const result = await search(req.body)
        res.send(result)        
    } catch (error) {
        next(createError(500, "An unexpected error occurred"));
    }
})
router.post("/getbyUid" , async (req, res, next) => {
    try {
        const Uid = req.body.Uid
        res.send(await getByUid(Uid))        
    } catch (error) {
        next(createError(500, "An unexpected error occurred"));
    }
})
router.delete("/hdelete",verifyAccessToken , async (req, res, next) => {
    try {
        const Uid = req.body.Uid
        const delet = await deleteAnnoun(Uid)
        res.send ("the annonce has been deleted")        
    } catch (error) {
        next(createError(500, "An unexpected error occurred"));
    }
})
router.get("/getAllregions", async(req, res, next) => {
    try {
        const regions = await getAllregions()
        console.log(regions)
        res.send(regions)        
    } catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
})
router.get("/confirmed_announce", async (req, res, next) => {
    try {
        const confirm = await confirmed()
        res.send(confirm)
    } 
    catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
});
router.post("/search_region", async (req, res, next) => {
    try {
        const result = await searchregion(req.body.name)
        res.send(result)
    } 
    catch (error) {
        console.log(error)
        next(createError(500, "An unexpected error occurred"));
    }
});
module.exports = router


