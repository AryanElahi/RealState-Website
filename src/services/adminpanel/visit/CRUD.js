const prisma = require("../../../loader/prisma");

async function creatvisit(data) {
    return prisma.visit.create({ data });
}

async function getAllVisits() {
    return prisma.visit.findMany({ orderBy: { id: "desc" } });
}

async function updateVisits(Uid, data) {
    return prisma.visit.update({
        where: { Uid },
        data,
    });
}

async function deleteVisits(Uid) {
    return prisma.visit.delete({ where: { Uid } });
}

module.exports = {
    creatvisit,
    getAllVisits,
    updateVisits,
    deleteVisits,
};
