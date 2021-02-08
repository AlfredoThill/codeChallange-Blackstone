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
 let template; let html;
 switch (kind) {
   case 'sign-in':
    template = templates.confirmation_mail;
    html = template(params);
    break;
   case 'pwd-reset':
    template = templates.reset_mail;
    html = template(params);
    break;
   default:
    html = "<h1>Some html content for the email</h1>";
 }
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
    result = { success: true };
    return result;
    }
  catch (e) {
    console.log('Send Email failed: '+ e);
    result = { success: false, msg: "There's been some error with our mailer service, please try again later.", error: e };
    return result;
  }   
}

module.exports = send;