const prisma = require("../../loader/prisma");

async function creatRequest(data) {
    return prisma.request.create({ data });
}

async function getByUid(Uid) {
    return prisma.request.findUnique({ where: { Uid } });
}

async function getAll() {
    const requests = await prisma.request.findMany({ orderBy: { id: "desc" } });
    return { users: requests, number: requests.length };
}

async function getunchecked() {
    const requests = await prisma.request.findMany({
        where: { status: false },
        orderBy: { id: "desc" },
    });
    return { users: requests, number: requests.length };
}

async function getchecked() {
    return prisma.request.findMany({
        where: { status: true },
        orderBy: { id: "desc" },
    });
}

async function check(Uid) {
    return prisma.request.update({
        where: { Uid },
        data: { status: true },
    });
}

module.exports = {
    creatRequest,
    getByUid,
    getAll,
    getchecked,
    getunchecked,
    check,
};
