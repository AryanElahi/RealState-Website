const prisma = require("../../loader/prisma");

async function creatteam(data) {
    return prisma.team.create({ data });
}

async function getAllteam() {
    return prisma.team.findMany({ orderBy: { id: "asc" } });
}

async function updateteam(id, data) {
    return prisma.team.update({
        where: { id },
        data,
    });
}

async function deleteteam(id) {
    return prisma.team.delete({ where: { id } });
}

module.exports = {
    creatteam,
    getAllteam,
    updateteam,
    deleteteam,
};
