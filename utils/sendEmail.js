const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async ({to, subject, html}) => {
const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

  const nodemailerConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: UKR_NET_EMAIL,
      pass: UKR_NET_PASSWORD,
    },
  };

const transport = nodemailer.createTransport(nodemailerConfig);


  const email = {
    to,
    from: UKR_NET_EMAIL,
    subject,
    html,
  };

  transport
    .sendMail(email)
    .then(() => console.log('email send succsess'))
    .catch(err => console.log('err.message :>> ', err.message));
};

module.exports = sendEmail;

