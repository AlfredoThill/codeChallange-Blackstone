const nodemailer = require('nodemailer');
const templates = require('./templating/email');

// Setting DB credentials as env variables, for this app we are using
// a collection and a single user. If we are deploying on Heroku we
// gonna set env variables there and drop dotenv. 
require('dotenv').config();
const mail_user = process.env.MAILER_USER;
const mail_pwd = process.env.MAILER_PASS;

// # This helper is used to send mails, had a gmail account configured for testing
//   on another proyect. I'll be using it instead of mail trap so you can really get
//   get some mails.
let send = async function sendMail(mail,kind,params) {
 let template;
 if (kind == 'sign-in') {
  template = templates.confirmation_mail
 }
 else if (kind == 'pwd-reset') { 
  template = templates.reset_mail 
 }
 let html = template(params);
  try {  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mail_user,
            pass: mail_pwd
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const mailOptions = { 
        from: 'no-reply@codechallange.com', 
        to: mail, 
        subject: 'Code Challange - Account Verification', 
        html: html,
        };
    await transporter.sendMail(mailOptions);
    }
  catch (e) {
    // Dont judge for this non-catches... =)
    console.log('Send Email failed: '+ e)
  }   
}

module.exports = send;