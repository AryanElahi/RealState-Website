// Validates a request body and drops fields that are not in the schema, so a
// client cannot write columns it is not supposed to (admin, check, userID...).
const validate = (schema, data) =>
    schema.validateAsync(data || {}, { stripUnknown: true, abortEarly: true });

module.exports = validate;
