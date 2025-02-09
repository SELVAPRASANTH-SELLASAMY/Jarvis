const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    name:{
        type:String,
        require:[true,"Name can't be empty"],
        validate:{
            validator: (value) => /^[A-Za-z_ ]{5,15}$/.test(value),
            message: "Invalid Name"
        }
    },
    password:{
        type:String,
        require:[true,"Password can't be empty"],
        validate:{
            validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value),
            message: "Password doesn't met the required criteria"
        }
    }
});
const UserModel = mongoose.model("users",Schema);
module.exports = UserModel;