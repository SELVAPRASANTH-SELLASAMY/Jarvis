const mongoose = require('mongoose');

const getConnection = (dbName) => {
    const connections = {};
    if(connections[dbName]) return connections[dbName];
    try{
        const url = `${process.env.MONGO_DB_BASE_URL}${dbName}`;
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

module.exports = { getConnection };