const express = require('express')
const multer = require('multer')
const App = express()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const admin_model = require('./models/admin_model')
const stream_model = require('./models/stream_info')
require('dotenv').config()
App.use(express.json())
App.use(cookieParser())
App.use(cors({origin:'http://localhost:3000',credentials:true}))
// App.use(cors())
App.listen(process.env.PORT,()=>{
    console.log(`RMS API Awaked at port ${process.env.PORT}`)
})
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rms')
.then(()=>{
    console.log("Connected to the mongoDB Database")
})
.catch((error)=>{
    console.error(error)
})
App.get("/",(req,res)=>{
    res.send(`<h1 style='font-size:2.5rem'>RMS API Awaked at port ${process.env.PORT}...</h1>`)
})
App.post('/createuser',async(req,res)=>{
    try{
        const {email,password} = req.body
        bcrypt.hash(password,10).then(async(hashval)=>{
            const user = await admin_model.create({email:email,password:hashval})
            if(user) {return res.status(200).json({message:"User created"})} 
            return res.status(400).json({message:"Couldn't create user"})
        })
        .catch((error)=>{
            console.error("Password hash error \n",error)
            return res.status(400).json({message:`Error while hashing password \n ${error}`})
        })
    }
    catch(error){
        console.error(error)
        return res.status(400).json({messgae:"Something went wrong."})
    }
})
App.post('/adminlogin',async(req,res)=>{
    const {email,password} = req.body
    // console.log(email);
    try{
        const admin = await admin_model.findOne({email:email})
        if(admin){
            const dbpassword = admin.password
            const password_verify = await bcrypt.compare(password,dbpassword)
            if(password_verify){
                const token = jwt.sign({adminId:admin._id},process.env.SECRET,{expiresIn: '1h'})
                // console.log(token)
                res.cookie('SessionId',token,{
                    httpOnly:true,
                    secure:true,
                    maxAge: (1 * 2 * 60 * 1000), // hours * minutes * seconds * milliseconds
                    path:'/'
                })
                res.status(200).json({message:"Logged in"})
            }
            else{
                return res.status(400).json({message:"Invalid password."})
            }
        }
        else{
            return res.status(400).json({message:"user not found."})
        }
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:"Something went wrong."})
    }
})

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'./images')
    },
    filename : (req,file,cb) => {
        cb(null,`${Date.now()}_${file.originalname}`)
    }
})

const uploadImage = multer({storage:storage,limits:{fileSize:1000000}})

App.post('/uploadImages',uploadImage.single('reference_image'),(req,res)=>{
    try{
        if(!req.file){
            res.status(400).json({message:"Couldn't upload image file"})
        }
        else{
            if(req.file.path){
                console.log(req.file)
                res.status(200).json({path:`http://localhost:${process.env.PORT}/images/`+req.file.filename})
            }
            else{
                res.status(400).json({message:"Something went wrong : "+req})
            }
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
})

const fs = require('fs')
const dir = './images'
if(!fs.existsSync(dir)){
    fs.mkdirSync('./images')
}

App.post('/storestreams',async(req,res)=>{
    const {degreename,streamname,RefImage} = req.body
    try{
        const stream = await stream_model.create({degreename:degreename,streamname:streamname,RefImage:RefImage})
        if(stream){
            res.status(200).json({message:"Data's stored"})
        }
        else{
            res.status(400).json({message:res})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
})

App.get('/getstreams',async(req,res)=>{
    try{
        const streams = await stream_model.find();
        if(!streams){
            res.status(400).json({message:"Couldn't reach the servers"});
        }
        else{
            res.status(200).send(streams);
            console.log(streams);
        }
    }
    catch(error){
        res.status(400).json({message:error});
    }
})

App.use('/images',express.static('images'));