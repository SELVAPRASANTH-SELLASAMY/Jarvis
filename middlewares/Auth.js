const { connect, disConnect } = require('../controllers/db');
const userModel = require('../models/nomad/Signup');
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

module.exports = { isEmailExists };