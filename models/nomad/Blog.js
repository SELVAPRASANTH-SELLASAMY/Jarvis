const mongoose = require('mongoose');
const BlogSchema = mongoose.Schema(
    {
        title:{
            type:String,
            require:[true,"Blog title can't be empty"]
        },
        content:{
            type:String,
            require:[true,"Blog content can't be empty"]
        },
        published:{
            type:Boolean,
            default:false
        },
        category:{
            type:String,
            default:"general"
        }
    },
    {
        timestamps:true
    }
);
const BlogModel = mongoose.model('blogs',BlogSchema);
module.exports = BlogModel;