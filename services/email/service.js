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

  createEmailTemplate(verificationToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Kapu$ta',
        link: this.link,
      },
    });

    const email = {
      body: {
        // name: 'користувач додатку Kapu$ta',
        intro: 'Вітаємо! Раді вас бачити!',
        action: {
          instructions:
            'Щоб почати користуватися сервісом Kapu$ta, натисніть на кнопку:',
          button: {
            color: '#FF751D',
            text: 'Підтвердити вашу пошту',
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
        outro: `Або скопіюйте це посилання в рядок браузера: ${this.link}/api/users/verify/${verificationToken}`,
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, verificationToken) {
    const emailBody = this.createEmailTemplate(verificationToken);
    const message = {
      to: email,
      subject: 'Підтвердження пошти',
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
