const joi = require("joi");
const { uidField } = require("./common");

// Only these filters are passed to the database. Previously the whole request
// body went into Prisma's `where`, so anyone could filter on related tables,
// for example on the owner's password hash.
const baseFilters = {
    Uid: uidField,
    type: joi.string(),
    region: joi.string(),
    usage: joi.string(),
    document_type: joi.string(),
    floor: joi.string(),
    state_code: joi.string(),
    loan: joi.number(),
    room_number: joi.number().integer(),
    floor_number: joi.number().integer(),
    year_of_build: joi.number().integer(),
    tour3dRequest: joi.boolean(),
    full_name: joi.string().allow(""),
    address: joi.string().allow(""),
    price: joi.number(),
};

const publicSearch = joi.object(baseFilters);

const adminSearch = joi.object({
    ...baseFilters,
    check: joi.boolean(),
    reject: joi.boolean(),
    userID: joi.string(),
    phone: joi.string(),
});

const buildWhere = ({ full_name, address, price, ...rest }) => ({
    ...rest,
    ...(full_name && { full_name: { contains: full_name, mode: "insensitive" } }),
    ...(address && { address: { contains: address, mode: "insensitive" } }),
    ...(price !== undefined && { price: { lte: price } }),
});

module.exports = {
    publicSearch,
    adminSearch,
    buildWhere,
};
