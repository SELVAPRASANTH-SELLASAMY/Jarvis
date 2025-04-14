const send = require('../../middlewares/Email/Email');
const sendMessage = async(req,res) => {
    const { name, email, subject, message } = await req.body;
    const receiver = process.env.EMAIL_RECEIVER;
    try{
        const senderResponse = await send({name, email, subject, message, receiver});
        if(senderResponse){
            return res.status(200).json({response:`Mail sent ${senderResponse}`});
        }
        return res.status(400).json({response:`Something went wrong ${senderResponse}`});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({response:`Something went wrong ${error}`});
    }
}

module.exports = { sendMessage };