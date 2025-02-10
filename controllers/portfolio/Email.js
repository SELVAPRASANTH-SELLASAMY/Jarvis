const nodemailer = require('nodemailer');
const { body } = require('./utils/EmailTemplate');
const path = require('path');
const sendEmail = async(req,res) => {
    const {name,email,subject,message} = await req.body;
    const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:process.env.MAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_AUTH_PASSWORD
        }
    });
    const send = async() => {
        const info = await transporter.sendMail({
            from:`prasanth.software <${process.env.EMAIL_USER}>`,
            to:`prasanthsamy61@gmail.com, ${process.env.EMAIL_RECEIVER}`,
            subject:`Client mail: "${subject}"`,
            html:body(name,email,message),
            attachments:[{
                filename:'logo.png',
                path:path.join(__dirname,'utils','assets/logo.png'),
                cid:'myLogo'
            }]
        });
        return info.messageId;
    }
    try{
        const senderResponse = await send();
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

module.exports = {sendEmail};