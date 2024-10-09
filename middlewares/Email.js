const validateFormData = async(req,res,next) => {
    try{
        const {name,email,subject,message} = await req.body;
        if(name && email && subject && message){
            return next();
        }
        return res.status(400).json({response:"All the fields are required to be filled."});
    }
    catch(error){
        return res.status(400).json({message:"Invalid data!",error:error});
    }
}
const validateEmail = async(req,res,next) => {
    try{
        const {email} = await req.body;
        const criteria = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        if(criteria.test(email)){
            return next();
        }
        return res.status(400).json({response:"Invalid Email"});
    }
    catch(error){
        return res.status(400).json({message:"Invalid data!",error:error});
    }
}
module.exports = {validateFormData,validateEmail};