const requestIp = require("request-ip");
const prisma = require("../../loader/prisma");

// Kept in the same "YYYY-M-D" format as existing rows.
function get_exact_date() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function get_ip(req) {
    return requestIp.getClientIp(req) || req.ip || "";
}

async function save_visitor(req) {
    return prisma.visitor.create({
        data: { date: get_exact_date(), ip: get_ip(req) },
    });
}

async function get_daily_visitors() {
    return prisma.visitor.count({
        where: { date: get_exact_date() },
    });
}

async function get_all_visitors() {
    const visitor = await prisma.visitor.findMany();
    return { visitor, number: visitor.length };
}

async function count_all_visitors() {
    return prisma.visitor.count();
}

module.exports = {
    get_ip,
    get_exact_date,
    save_visitor,
    get_daily_visitors,
    get_all_visitors,
    count_all_visitors,
};
