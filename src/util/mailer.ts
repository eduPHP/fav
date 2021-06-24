import nodemailer from 'nodemailer';
import { mail } from '@config/index';
import aws from 'aws-sdk';

export default {
  async send(
    to: string,
    subject: string,
    text: string,
    html: string | null = null,
  ) {
    return await this.transporter().sendMail({
      from: `"${mail.from.name}" <${mail.from.email}>`, // sender address
      replyTo: `"${mail.from.name}" <${mail.from.email}>`,
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html: html || text, // html body
    });
  },

  transporter() {
    aws.config.update({
      accessKeyId: mail.key,
      secretAccessKey: mail.secret,
    });
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: 'us-east-1',
    });

    return nodemailer.createTransport({
      SES: { ses, aws },
    });
  },
};
