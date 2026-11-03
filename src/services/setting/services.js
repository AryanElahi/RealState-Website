const prisma = require("../../loader/prisma");

// The site settings live in a single row with id 1. upsert creates it the
// first time instead of failing because the row does not exist yet.
const SETTING_ID = 1;

async function initiateSetting(data) {
    return prisma.setting.upsert({
        where: { id: SETTING_ID },
        update: data,
        create: { id: SETTING_ID, ...data },
    });
}

async function logoAdding(urls) {
    return initiateSetting({ logo: urls });
}

async function aboutUpdating({ about, goals }) {
    return initiateSetting({ about, goals });
}

async function get_about() {
    return prisma.setting.findUnique({ where: { id: SETTING_ID } });
}

module.exports = {
    initiateSetting,
    logoAdding,
    aboutUpdating,
    get_about,
};
