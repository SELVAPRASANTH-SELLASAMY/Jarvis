const mongoose = require('mongoose');
const connect = async(dbName) => {
    try{
        await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
        return {status:true};
    }
    catch(error){
        console.log(error);
        return {staus:false,error:error};
    }
}
const disConnect = async() => {
    try{
        await mongoose.disconnect();
        return {status:true};
    }
    catch(error){
        console.log(error);
        return {staus:false,error:error};
    }
}
module.exports = { connect, disConnect };