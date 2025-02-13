const exceptionBound = require('../exceptionBound');
const SignupModel = require('../../models/nomad/Signup');
const generatePassword = (length = 10) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    
    return password;
};

const handleSignUp = (req,res) => {
    exceptionBound(async() => {
        const { name, email } = req.body;
        const password = generatePassword();
        await SignupModel.create({name,email,password});
        return res.status(201).send("Access request sent");
    },res);
}

module.exports = { handleSignUp };