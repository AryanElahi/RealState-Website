const prisma = require("../../../loader/prisma");
const { buildWhere } = require("../../../validation/search.validation");

async function creatannounce(data, userId) {
    return prisma.property.create({
        data: { ...data, userID: userId },
    });
}

async function getAllAnnouns() {
    const announs = await prisma.property.findMany({
        orderBy: { id: "desc" },
    });
    return { announce: announs, number: announs.length };
}

async function inPrigressStates() {
    const announs = await prisma.property.findMany({
        where: { check: false, reject: false },
        orderBy: { id: "desc" },
    });
    return { inprogress: announs, number: announs.length };
}

async function deleted_or_not_confirmed() {
    const announs = await prisma.property.findMany({
        where: { reject: true },
        orderBy: { id: "desc" },
    });
    return { deleted: announs, number: announs.length };
}

async function updateAnnoun({ Uid, ...data }) {
    return prisma.property.update({
        where: { Uid },
        data,
    });
}

async function delete_photos(Uid) {
    return prisma.property.update({
        where: { Uid },
        data: { photo: [] },
    });
}

// `filters` must come from search.validation (whitelisted fields only).
async function search(filters) {
    return prisma.property.findMany({
        where: buildWhere(filters),
        orderBy: { id: "desc" },
    });
}

async function getByUid(Uid) {
    return prisma.property.findUnique({
        where: { Uid },
    });
}

// Appends photos to an announcement.
async function photo_adding(Uid, newUrls) {
    const existing = await prisma.property.findUniqueOrThrow({
        where: { Uid },
        select: { photo: true },
    });
    const currentPhotos = Array.isArray(existing.photo) ? existing.photo : [];
    return prisma.property.update({
        where: { Uid },
        data: { photo: [...currentPhotos, ...newUrls] },
    });
}

async function checkAnnounce(Uid, stateCode) {
    return prisma.property.update({
        where: { Uid },
        data: {
            check: true,
            reject: false,
            state_code: stateCode,
        },
    });
}

// Marks the announcement as rejected instead of deleting it, so it shows up
// in the "deleted or not confirmed" list of the admin panel.
async function rejectAnnoun(Uid) {
    return prisma.property.update({
        where: { Uid },
        data: { reject: true, check: false },
    });
}

module.exports = {
    creatannounce,
    getAllAnnouns,
    inPrigressStates,
    deleted_or_not_confirmed,
    search,
    checkAnnounce,
    rejectAnnoun,
    updateAnnoun,
    photo_adding,
    getByUid,
    delete_photos,
};
