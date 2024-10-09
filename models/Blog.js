const mongoose = require('mongoose');
const blogSchema = mongoose.Schema(
    {
        type:{
            type:String,
            require:true,
            default:'paragraph'
        },
        content:{
            type:String
        },
        Image:{
            type:String
        },
        PlaceholderImage:{
            type:String
        }
    },
    {
        timestamps:true
    }
);
const blogModel = mongoose.model("blogs",blogSchema);
module.exports = blogModel;