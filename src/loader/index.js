const expressLoader = require("./express");
const { connectRedis } = require("./redis");
const prisma = require("./prisma");

const loader = async (app) => {
    await connectRedis();
    await prisma.$connect();
    expressLoader(app);
};

module.exports = loader;
