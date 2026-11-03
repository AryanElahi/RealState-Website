const joi = require("joi");

const phonePattern = /^(?:([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$/;

const phoneField = joi.string().trim().pattern(phonePattern).message("phone number is not valid");
// Used for new passwords only. Login does not apply it, so users with older
// short passwords can still sign in and then change them.
const newPasswordField = joi.string().min(8).max(128);
const otpCodeField = joi.number().integer().min(10000).max(99999);
const uidField = joi.alternatives().try(joi.string().trim(), joi.number()).custom((value) => String(value));

module.exports = {
    phonePattern,
    phoneField,
    newPasswordField,
    otpCodeField,
    uidField,
};
