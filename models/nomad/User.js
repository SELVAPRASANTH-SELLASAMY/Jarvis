const mongoose = require('mongoose');
const Schema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name can't be empty"],
            validate:{
                validator: (value) => /^[A-Za-z_ ]{5,20}$/.test(value),
                message: "Invalid Name"
            }
        },
        email:{
            type:String,
            required:[true,"Email can't be empty"],
            validate:{
                validator: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
                message: "Invalid Email"
            }
        },
        image:{
            type:String,
            default:null
        },
        role:{
            type:String,
            default:'user'
        },
        approved:{
            type:Boolean,
            default:false
        },
        password:{
            type:String,
            required:[true,"Password can't be empty"],
            validate:{
                validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value),
                message: "Password doesn't met the requiredd criteria"
            }
        }
    },
    {
        timestamps:true
    }
);
const UserModel = mongoose.model("users",Schema);
module.exports = UserModel;