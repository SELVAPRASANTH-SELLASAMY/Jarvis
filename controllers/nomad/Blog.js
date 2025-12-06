const sharp = require('sharp');
const { getConnection } = require('../db');
const blogSchema = require("../../models/nomad/Blog");
const resizeImage = async(image) => {
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64,"base64");
    const resizedBuffer = await sharp(buffer)
    .resize({width:10,withoutEnlargement: true})
    .toBuffer();
    const stringUrl = resizedBuffer.toString("base64");
    return `data:image/png;base64,${stringUrl}`;
}

const handleNewBlog = async(req,res) => {
    try{
        const { userId } = req;
        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        await blogModel.create({...req.body, owner: userId});
        return res.status(201).json({message: "Blog saved successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error: err});
    }
}

const getContent = async(req,res) => {
    try{
        const { userId } = req;
        const id = req.query.id;
        if(!id){
            return res.status(400).json({message: "Bad request"});
        }
        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        const retrivedContent = await blogModel.findOne({_id:id,owner:userId},{"_id":0,"__v":0,"createdAt":0,"updatedAt":0});
        if(!retrivedContent){
            return res.status(404).json({message: "Requested content not found"});
        }
        return res.status(200).json({data: retrivedContent});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error: err});
    }
}

const fetchAll = async(req,res) => {
    try{
        const getImage = (content) => {
            const imgRegex = /<img[^>]+src="([^">]+)"/i;
            const match = content.match(imgRegex);
            return match ? match[1] : null;
        };

        const { userId } = req;
        const { page, sortby, ascending, category, search } = req.query;
        const Limit = 5;
        const Skip = ((page - 1) * Limit);

        const categoryFilter = category.toLowerCase() === "all" ? {} : {category: category.toLowerCase()};
        const searchFilter = (search.length > 3 || search.length === 0) ? {title:{$regex:search}} : {};

        const filters = {
            ...categoryFilter,
            ...searchFilter,
            owner: userId
        };

        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);

        let retrivedBlogs = await blogModel.find(filters, {title:1,content:1,createdAt:1,category:1})
                            .sort({[sortby]: Number(ascending),createdAt: Number(ascending),_id:1})
                            .skip(Skip)
                            .limit(Limit)
                            .lean();
        const totalBlogs = await blogModel.countDocuments();
        if(retrivedBlogs.length < 1){
            return res.status(404).json({message: "No blog found"});
        }
        retrivedBlogs = await Promise.all(retrivedBlogs.map(async(blog) => {
            const img = getImage(blog.content);
            blog.content = img;
            blog.lazyImage = await resizeImage(img);
            return blog;
        }))
        return res.status(200).json({
            data: retrivedBlogs,
            hasMore: (retrivedBlogs.length >= Limit) && ((Skip + Limit) < totalBlogs)
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error: err});
    }
}

const deleteBlog = async(req,res) => {
    try{
        const { userId } = req;
        const id = req.query.id;
        if(!id){
            return res.status(400).json({message: "Bad request"});
        }
        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        const deletion = await blogModel.deleteOne({_id:id,owner:userId});
        if(deletion.deletedCount > 0){
            return res.status(200).json({message: "Blog deleted successfully"});
        }
        return res.status(404).json({message: "Couldn't delete the blog"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error: err});
    }
}

const updateBlog = async(req,res) => {
    try{
        const { userId } = req;
        const id = req.query.id;
        const fields = req.body;
        if(!id){
            return res.status(400).json({message: "Bad request"});
        }
        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        const update = await blogModel.updateOne({_id:id,owner:userId},{$set:fields},{runValidators:true});
        if(update.modifiedCount <= 0){
            return res.status(400).json({message: "Couldn't update blog"});
        }
        return res.status(200).json({message: "Blog updated successfully"});
        // Sending updated data back to the client will be a heavier response
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error: err});
    }
}

const getCategories = async(_,res) => {
    try{
        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        const categories = await blogModel.aggregate([
            {
                $group:{
                    _id: null, 
                    categories: {
                        $addToSet: "$category"
                    }
                }
            },
            {
                $project: {
                    categories: 1,
                    _id: 0
                }
            }
        ]);
        return res.status(200).json({categories: categories[0]?.categories || []});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong",error:err});
    }
}

module.exports = { handleNewBlog, getContent, fetchAll, deleteBlog, updateBlog, getCategories };