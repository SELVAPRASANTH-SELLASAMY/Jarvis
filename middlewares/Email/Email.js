const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const body = require('./body');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_OAUTH_REFRESH_TOKEN
});

let transporter = null;

(async () => {
    transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
        accessToken: await oAuth2Client.getAccessToken().token
        }
    })
})();

const send = async(params) => {
    const { receiver, subject } = params;

    try{
        const info = await transporter.sendMail({
            from:`prasanth.software <${process.env.EMAIL_USER}>`,
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