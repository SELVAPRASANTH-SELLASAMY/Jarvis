const { disConnect } = require("../db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userModel = require('../../models/nomad/User');

const desiredPath = path.join(__dirname,'../../uploads/nomad/');
if(!fs.existsSync(desiredPath)){
    fs.mkdirSync(desiredPath,{recursive: true});
}

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,desiredPath);
    },
    filename:(req,file,cb) => {
        const ext = path.extname(file.originalname);
        cb(null,`picture_${Date.now()}_${ext}`);
    }
});

const upload = multer({storage});

const handleProfileUpdate = async(req,res) => {
    try {
        const { userId } = req;
        const fields = req.body;
        if(req.file) {
            const splitedPath = desiredPath.split(":");
            fields.image = splitedPath[0].length > 3 ? desiredPath : "http://localhost:3001/uploads/nomad/";
            fields.image += req.file.filename;
        }
        const update = await userModel.updateOne({_id:userId},{$set:fields},{runValidators:true});
        if(update.modifiedCount <= 0){
            return res.status(400).send("Couldn't update the details");
        }
        return res.status(200).send("Details updated successfully");
    } 
    catch(err) {
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
    finally{
        await disConnect();
    }
}

module.exports = { upload, handleProfileUpdate };