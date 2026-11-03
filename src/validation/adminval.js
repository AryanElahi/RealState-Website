const joi = require("joi");
const { phoneField, newPasswordField, uidField } = require("./common");

const announceFields = {
    tour3dRequest: joi.bool(),
    tour3dlink: joi.string().allow(""),
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
    phone: phoneField,
    state_code: joi.string(),
    description: joi.string().allow(""),
};

const creatval = joi.object(announceFields);

const update = joi.object({
    Uid: uidField.required(),
    ...announceFields,
});

const verifyAnnounce = joi.object({
    Uid: uidField.required(),
    state: joi.string().allow(""),
});

const stateCode = joi.object({
    state_code: joi.string().required(),
});

const visitFields = {
    name: joi.string().allow(""),
    phone: joi.string().allow(""),
    description: joi.string().allow(""),
    date: joi.string().allow(""),
    address: joi.string().allow(""),
};
const creatVisit = joi.object(visitFields);
const updateVisit = joi.object({ ID: uidField.required(), ...visitFields });

const dealFields = {
    seller: joi.string().allow(""),
    region: joi.string().allow(""),
    type: joi.string().allow(""),
    number: joi.string().allow(""),
    client: joi.string().allow(""),
    price: joi.number().integer(),
    commission: joi.number().integer(),
    date: joi.string().allow(""),
    note: joi.string().allow(""),
};
const creatDeal = joi.object(dealFields);
const updateDeal = joi.object({ ID: uidField.required(), ...dealFields });

const recordUid = joi.object({ ID: uidField.required() });
const numericId = joi.object({ id: joi.number().integer().required() });

const adminUpdateUser = joi.object({
    phone: phoneField.required(),
    full_name: joi.string().trim().min(1).max(100),
    password: newPasswordField,
    Blocked: joi.boolean(),
    phoneVarify: joi.boolean(),
    admin: joi.boolean(),
});

const phoneOnly = joi.object({ phone: phoneField.required() });

const sliderFields = {
    Title: joi.string().allow(""),
    note: joi.string().allow(""),
};
const creatSlider = joi.object(sliderFields);
const updateSlider = joi.object({ id: joi.number().integer().required(), ...sliderFields });

const teamFields = {
    name: joi.string().allow(""),
    job: joi.string().allow(""),
    email: joi.string().allow(""),
    phone: joi.string().allow(""),
};
const creatTeam = joi.object(teamFields);
const updateTeam = joi.object({ id: joi.number().integer().required(), ...teamFields });

const about = joi.object({
    about: joi.string().allow(""),
    goals: joi.string().allow(""),
});

const creatRegion = joi.object({
    name: joi.string().trim().min(1).max(100).required(),
});

module.exports = {
    creatval,
    update,
    verifyAnnounce,
    stateCode,
    creatVisit,
    updateVisit,
    creatDeal,
    updateDeal,
    recordUid,
    numericId,
    adminUpdateUser,
    phoneOnly,
    creatSlider,
    updateSlider,
    creatTeam,
    updateTeam,
    about,
    creatRegion,
};
