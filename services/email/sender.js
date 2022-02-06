import sgMail from "@sendgrid/mail";
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
// export class SenderNodemailer {
//   async send(message) {
//     const config = {
//       host: "smtp.meta.ua",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.USER_NODEMAILER,
//         pass: process.env.PASSWORD_USER_NODEMAILER,
//       },
//     };
//     const transporter = nodemailer.createTransport(config);
//     return await transporter.sendMail({
//       ...message,
//       from: process.env.USER_NODEMAILER,
//       // to: "viktor.chernysh.work@gmail.com",
//     });
//   }
// }
