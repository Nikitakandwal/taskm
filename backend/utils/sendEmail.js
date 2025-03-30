

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    auth: {
      user: process.env.MAILJET_API_KEY,  
      pass: process.env.MAILJET_SECRET_KEY  
    }
  });

  const mailOptions = {
    from: 'Your App <bhattn321@gmail.com>', 
    to: options.email,
    subject: options.subject,
    text: options.message, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent via Mailjet!');
  } catch (error) {
    console.error('Mailjet Error:', error.response || error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;

