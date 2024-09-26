const nodemailer = require('nodemailer');
const sendEmail = async(req,res) => {
    const {name,email,subject,message} = req.body;
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
            from:`selvaprasanth.tech <${process.env.EMAIL_USER}>`,
            to:`prasanthsamy61@gmail.com, ${process.env.EMAIL_USER}`,
            subject:`Client mail: "${subject}"`,
            html:`
                <body style="background-color: #0b1223; box-sizing: border-box; padding: 0; margin: 0;">
                    <div style="font-family: sans-serif; padding: 2.5% 5%; font-size: 1rem; line-height: 1.5rem; color: #ffffff;">
                        <div style="background-color: #162033; padding: 2rem 1.5rem; margin-bottom: 2rem; box-shadow: rgba(255, 255, 255, 0.02) 0px 1px 3px 0px, rgba(197, 226, 255, 0.15) 0px 0px 0px 1px; border-radius: .5rem;">
                            <p><a href="https://selvaprasanth.tech" style="text-decoration: none; font-size: 1.25rem; text-transform: uppercase; font-weight: 600; color: #72e2ae;">Selvaprasanth.tech</a></p>
                        </div>
                        <p style="text-transform: capitalize;"><strong>Name: </strong>${name}</p>
                        <p><strong>Email: </strong><a style="text-decoration: none; color: #72e2ae; font-weight: 500; text-transform: lowercase;" href="mailto:${email}" target="_blank" rel="noreferrer noopener">${email}</a></p>
                        <p style="text-align: justify;">${message}</p>
                    </div>
                </body>`
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