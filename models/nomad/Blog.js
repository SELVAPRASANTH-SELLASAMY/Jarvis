const mongoose = require('mongoose');
const BlogSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,"can't be empty"],
            lowercase: true,
            validate:{
                validator: (value) => value.length > 4,
                message: "Must be at least 5 characters long"
            }
        },
        content:{
            type:String,
            required:[true,"can't be empty"],
            validate:{
                validator: (value) => value.length > 5, //TODO: Validation should also include tags
                message: "Must be at least 5 characters long"
            }
        },
        published:{
            type:Boolean,
            default:false
        },
        category:{
            type:String,
            lowercase: true,
            default:"general"
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    },
    {
        timestamps:true
    }
);
module.exports = BlogSchema;