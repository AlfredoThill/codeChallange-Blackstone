const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Confirmation email template
const mailPath = path.join(__dirname, '..', '..', 'views', 'emails','confirm-email.hbs');
const mail = fs.readFileSync(mailPath, 'utf8');
const mail_template = handlebars.compile(mail);

// Reset email template
const resetPath = path.join(__dirname, '..', '..', 'views', 'emails','reset-email.hbs');
const reset = fs.readFileSync(resetPath, 'utf8');
const reset_template = handlebars.compile(reset);

module.exports = {
    confirmation_mail: mail_template,
    reset_mail: reset_template
}