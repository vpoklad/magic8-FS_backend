import sgMail from '@sendgrid/mail';
// import nodemailer from "nodemailer";

export class SenderSendGrid {
  async send(message) {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    return sgMail.send({
      ...message,
      from: process.env.SENDER_SENDGRID,
    });
  }
}
