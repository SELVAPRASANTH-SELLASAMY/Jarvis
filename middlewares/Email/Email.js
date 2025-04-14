const nodemailer = require('nodemailer');
const path = require('path');
const body = require('./body');

const send = async(params) => {
    const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:process.env.MAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_AUTH_PASSWORD
        }
    });

    const { receiver, subject } = params;
    const info = await transporter.sendMail({
        from:`prasanth.software <${process.env.EMAIL_USER}>`,
        to:`${receiver}, ${receiver}`,
        subject:`Client mail: "${subject}"`,
        html:body(params),
        attachments:[{
            filename:'logo.png',
            path:path.join(__dirname,'assets/logo.png'),
            cid:'myLogo'
        }]
    });
    return info.messageId;
}

module.exports = send;