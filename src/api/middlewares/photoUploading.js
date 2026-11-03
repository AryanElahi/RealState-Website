const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const createError = require("http-errors");
const config = require("../../config");

fs.mkdirSync(config.photosDir, { recursive: true });

// Only images are accepted, and the stored extension comes from this list,
// never from the client's file name. This stops uploads of .html/.js/.svg
// files that would otherwise be served from our domain (stored XSS).
const ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

const storage = multer.diskStorage({
    destination: config.photosDir,
    filename: (req, file, cb) => {
        const name = `${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
        cb(null, `${name}${ALLOWED_TYPES[file.mimetype]}`);
    },
});

const multerUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
        return cb(createError(400, "Only JPEG, PNG, WEBP and GIF images are allowed"));
    },
}).array("images", 10);

const removeUploadedFiles = async (files = []) => {
    await Promise.all(
        files.map((file) => fs.promises.unlink(file.path).catch(() => {}))
    );
};

const fileUrl = (file) => `${config.publicUrl}/photos/${file.filename}`;

// Express middleware: stores up to 10 images from the "images" field.
const upload = (req, res, next) => {
    multerUpload(req, res, async (err) => {
        if (err) {
            await removeUploadedFiles(req.files);
            if (err instanceof multer.MulterError) {
                return next(createError(400, err.message));
            }
            return next(err);
        }
        if (!req.files || req.files.length === 0) {
            return next(createError(400, "file doesnt exist"));
        }
        return next();
    });
};

module.exports = upload;
module.exports.upload = upload;
module.exports.removeUploadedFiles = removeUploadedFiles;
module.exports.fileUrl = fileUrl;
