const prisma = require("../../loader/prisma");
const { buildWhere } = require("../../validation/search.validation");

async function creatAnnouncement(data, userId) {
    return prisma.property.create({
        data: { ...data, userID: userId },
    });
}

// Replaces the photos of an announcement.
async function photo_adding(Uid, urls) {
    return prisma.property.update({
        where: { Uid },
        data: { photo: urls },
    });
}

async function getByStateCode(code) {
    return prisma.property.findFirst({
        where: { state_code: code },
    });
}

async function getByUid(code) {
    return prisma.property.findUnique({
        where: { Uid: code },
    });
}

// Public listing: only announcements approved by an admin.
async function getAllAnnouns() {
    return prisma.property.findMany({
        where: { check: true, reject: false },
        orderBy: { id: "desc" },
    });
}

async function updateAnnoun({ Uid, ...data }) {
    return prisma.property.update({
        where: { Uid },
        data,
    });
}

async function deleteAnnoun(Uid) {
    return prisma.property.delete({
        where: { Uid },
    });
}

// `filters` must come from search.validation (whitelisted fields only).
async function search(filters) {
    return prisma.property.findMany({
        where: { ...buildWhere(filters), check: true, reject: false },
        orderBy: { id: "desc" },
    });
}

async function confirmed() {
    const announs = await prisma.property.findMany({
        where: { check: true, reject: false },
        orderBy: { id: "desc" },
    });
    return { confirmed: announs, number: announs.length };
}

async function searchregion(name) {
    return prisma.region.findMany({
        where: {
            name: {
                contains: name,
                mode: "insensitive",
            },
        },
    });
}

module.exports = {
    creatAnnouncement,
    getAllAnnouns,
    updateAnnoun,
    deleteAnnoun,
    getByStateCode,
    getByUid,
    photo_adding,
    search,
    confirmed,
    searchregion,
};
