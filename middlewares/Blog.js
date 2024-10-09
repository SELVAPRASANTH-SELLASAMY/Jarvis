const fs = require("fs");
const path = require("path");
const saveImages = async(req,res,next) => {
    const save = (img,type="image") => {
        const fileName = `image_${Math.round(Math.random() * 100000)}_${Date.now()}.webp`;
        const pathToSave = path.resolve(__dirname,"..",`uploads${type === "placeholder" ? '/placeholders' : ""}`);
        try{
            if(!fs.existsSync(pathToSave)){
                fs.mkdirSync(pathToSave);
            }
        }
        catch(error){
            return res.status(500).json({message:"Server couldn't create directory to save files",error:error});
        }
        const fileData = img.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(fileData,"base64");
        const filePath = path.join(pathToSave,fileName);
        try{
            fs.writeFileSync(filePath,buffer);
            return filePath;
        }
        catch(error){
            return res.status(500).json({message:"error while saving image!",error:error});
        }
    }
    const content = await req.body;
    content.forEach(async(blog)=>{
        if(blog.type === "image"){
            blog.Image = await save(blog.Image);
            blog.PlaceholderImage = await save(blog.PlaceholderImage,"placeholder");
        }
    });
    return next();
}
module.exports = {saveImages};