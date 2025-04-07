const { connect, disConnect } = require('../controllers/db');
const userModel = require('../models/nomad/User');
const jwt = require('jsonwebtoken');
const isEmailExists = async(req,res,next) => {
    try{
        const { email } = req.body;
        await connect('nomad');
        const user = await userModel.findOne({email:email});
        if(user){
            await disConnect();
            return res.status(400).json({message: "An account with this email already exists"});
        }
        next();
    }
    catch(err){
        console.error(err);
        await disConnect();
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
}

const isAuthenticated = async(req,res,next) => {
    try {
        const { token } = req.cookies;
        if(!token){
            return res.status(401).json({authenticated: false,message: "UnAuthorized access"});
        }

        const decData = jwt.verify(token,process.env.SECRET_KEY);
        if(!decData){
            return res.status(401).json({authenticated: false,message: "UnAuthorized access"});
        }

        await connect('nomad');
        const user = await userModel.findOne({_id: decData._id,approved: true},{_id: 1});
        if(!user){
            await disConnect();
            return res.status(401).json({authenticated: false,message: "UnAuthorized access"});
        }
        req.userId = user._id;
        return next();
    } 
    catch(err){
        console.error(err);
        await disConnect();
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({message:"Session expired, please sign in again",error:err});
        }
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
}

module.exports = { isEmailExists, isAuthenticated };