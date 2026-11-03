const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const config = require("../config");
const routes = require("../api/routes");
const { save_visitor } = require("../services/adminpanel/visitCountingServices");
const { errorHandler, notFoundHandler } = require("../api/middlewares/errorHandler");
const { apiLimiter } = require("../api/middlewares/rateLimit");
const asyncHandler = require("../utils/asyncHandler");

const expressLoader = (app) => {
    if (config.trustProxy) {
        // Needed behind nginx so req.ip (rate limit, visitor counting) is the real client IP.
        app.set("trust proxy", 1);
    }
    app.disable("x-powered-by");
    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use(cors({
        origin: config.corsOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(morgan(config.isProduction ? "combined" : "dev"));
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));
    app.use("/photos", express.static(config.photosDir, { dotfiles: "deny", index: false }));

    app.get("/", asyncHandler(async (req, res) => {
        await save_visitor(req);
        res.send("Home Rout");
    }));

    app.use("/api", apiLimiter, routes());
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

module.exports = expressLoader;
