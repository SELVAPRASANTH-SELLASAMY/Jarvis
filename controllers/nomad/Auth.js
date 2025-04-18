const userModel = require('../../models/nomad/User');
const { hash, compare } = require('bcrypt');
const { connect, disConnect } = require('../db');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../middlewares/Email/Email');

const generatePassword = () => {
    const lowerCases = "abcdefghijklmnopqrstuvwxyz";
    const upperCases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%&*";

    let password = "";

    password += upperCases[Math.floor(Math.random() * upperCases.length)];
    password += lowerCases[Math.floor(Math.random() * lowerCases.length)];
    password += Math.floor(Math.random() * 9);
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    const allChars = lowerCases + upperCases + specialChars + "0123456789";

    for(let i = 0; i < 6;i++){
        password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    password = password.split("").sort(() => Math.random() - 0.5).join("");
    return password;
}

const handleSignUp = async(req,res) => {
    //No need to connect the db it was already connected in the middleware itself.
    try{
        const { name,email } = req.body;
        const user = await userModel.create({name,email});
        return res.status(201).json({
            message: "Access request created",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                approved: user.approved
            }
        });
    }
    catch(err){
        console.error(err);
        return res.status(400).json({message:"Something went wrong",error:err});
    }
    finally{
        await disConnect();
    }
}

const handleSignIn = async(req,res) => {
    try{
        const {email, password} = req.body;
        await connect('nomad');
        const user = await userModel.findOne({email,approved:true},{password:1});
        if(user){
            const validatePassword = await compare(password,user.password);
            if(validatePassword){
                const token = jwt.sign({_id: user._id},process.env.SECRET_KEY,{
                    expiresIn: "2h"
                });

                return res.status(200).cookie("token",token,{
                    maxAge: 1000 * 60 * 60 * 2, //ms * s * m * h
                    path: "/",
                    secure: false,
                    httpOnly: true
                })
                .send();
            }
            else{
                return res.status(400).json({message: "Invalid password"});
            }
        }
        else{
            return res.status(404).json({message: "User not found"});
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
    finally{
        await disConnect();
    }
}

const handleSignOut = (_,res) => {
    return res.status(200).clearCookie("token",{
        secure: false,
        httpOnly: true
    }).send();
}

const checkAuth = async(req,res) => {
    try{
        const userId = req.userId;
        const userData = await userModel.findOne({_id: userId, approved: true},{_id: 0, name: 1, email: 1, image: 1});
        return res.status(200).json({
            authenticated: true,
            user:userData
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
    finally{
        await disConnect();
    }
}

const getUsers = async(req,res) => {
    try{
        const { userId } = req;
        const users = await userModel.find({_id: {$ne: userId}},{name: 1,email: 1,approved: 1});
        return res.status(200).json({users});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
}

const handleApproval = async(req,res) => {
    try {
        const { userId } = req;
        const user = await userModel.findOne({_id: userId, role: "admin"},{_id:1});
        if(user.length <= 0){
            return res.status(401).json({message: "Unauthorised access"});
        }
        const { id } = req.body;
        const password = generatePassword();
        const update = await userModel.findByIdAndUpdate({_id: id},[{
                $set: {
                    approved: {
                        $not: "$approved"
                    },
                    password: {
                        $cond: {
                            if: {
                                $eq:["$approved", false]
                            },
                            then: {
                                $literal: await hash(password,10)
                            },
                            else: null
                        }
                    }
                }
            }],
            {new: true}
        );
        if(update){
            sendEmail({name: update.name, password: password, receiver: update.email, type:"password", subject:"Nomad login credentials"});
            return res.status(200).json({message: `Access ${update.approved ? "granted" : "removed"} to ${update.name}`});
        }
        return res.status(400).json({message: "Error while granting access. try after sometime"});
    } 
    catch (err) {
        console.log(err);
        return res.status(500).json({message:"Something went wrong",error:err.message});
    }
}

module.exports = { handleSignUp, handleSignIn, handleSignOut, checkAuth, getUsers, handleApproval };