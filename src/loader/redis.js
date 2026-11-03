const { createClient } = require("redis");
const config = require("../config");

// One long-lived connection, opened at startup and closed on shutdown.
// Do not connect/disconnect per request: concurrent requests would close
// the connection under each other.
const client = createClient({ url: config.redisUrl });

client.on("error", (err) => {
    console.error("Redis Client Error", err);
});

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log("Redis connected");
    }
};

const disconnectRedis = async () => {
    if (client.isOpen) {
        await client.quit();
        console.log("Redis disconnected");
    }
};

module.exports = {
    client,
    connectRedis,
    disconnectRedis,
};
