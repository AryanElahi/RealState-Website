const prisma = require("../../../loader/prisma");

async function creatregion(data) {
    return prisma.region.create({ data });
}

async function getAllregions() {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
}

async function deleteregion(id) {
    return prisma.region.delete({ where: { id } });
}

module.exports = {
    creatregion,
    getAllregions,
    deleteregion,
};
