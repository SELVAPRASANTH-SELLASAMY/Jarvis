const sendPassword = (name, password) => {
    return(
        `<main>
            <h3 style="font-weight: 500;">Hi ${name},</h3>
            <p style="color: #bfbecb; text-transform:capitalize;text-indent: 3rem;">Your access request to nomad is processed and password for accessing the same is <strong style="color:#ffffff">${password}</strong>, you can change it once you login. Do not share it with anyone.</p>
        </main>`
    );
}

module.exports = sendPassword;