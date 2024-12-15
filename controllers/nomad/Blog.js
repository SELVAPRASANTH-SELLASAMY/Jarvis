const blogModel = require("../../models/nomad/Blog");
const { connect, disConnect } = require("../db");

const exceptionBound = async(statement,res) => {
    try{
        await connect('nomad');
        await statement();
    }
    catch(error){
        console.error(error);
        return res.status(400).json({response:"Something went wrong",error:error});
    }
    finally{
        try{
            await disConnect();
        }
        catch(error){
            console.warn(`Error while disconnecting from the database ${error}`);
        }
    }
}

const handleNewBlog = (req,res) => {
    exceptionBound(async() => {
        const createBlog = await blogModel.create(req.body);
        if(!createBlog){
            return res.status(400).json({response:"Couldn't save blog into database"});
        }
        return res.status(201).json({response:"Blog saved"});
    },res);
}

const getContent = (req,res) => {
    exceptionBound(async() => {
        const id = await req.query.id;
        const retrivedBlogs = await blogModel.findOne({_id:id},{"_id":0,"__v":0});
        if(retrivedBlogs.length < 1){
            return res.status(404).send();
        }
        return res.status(200).json({response:retrivedBlogs});
    },res);
}

const fetchAll = (_,res) => {
    exceptionBound(async() => {
        const getImage = (content) => {
            const imgRegex = /<img[^>]+src="([^">]+)"/i;
            const match = content.match(imgRegex);
            return match ? match[1] : null;
        };
        let retrivedBlogs = await blogModel.find({},{title:1,content:1});
        if(retrivedBlogs.length < 1){
            return res.status(404).send();
        }
        retrivedBlogs.forEach((blog)=>{
            blog.content = getImage(blog.content);
        })
        return res.status(200).json({response:retrivedBlogs});
    },res);
}

module.exports = { handleNewBlog, getContent, fetchAll };