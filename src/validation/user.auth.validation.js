const joi = require("joi");
const { phoneField, newPasswordField, otpCodeField } = require("./common");

const phone = joi.object({
    phone: phoneField.required(),
});

const codephone = joi.object({
    phone: phoneField.required(),
    code: otpCodeField.required(),
});

const resetpassval = joi.object({
    phone: phoneField.required(),
    code: otpCodeField.required(),
    password: newPasswordField.required(),
});

const signupVal = joi.object({
    full_name: joi.string().trim().min(1).max(100).required(),
    password: newPasswordField.required(),
    repeat_password: joi.any().valid(joi.ref("password")).strip()
        .messages({ "any.only": "passwords do not match" }),
    phone: phoneField.required(),
});

// Changing the phone number is not allowed: it is the user's identity in the
// tokens and the owner key of their announcements.
const updateVal = joi.object({
    full_name: joi.string().trim().min(1).max(100),
    password: newPasswordField,
});

const loginVal = joi.object({
    phone: phoneField.required(),
    password: joi.string().max(128).required(),
});

const refreshVal = joi.object({
    refreshToken: joi.string().required(),
});

module.exports = {
    signupVal,
    updateVal,
    loginVal,
    codephone,
    phone,
    resetpassval,
    refreshVal,
};
