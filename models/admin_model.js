const mongoose = require('mongoose')
const admin_schema = mongoose.Schema(
    {
        email:{
            type:String,
            require:[true,"Email required."],
            trim:true,
            unique:true
        },
        password:{
            type:String,
            require:[true,"Password required."]
        }
    },
    {
        timestamps:true
    }
)
const admin_model = mongoose.model("administrators",admin_schema)
module.exports = admin_model