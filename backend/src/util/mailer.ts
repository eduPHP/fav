import nodemailer from 'nodemailer'
import {mail} from "./config";

export default {
    async send(to: string, subject: string, text: string, html: string|null = null) {
        return await this.transporter().sendMail({
            from: `"${mail.from.name}" <${mail.from.email}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html: html ? html : text, // html body
        })
    },

    transporter() {
        return nodemailer.createTransport({
            host: mail.host,
            port: mail.port,
            secure: mail.port === 465, // true for 465, false for other ports
            auth: {
                user: mail.user, // generated ethereal user
                pass: mail.pass, // generated ethereal password
            },
        });
    }
}
