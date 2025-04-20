const redis = require('redis');
const client = redis.createClient();
client.connect()
.then(() => {
    console.log("Redis client ready...");
})
.catch((err) => {
    console.error("Redis client failed to connect "+err);
});

process.on("SIGINT",async() => {
    await client.quit();
    console.log("Redis client disconnected...");
    process.exit(0);
});

module.exports = client;