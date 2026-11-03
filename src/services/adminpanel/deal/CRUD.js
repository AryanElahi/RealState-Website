const prisma = require("../../../loader/prisma");

async function creatdeal(data) {
    return prisma.deal.create({ data });
}

async function getAlldeals() {
    return prisma.deal.findMany({ orderBy: { id: "desc" } });
}

async function updatedeal(Uid, data) {
    return prisma.deal.update({
        where: { Uid },
        data,
    });
}

async function deletedeal(Uid) {
    return prisma.deal.delete({ where: { Uid } });
}

module.exports = {
    creatdeal,
    getAlldeals,
    updatedeal,
    deletedeal,
};
