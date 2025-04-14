const contactBack = (name,email,message) => {
    return(
        `<main>
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
        </main>`
    );
}

module.exports = contactBack;