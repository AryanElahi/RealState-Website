const joi = require("joi");
const { phoneField, uidField } = require("./common");

const request = joi.object({
    full_name: joi.string().max(100),
    phone: phoneField.required(),
    region: joi.string(),
    type: joi.string().min(3).required(),
    lowest_price: joi.number(),
    hieghest_price: joi.number(),
    // The frontend sends this spelling.
    highest_price: joi.number(),
    location: joi.string(),
    message: joi.string().allow("").max(2000).optional(),
}).rename("highest_price", "hieghest_price", { ignoreUndefined: true, override: true });

const uidOnly = joi.object({
    Uid: uidField.required(),
});

module.exports = {
    request,
    uidOnly,
};
