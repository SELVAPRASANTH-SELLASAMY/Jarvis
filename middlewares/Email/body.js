const ContactBackTmp = require('./templates/ContactBack');
const otpTmp = require('./templates/OTP');
const PasswordTmp = require('./templates/Password');
const body = (params) => {

    const { name, type="contact_back" } = params;
    
    const handleMailTemplate = () => {
        switch(type){
            case "otp":
                const { otp } = params;
                return otpTmp(name,otp);
            case "password":
                const { password } = params;
                return PasswordTmp(name,password);
            default:
                const { message, email } = params;
                return ContactBackTmp(name,email,message);
        }
    }

    const template =
    `<body style="background-color:#0B1223; font-family: Radio Canada, sans-serif; -webkit-tap-highlight-color: transparent; text-size-adjust: 100%; color:#ffffff;font-size:1rem; padding:.5rem">
        <header>
            <h1 style="color: #6AD229; line-height:1rem;">prasanth<span style="color: #FCF209;">.software</span></h1>

            <h2 style="color: #01E2FB; line-height: 1.5rem;">Let's dive into code</h2>
        </header>

        ${handleMailTemplate()}

        <footer>
            <p style="line-height: 2rem;">Regards,<br>
                <strong>Nomad</strong>
            </p>
            <img 
                style="height: 3rem; border:.1rem solid #ffffff33; border-radius:100%" 
                src="cid:myLogo" 
                alt="prasanth.software"
            >
        </footer>
    </body>`
    return template;
}

module.exports = body;