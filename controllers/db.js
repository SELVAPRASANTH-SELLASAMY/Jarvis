const mongoose = require('mongoose');
const connect = async(dbName) => {
    if(!dbName) throw {message:"Error while connecting to the database"};
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
}
const disConnect = async() => {
    await mongoose.disconnect();
}
module.exports = { connect, disConnect };