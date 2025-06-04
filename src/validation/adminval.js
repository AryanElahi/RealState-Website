const joi = require("joi")

const creatval = joi.object ({
    tour3dRequest: joi.bool().optional(),
    tour3dlink : joi.string().optional(),
    loan : joi.number(),
    type : joi.string(),
    region : joi.string(),
    address : joi.string(),
    location : joi.string(),
    usage    : joi.string(),
    document_type : joi.string(),
    land_metrage : joi.number(),
    useful_metrage : joi.number(),
    floor_number : joi.number(),
floor : joi.string(),

    Unit_in_floor : joi.number(),
    year_of_build : joi.number(),
    full_name : joi.string(),
    price     : joi.number(),
    room_number  : joi.number(),
    features     : joi.string(),
    phone    :joi.string()
    .pattern(RegExp("^(?:([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$")),
    state_code:  joi.string(),
    description :  joi.string(),

})
const update = joi.object ({
    Uid : joi.string() ,
    tour3dRequest: joi.bool().optional(),
    tour3dlink : joi.string().optional(),
    loan : joi.number().optional(),
    type : joi.string().optional(),
    region : joi.string().optional(),
    address : joi.string().optional(),
    location : joi.string().optional(),
    usage    : joi.string().optional(),
    document_type : joi.string().optional(),
    land_metrage : joi.number().optional(),
    useful_metrage : joi.number().optional(),
    floor_number : joi.number().optional(),
    floor : joi.string().optional(),
    Unit_in_floor : joi.number().optional(),
    year_of_build : joi.number().optional(),
    full_name : joi.string().optional(),
    price     : joi.number().optional(),
    room_number  : joi.number().optional(),
    features     : joi.string().optional(),
    phone    :joi.string().optional()
    .pattern(RegExp("^(?:([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$")),
    state_code:  joi.string().optional(),
    description :  joi.string(),
})
module.exports = { 
    creatval,
    update
}