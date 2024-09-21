import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

interface MailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}
const sendEmail = async (options: MailOptions) => {
  // Initialize mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'gymFusion',
      link: 'https://freeapi.app',
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  // Create a nodemailer transporter instance which is responsible to send a mail
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mail: nodemailer.SendMailOptions = {
    from: process.env.SENDER_MAIL,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(
      'Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file'
    );
    console.log('Error: ', error);
  }
};

const emailVerificationMailgenContent = (
  name: string,
  verificationUrl: string
): Mailgen.Content => {
  return {
    body: {
      name: name,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          'To verify your email please click on the following button:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Verify your email',
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (
  name: string,
  passwordResetUrl: string
): Mailgen.Content => {
  return {
    body: {
      name: name,
      intro: 'We got a request to reset the password of your account',
      action: {
        instructions:
          'To reset your password click on the following button or link:',
        button: {
          color: '#1F3A5F',
          text: 'Reset password',
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
