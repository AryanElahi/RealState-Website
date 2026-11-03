const joi = require("joi");
const { phoneField, uidField } = require("./common");

const creat = joi.object({
    loan: joi.number(),
    type: joi.string(),
    region: joi.string(),
    address: joi.string(),
    location: joi.string(),
    usage: joi.string(),
    document_type: joi.string(),
    land_metrage: joi.number().integer(),
    useful_metrage: joi.number().integer(),
    floor_number: joi.number().integer(),
    floor: joi.string(),
    Unit_in_floor: joi.number().integer(),
    year_of_build: joi.number().integer(),
    full_name: joi.string(),
    price: joi.number(),
    room_number: joi.number().integer(),
    features: joi.string(),
    description: joi.string().allow(""),
    phone: phoneField,
});

const update = creat.keys({
    Uid: uidField.required(),
});

const uidOnly = joi.object({
    Uid: uidField.required(),
});

const regionName = joi.object({
    name: joi.string().allow("").max(100).required(),
});

module.exports = {
    creat,
    update,
    uidOnly,
    regionName,
};
