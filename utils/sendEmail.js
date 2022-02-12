const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter  = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD
      }
    })

    const message = {
        from: `${process.env.MAIL_TRAP_EMAIL_FROM} ${process.env.MAIL_TRAP_EMAIL_FROM_NAME}`,
        to: options.email,
        subject: options.subject,
        text: options.message
      };

      const info = await transporter.sendMail(message);
      
      console.log('Message sent: %s', info.messageId); 
}


module.exports = sendEmail;