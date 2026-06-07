const nodemailer = require('nodemailer');
const path = require('path');
const body = require('./body');

const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const send = async(params) => {
    const { receiver, subject } = params;

    try{
        const info = await transporter.sendMail({
            from:`prasanth.live <${process.env.GMAIL_USER}>`,
            to:`${receiver}, ${receiver}`,
            subject: subject,
            html:body(params),
            attachments:[{
                filename:'logo.png',
                path:path.join(__dirname,'assets/logo.png'),
                cid:'myLogo'
            }]
        });
        return info.messageId;
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

module.exports = send;