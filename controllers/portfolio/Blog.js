const multer = require("multer");
const fs = require("fs");
const uploadPath = "uploads";
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,uploadPath);
    },
    filename : (req,file,cb) => {
        cb(null,`${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({storage});
const handleImageUpload = (req,res) => {
    console.log(req.file.path);
    try{
        if(req.file){
            return res.status(200).json({path:`http://localhost:3001/${req.file.path}`});
        }
        return res.status(400).json({error:"Couldn't upload file"});
    }
    catch(error){
        return res.status(400).json({error:error});
    }
}
module.exports = {upload,handleImageUpload};