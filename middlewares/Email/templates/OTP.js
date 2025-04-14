const sendOTP = (name,otp) => {
    return(
        `<main>
            <h3 style="font-weight: 500;">Hi ${name},</h3>
            <p style="color: #bfbecb; text-transform:capitalize;text-indent: 3rem;">Your OTP to reset your nomad password is <strong style="color:#ffffff">${otp}</strong>, valid for 30 mins. Do not share it with anyone.</p>
        </main>`
    );
}

module.exports = sendOTP;