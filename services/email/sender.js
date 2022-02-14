import sgMail from '@sendgrid/mail';

export class SenderSendGrid {
  async send(message) {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    return sgMail.send({
      ...message,
      from: process.env.SENDER_SENDGRID,
    });
  }
}
