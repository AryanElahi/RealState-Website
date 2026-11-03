// Forwards errors from async route handlers to the Express error handler.
// Express 4 does not catch rejected promises on its own.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
