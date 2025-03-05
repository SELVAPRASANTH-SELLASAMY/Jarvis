const userModel = require('../../models/nomad/User');
const { hash, compare } = require('bcrypt');
const { connect, disConnect } = require('../db');
const jwt = require('jsonwebtoken');

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
        const password = generatePassword();
        const hashedPassword = await hash(password,10);
        await userModel.create({name,email,password:hashedPassword});
        return res.status(201).send("Access request sent");
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Something went wrong",error:err});
    }
    finally{
        await disConnect();
    }
}

const handleSignIn = async(req,res) => {
    try{
        const {email, password} = req.body;
        await connect('nomad');
        const user = await userModel.findOne({email,approved:true},{name:1,role:1,password:1,image:1});
        if(user){
            const validatePassword = await compare(password,user.password);
            if(validatePassword){
                const token = jwt.sign({_id: user._id, role: user.role},process.env.SECRET_KEY,{
                    expiresIn: "2h"
                });

                return res.status(200).cookie("token",token,{
                    maxAge: 1000 * 60 * 60 * 2, //ms * s * m * h
                    path: "/",
                    secure: false,
                    httpOnly: true
                })
                .json({
                    user:{
                        name: user.name,
                        email: email,
                        image: user.image
                    }
                });
            }
            else{
                return res.status(400).send("Invalid password");
            }
        }
        else{
            return res.status(404).send("User not found");
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

const checkAuth = async(_,res) => {
    return res.status(200).json({authenticated: true});
}

module.exports = { handleSignUp, handleSignIn, handleSignOut, checkAuth };