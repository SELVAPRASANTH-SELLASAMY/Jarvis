const mongoose = require('mongoose');
const connections = {};

const getConnection = (dbName) => {
    if(connections[dbName]) return connections[dbName];
    try{
        const url = `${process.env.MONGO_DB_BASE_URL}${dbName}`;
        // const userName = encodeURIComponent(process.env.MONGODB_USERNAME);
        // const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
        // const url = `mongodb+srv://${userName}:${password}@cluster0.fjloxgx.mongodb.net/${dbName}?appName=Cluster0`;
        const con = mongoose.createConnection(url,{
            maxPoolSize: 10,
            minPoolSize: 1
        });
        connections[dbName] = con;
        return con;
    }
    catch(error){
       console.error("Error while connecting the database\n",error);
    }
}

process.on("SIGINT",async() => {
    await mongoose.disconnect();
    console.log("Disconnected from the MongoDB databases.");
    process.exit(0);
})

module.exports = { getConnection };