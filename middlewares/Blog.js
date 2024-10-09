const fs  = require('fs');
const path = require('path');
const saveImage = (req,_,next) => {
    const imageUploadPath = path.resolve(__dirname,"..","uploads");
    if(!fs.existsSync(imageUploadPath)){
        fs.mkdirSync(imageUploadPath);
    }
    const content = req.body;
    content.forEach((blog)=>{
        if(blog.type === "image"){
            const url = blog.Image;
            const imageData = url.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(imageData,"base64");
            const fileName = `image_${Math.round(Math.random() * 100000)}_${Date.now()}.webp`;
            const filePath = path.join(imageUploadPath,fileName);
            blog.Image = filePath;
            fs.writeFileSync(filePath,buffer);
        }
    });
    next();
}
module.exports = {saveImage};