import Mailgen from 'mailgen';

export default class EmailService {
  constructor(environment, sender) {
    this.sender = sender;
    switch (environment) {
      case 'development':
        this.link = 'http://localhost:5000';
        break;
      case 'test':
        this.link = 'http://localhost:5000';
        break;
      case 'production':
        this.link = 'https://kapusta-magic8.herokuapp.com';
        break;
      default:
        this.link = 'http://localhost:5000';
    }
  }

  createEmailTemplate(username, verificationToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Kapu$ta',
        link: this.link,
      },
    });

    const email = {
      body: {
        name: username,
        intro: "Welcome! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Kapu$ta, please click here:',
          button: {
            color: '#22BC66', // optional color of button
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Don't reply to this email, we are just juniors and don't know nothing :)",
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, username, verificationToken) {
    const emailBody = this.createEmailTemplate(username, verificationToken);
    const message = {
      to: email,
      subject: 'Verify email',
      html: emailBody,
    };
    try {
      const result = await this.sender.send(message);
      console.log(result);
      return true;
    } catch (error) {
      console.error('error:', error.message);
      return false;
    }
  }
}
