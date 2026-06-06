const sendPassword = (name, password) => {
    return(
        `<main>
            <h3 style="font-weight: 500;">Hi ${name},</h3>
            <p style="color: #bfbecb; text-indent: 3rem; line-height: 2rem;">Your access request to nomad is processed and password for accessing the same is <strong style="color:#ffffff">${password}</strong>. Do not share it with anyone. You can change your password by visiting the profile settings.</p>
        </main>`
    );
}

module.exports = sendPassword;