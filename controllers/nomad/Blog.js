const blogModel = require("../../models/nomad/Blog");
const { connect, disConnect } = require("../db");
const handleNewBlog = async(req,res) => {
    try{
        const con = await connect('nomad');
        if(!con.status){
            return res.status(500).json({response:"Couldn't establish connection to the database",error:con.error});
        }
        const createBlog = await blogModel.create(req.body);
        if(!createBlog){
            return res.status(400).json({response:"Couldn't save blog into database"});
        }
        return res.status(200).json({response:"Blog saved"});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({response:"Something went wrong",error:error});
    }
    finally{
        await disConnect();
    }
}

const getBlogs = async(_,res) => {
    try{
        const con = await connect('nomad');
        if(!con.status){
            return res.status(500).json({response:"Couldn't establish connection to the database",error:con.error});
        }
        const retrivedBlogs = await blogModel.find({},{"_id":0,"__v":0});
        return res.status(200).json({response:retrivedBlogs});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({response:"Something went wrong",error:error});
    }
    finally{
        await disConnect();
    }
}
module.exports = { handleNewBlog, getBlogs };