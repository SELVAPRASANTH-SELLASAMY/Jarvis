const { connect, disConnect } = require('../controllers/db');
const userModel = require('../models/nomad/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('./Email/Email');
const redis = require('redis');
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

        const decData = jwt.verify(token,process.env.SECRET_KEY);
        if(!decData){
            return res.status(401).json({authenticated: false,message: "Authentication failed"});
        }

        await connect('nomad');
        const user = await userModel.findOne({_id: decData._id,approved: true},{_id: 1, role: 1});
        if(!user){
            await disConnect();
            return res.status(401).json({authenticated: false,message: "Authentication failed"});
        }
        req.userId = user._id;
        req.role = user.role;
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

const client = redis.createClient();
client.connect()
.then(() => {
    console.log("Redis client ready...");
})
.catch((err) => {
    console.error("Redis client failed to connect "+err);
});

process.on("SIGINT",async() => {
    await client.quit();
    console.log("Redis client disconnected...");
    process.exit(0);
});

const generateOTP = async(req,res) => {
    try {
        const { email } = req.body;
        await connect('nomad');
        const user = await userModel.findOne({email: email,approved: true},{name: 1});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const key = `otp:${email}`;
        const OTP = Math.floor(Math.random() * 1000000);
        await client.set(key,OTP,{
            EX: 60 * 5 //s * m
        });
        sendEmail({name: user.name, otp: OTP, receiver: email, type:"otp", subject:"OTP: Nomad"});
        return res.status(200).json({message: "OTP sent"});
    } 
    catch (err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
    finally{
        await disConnect();
    }
}

const validateOTP = async(req,res) => {
    try {
        const { email, otp } = req.body;
        const key = `otp:${email}`;
        const storedOtp = await client.get(key);
        if(storedOtp === otp){
            const token = jwt.sign({email: email,otp: otp},process.env.SECRET_KEY,{
                expiresIn: "5m"
            });
            return res.status(200).cookie("tmp",token,{
                maxAge: 1000 * 60 * 5 * 1, //ms * s * m * h
                path: "/",
                secure: false,
                httpOnly: true
            })
            .send();
        }
        return res.status(400).json({message: "Invalid OTP"});
    } 
    catch (err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
}

module.exports = { isEmailExists, isAuthenticated, generateOTP, validateOTP };