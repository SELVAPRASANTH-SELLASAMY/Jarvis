const mongoose = require('mongoose')
const streamInfo = mongoose.Schema(
    {
        degreename : {
            type:String,
            required:true
        },
        streamname:{
            type:String,
            required:true
        },
        subject_count:{
            type:Number,
            required:true,
            default:0
        },
        student_count:{
            type:Number,
            required:true,
            default:0
        },
        RefImage:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)
const stream_info = mongoose.model("streams",streamInfo)
module.exports = stream_info