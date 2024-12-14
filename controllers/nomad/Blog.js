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

const getContent = async(req,res) => {
    try{
        const con = await connect('nomad');
        if(!con.status){
            return res.status(500).json({response:"Couldn't establish connection to the database",error:con.error});
        }
        const id = await req.query.id;
        const retrivedBlogs = await blogModel.findOne({_id:id},{"_id":0,"__v":0});
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

const fetchAll = async(_,res) => {
    const getImage = (content) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/i;
        const match = content.match(imgRegex);
        return match ? match[1] : null;
    };
    try{
        const con = await connect('nomad');
        if(!con.status){
            return res.status(500).json({response:"Couldn't establish connection to the database",error:con.error});
        }
        let retrivedBlogs = await blogModel.find({},{title:1,content:1});
        retrivedBlogs.forEach((blog)=>{
            blog.content = getImage(blog.content);
        })
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
module.exports = { handleNewBlog, getContent, fetchAll };