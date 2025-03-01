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
            return res.status(400).send("An account with this email already exists");
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

        const user = jwt.verify(token,process.env.SECRET_KEY);
        if(!user){
            return res.status(401).json({authenticated: false,message: "UnAuthorized access"});
        }

        await connect('nomad');
        const isUserExist = await userModel.findOne({_id: user._id,approved: true},{_id: 1});
        if(!isUserExist){
            return res.status(401).json({authenticated: false,message: "UnAuthorized access"});
        }
        return next();
    } 
    catch(err){
        console.error(err);
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({message:"Session expired, please sign in again",error:err});
        }
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
    finally{
        await disConnect();
    }
}

module.exports = { isEmailExists, isAuthenticated };