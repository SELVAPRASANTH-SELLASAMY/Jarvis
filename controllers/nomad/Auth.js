const userModel = require('../../models/nomad/Signup');
const { hash } = require('bcrypt');
const { disConnect } = require('../db');

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

module.exports = { handleSignUp };