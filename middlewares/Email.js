const validateFormData = (req,res,next) => {
    const {name,email,subject,message} = req.body;
    if(name && email && subject && message){
        return next();
    }
    return res.status(400).json({response:"All the fields are required to be filled."});
}
const validateEmail = (req,res,next) => {
    const {email} = req.body;
    const criteria = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if(criteria.test(email)){
        return next();
    }
    return res.status(400).json({response:"Invalid Email"});
}
module.exports = {validateFormData,validateEmail};