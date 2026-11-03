const { PrismaClient } = require("@prisma/client");

// One shared client (and connection pool) for the whole application.
const prisma = new PrismaClient();

module.exports = prisma;
