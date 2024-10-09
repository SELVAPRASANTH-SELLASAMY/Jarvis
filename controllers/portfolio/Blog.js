const mongoose = require('mongoose');
const blogModel = require('../../models/Blog');
const addBlogs = async(req,res) => {
    const db = "portfolio";
    try{
        await mongoose.connect(`mongodb://localhost:27017/${db}`);
        await blogModel.insertMany(req.body);
        res.status(201).json({message:"blog saved!"});
    }
    catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
    finally{
        await mongoose.disconnect();
    }
}
module.exports = {addBlogs};