const sharp = require('sharp');
const { getConnection } = require('../db');
const blogSchema = require("../../models/nomad/Blog");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const resizeImage = async(imageBuffer, width = 1500, height = 750) => {
    try{
        const resizedBuffer = await sharp(imageBuffer)
        .resize({
            width: width,
            height: height,
            fit: 'cover'
        })
        .toBuffer();
        return resizedBuffer;
    }
    catch(err){
        throw new Error(`Unable to resize image. ${err.message}`);
    }
}

const thumbStoreDests = "./uploads/nomad/blogs/thumbnails/placeholders";
if(!fs.existsSync(thumbStoreDests)){
    fs.mkdirSync(thumbStoreDests, {recursive: true});
}

const saveImage = async(file) => {
    try{
        const thumbs = [await resizeImage(file.buffer), await resizeImage(file.buffer,14,7)];
        const thumbName = `thumbnail_${Math.round(Math.random() * 100000)}_${file.originalname}`;
        const saveThumbs = thumbs.map(async(thumb,index) => {
            const location = `${thumbStoreDests}/${index === 0 ? '../' : ''}${thumbName}`;
            fs.promises.writeFile(location,thumb);
            return location;
        });
        return Promise.all(saveThumbs);
    }
    catch(error){
        throw new Error(`Error while saving image. ${error.message}`);
    }
}

const storage = multer.memoryStorage();

const uploadThumbnail = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //MB * KB * B
    }
});

const deleteOldThumbnail = (data) => {
    const thumbsToDelete = [data.thumbnail,data.placeholderThumbnail];
    thumbsToDelete.forEach((thumb) => {
        if(thumb){
            const fullPath = path.join(__dirname,"../../",thumb);
            if(fs.existsSync(fullPath)){
                fs.promises.unlink(fullPath);
            }
        }
    });
}

const handleNewBlog = async(req,res) => {
    try{
        const { userId } = req;
        if(req.file) [req.body.thumbnail, req.body.placeholderThumbnail] = await saveImage(req.file);
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
        const retrivedContent = await blogModel.findOne({_id:id,owner:userId},{"_id":0,"__v":0})
                                      .populate({
                                        path:"owner",
                                        select:"name -_id"
                                       });
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

        let retrivedBlogs = await blogModel.find(filters, {title:1,thumbnail:1,placeholderThumbnail:1,createdAt:1,category:1})
                            .sort({[sortby]: Number(ascending),createdAt: Number(ascending),_id:1})
                            .skip(Skip)
                            .limit(Limit)
                            .lean();
        const totalBlogs = await blogModel.countDocuments();
        if(retrivedBlogs.length < 1){
            return res.status(404).json({message: "No blog found"});
        }
        
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
        const deletedContent = await blogModel.findOneAndDelete(
            {_id:id,owner:userId},
            {
                projection: {
                    thumbnail: 1,
                    placeholderThumbnail: 1
                }
            }
        );
        if(deletedContent){
            deleteOldThumbnail(deletedContent);
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

        if(req.file) [fields.thumbnail, fields.placeholderThumbnail] = await saveImage(req.file);

        const db = await getConnection('nomad');
        const blogModel = db.models.Blog || db.model("Blog",blogSchema);
        const updatedContent = await blogModel.findOneAndUpdate(
            {_id:id, owner: userId},
            {$set:fields},
            {
                runValidators: true,
                projection: {
                    thumbnail: 1,
                    placeholderThumbnail: 1,
                    title: 1
                }
            }
        );
        if(!updatedContent){
            return res.status(400).json({message: "Couldn't update blog"});
        }
        if(req.body?.thumbnail && updatedContent) deleteOldThumbnail(updatedContent);
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

module.exports = { handleNewBlog, getContent, fetchAll, deleteBlog, updateBlog, getCategories, uploadThumbnail };