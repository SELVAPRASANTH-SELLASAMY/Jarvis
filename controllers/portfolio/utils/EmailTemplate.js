const body = (name,email,message) => {
    const template =
    `<body style="background-color:#0B1223; font-family: Radio Canada, sans-serif; -webkit-tap-highlight-color: transparent; text-size-adjust: 100%; color:#ffffff;font-size:1rem; padding:.5rem">
        <header>
            <h1 style="color: #6AD229; line-height:1rem;">prasanth<span style="color: #FCF209;">.software</span></h1>

            <h2 style="color: #01E2FB; line-height: 1.5rem;">Let's dive into code</h2>
        </header>

        <main>
            <table>
                <thead>
                    <caption style="text-align: start; line-height:1.5rem;">Contact details</caption>
                </thead>
                <tbody style="line-height: 2rem;">
                    <tr>
                        <th style="text-align: start;">Name</th>
                        <td style="color: #bfbecb; text-transform:capitalize;">${name}</td>
                    </tr>
                    <tr>
                        <th style="text-align: start">Email</th>
                        <td>
                            <a style="text-decoration: unset;text-transform:lowercase; color:#bfbecb" href="mailto:${email}">
                                ${email}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <caption style="text-align: start; line-height:1.5rem;">Message</caption>
                </thead>
                <tr>
                    <td style="color: #bfbecb; text-transform:capitalize;text-indent: 3rem;">
                        ${message}
                    </td>
                </tr>
            </table>
        </main>

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

module.exports = { body };