const sharp = require('sharp');
const blogModel = require("../../models/nomad/Blog");
const { connect, disConnect } = require("../db");

const exceptionBound = async(statement,res) => {
    try{
        await connect('nomad');
        await statement();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Something went wrong",error:error});
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

const resizeImage = async(image) => {
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64,"base64");
    const resizedBuffer = await sharp(buffer)
    .resize({width:10,withoutEnlargement: true})
    .toBuffer();
    const stringUrl = resizedBuffer.toString("base64");
    return `data:image/png;base64,${stringUrl}`;
}

const handleNewBlog = (req,res) => {
    exceptionBound(async() => {
        await blogModel.create(req.body);
        return res.status(201).send("Blog saved successfully");
    },res);
}

const getContent = (req,res) => {
    exceptionBound(async() => {
        const id = req.query.id;
        if(!id){
            return res.status(400).send("Bad request");
        }
        const retrivedContent = await blogModel.findOne({_id:id},{"_id":0,"__v":0,"createdAt":0,"updatedAt":0});
        if(retrivedContent.length < 1){
            return res.status(404).send("Resource not found");
        }
        return res.status(200).send(retrivedContent);
    },res);
}

const fetchAll = (req,res) => {
    exceptionBound(async() => {
        const getImage = (content) => {
            const imgRegex = /<img[^>]+src="([^">]+)"/i;
            const match = content.match(imgRegex);
            return match ? match[1] : null;
        };

        const { page, sortby, ascending, category, search } = req.query;
        const Limit = 5;
        const Skip = ((page - 1) * Limit);

        const categoryFilter = category === "All" ? {} : {category:category};
        const searchFilter = (search.length > 3 || search.length === 0) ? {title:{$regex:search}} : {};

        const filters = {
            ...categoryFilter,
            ...searchFilter
        };

        let retrivedBlogs = await blogModel.find(filters, {title:1,content:1,createdAt:1,category:1})
                            .sort({[sortby]: Number(ascending),createdAt: Number(ascending),_id:1})
                            .skip(Skip)
                            .limit(Limit)
                            .lean();
        const totalBlogs = await blogModel.countDocuments();
        if(retrivedBlogs.length < 1){
            return res.status(404).send("No blog found");
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
    },res);
}

const deleteBlog = (req,res) => {
    exceptionBound(async() => {
        const id = req.query.id;
        if(!id){
            return res.status(400).send("Bad request");
        }
        const deletion = await blogModel.deleteOne({_id:id});
        if(deletion.deletedCount > 0){
            return res.status(200).send("Blog deleted successfully");
        }
        return res.status(404).send("Couldn't delete the blog");
    },res);
}

const updateBlog = (req,res) => {
    exceptionBound(async() => {
        const id = req.query.id;
        const fields = req.body;
        if(!id){
            return res.status(400).send("Bad request");
        }
        const update = await blogModel.updateOne({_id:id},{$set:fields},{runValidators:true});
        if(update.modifiedCount <= 0){
            return res.status(400).send("Couldn't update blog");
        }
        return res.status(200).send("Blog updated successfully");
    },res);
}

module.exports = { handleNewBlog, getContent, fetchAll, deleteBlog, updateBlog };