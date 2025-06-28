const mongoose = require('mongoose');
const connect = async(dbName) => {
    if(!dbName) throw {message:"Error while connecting to the database"};
    await mongoose.connect(`${process.env.MONGO_DB_BASE_URL}${dbName}`);
}
const disConnect = async() => {
    //We may use the disconnect inside the finally block. So, we must wrap this inside the try...cactch block
    try{
        await mongoose.disconnect();
    }
    catch(err){
        console.warn("Something happens while disconnecting the database");
    }
}
module.exports = { connect, disConnect };