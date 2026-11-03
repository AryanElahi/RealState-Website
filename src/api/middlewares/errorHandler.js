const createError = require("http-errors");

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    let status = err.status || err.statusCode || 500;
    let message = err.expose ? err.message : "Internal Server Error";

    if (err.isJoi) {
        status = 422;
        message = err.details?.[0]?.message || err.message;
    } else if (err.code === "P2025") {
        status = 404;
        message = "Record not found";
    } else if (err.code === "P2002") {
        status = 409;
        message = "Record already exists";
    }

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        success: 0,
        status,
        message,
    });
}

function notFoundHandler(req, res, next) {
    next(createError(404, "Resource not found"));
}

module.exports = {
    errorHandler,
    notFoundHandler,
};
