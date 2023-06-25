const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const messageOptions = {
    from: "Yelp-Camp <support@yelp-camp.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  transporter.sendMail(messageOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: ", err);
    } else {
      console.log("Email sent successfully: ", info.response);
    }
  });
};

const resetEmail = (resetUrl) => {
  return `You are receiving this auto-generated email because you (or someone else) has requested the reset of a password for your Yelp-Camp account.\n\n
  Please use the following link to reset your password:
  ${resetUrl}. The link will be valid for 15 minutes only.\n\n
  Please disregard this email if you have not made this request. Your password will not be changed.\n\n
  Thanks,
  Yelp-Camp Team`;
};

const confirmationEmail = () => {
  return `This is an auto-generated email to confirm that your password for the Yelp-Camp App has been successfully reset. \n\n
  Thanks,
  Yelp-Camp Team`;
};

module.exports = { sendEmail, resetEmail, confirmationEmail };
