const express = require("express");
const config = require("./config");
const loader = require("./loader");
const prisma = require("./loader/prisma");
const { disconnectRedis } = require("./loader/redis");

const app = express();

async function startServer() {
    await loader(app);
    const server = app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });

    const shutdown = async (signal) => {
        console.log(`${signal} received, shutting down`);
        server.close(async () => {
            await Promise.allSettled([prisma.$disconnect(), disconnectRedis()]);
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});

startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});

module.exports = app;
