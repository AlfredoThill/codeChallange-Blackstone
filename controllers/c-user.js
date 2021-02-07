const query = require('../utility/query');
const cache = require('../utility/cache').check;
const encrypt = require('../utility/crypt');
const signUpValidation = require('../utility/validators/signUpvalidation');
const sendEmail = require('../utility/mailer');
const ObjectId = require('mongodb').ObjectID;
// Requiring the model, dunno if im gonna use it yet
const User = require('../models/m-user');

// # I'll be using this to check if the user is logged-in
exports.checkStatus = (req, res, next) => {
    try { 
        let result = new Object(); 
        const id = req.session.userID;
        const name = req.session.name;
        const mail = req.session.email;
        if (id) {
            result['logged'] = true;
            result['id'] = id;
            result['name'] = name;
            result['mail'] = mail;
        }
        else {
            result['logged'] = false;
        }
        res.json(result)
    }
    catch (e) {
        console.log(e)
    } 
};

// # Simple login POST
exports.login = async (req, res, next) => {
    const mail = req.body['login-mail'];
    const pwd = encrypt(req.body['login-pwd']); 
    let find = await query('users','find',{ 'isVerified': true, 'email': mail , 'password': pwd });
    let result = {};
    if (find.length > 0) { 
        // Credentials ok
        req.session.userID = find[0]['_id'];  
        req.session.email = mail;
        req.session.name = find[0].name;
        result = { logged: true, name: find[0].name, userID:  req.session.userID };
    }
    else { 
        // Credentials NOT ok
        let msg;
        let check = await query('users','find',{ 'email': mail });
        if (check.length > 0) {
          if (check[0].isVerified == false) { msg = 'Account pending verification.'}
          else { msg = 'Wrong password.'}
        }
        else { msg = 'Email not registered.'}
        result = { logged: false, msg: msg };
    }
    res.json(result)
};

// # Log Out
exports.out = (req, res, next) => {
    req.session.destroy();
    let backURL = req.header('Referer') || '/' ;
    res.redirect(backURL)
};

// # Sign-in. Validates input, on success saves entry and sends confirmation-email
exports.signIn = async (req, res, next) => {
    const name = req.body['signin-name'];
    const mail = req.body['signin-mail'];
    const pwd = req.body['signin-pwd']; 
    let result = {};
    // Check active users
    const args = ['users','aggregate',[{ $match: { "isVerified": true } },{ $project: { "_id": 0, "name": 1, "email": 1 } }]];
    await cache('users',query,args);
    // Validate new user params
    let err = signUpValidation(name,mail,pwd);
    if (err != 'none') { 
        // Error filling the sign-in form
        result = { success: false, msg: err };
        res.json(result);
    }
    else { 
        // Input OK
        let hash = encrypt(pwd);
        let expiration = new Date();
        expiration.setHours( expiration.getHours() + 1 ); 
        let newdoc = {
            "name": name,
            "email": mail,
            "password": hash,
            "tasks": [],
            "isVerified": false,
            "expire": expiration,
        } 
        // Insert the new entry. Maybe use my brand new user model? Come back later...
        let insert = await query('users','insert', newdoc);
        let link = "http:" + req.headers.host + "/user/confirm" + "?id=" + insert.insertedId + "&token=" + hash; 
        const params = { "name": name, "link": link };
        // Send confirmation email
        await sendEmail(mail,'sign-in',params);
        result = { success: true, title: 'Awaiting Confirmation', msg: 'An email has just been sent to your adress. There you will find a link, click it and you are done!' }
        res.json(result);
    }
};

// # After 'sign-in'the user must confirm it's account or it'll be deleted (by scheduled procedure in mongo)
exports.confirmAccount = async (req, res, next) => {
    // 'verify' the account, unverifed ones are deleted every hour by a trigger on mongo
    // based on their expiration.
    let id = req.query.id;
    let hash = req.query.token;
    let args = {
        "filter": { "_id": new ObjectId(id), "password": hash },
        "update": { $set: { "isVerified": true } },
    };
    await query('users','update',args); // udpate document, 'verify' account
    req.session.destroy();
    res.redirect('/')
};

// # Reset password functionality pointing to the user's email
exports.resetPwd = async (req, res, next) => {
    const mail = req.body['reset-mail'];
    let result = {};
    let check = await query('users','find',{ 'isVerified': true, 'email': mail });
    if (check.length > 0) {
        let id = check[0]['_id'];
        let name = check[0].name;
        let rnd = Math.floor(Math.random() * (900000)) + 100000;
        let hash = encrypt(rnd.toString());
        let link = "http:" + req.headers.host + "/users/confirm-reset" + "?id=" + id + "&token=" + hash;
        result = { success: true, title: 'Reset Password Request', msg: "A mail has been sent to the indicated account, there is no change in your password yet. You'll have to confirm the operation and then you will get a new random generated password." };
        res.json(result); 
        const params = { "name": name, "link": link, "pwd": rnd };
        await sendEmail(mail,'pwd-reset',params);
    }
    else {
        result = { success: false, msg: 'The indicated email is not registered.' };
        res.json(result);
    }
};

// # After requesting a password reset the user still has to validate it on it's email
exports.confirmReset = async (req, res, next) => {
    // Pending: add 'expiration' to this feature
    let id = req.query.id;
    let hash = req.query.token;
    try {
        let args = {
        "filter": { "_id": new ObjectId(id) },
        "update": { $set: { "password": hash } },
        };
        await query('users','update',args); // udpate document
    }
    finally { 
        req.session.destroy();
        res.redirect('/')
    } 
};

// # Change password feature
exports.pwdChange = async (req, res, next) => {
    const userID = req.session.userID;
    const oldPWD = encrypt(req.body['old-pwd']);
    const newPWD = encrypt(req.body['new-pwd']);
    let result = {};
    // Check for old pwd
    let check = await query('users','find',{ 'isVerified': true, '_id': new ObjectId(userID), 'password': oldPWD });
    if (check.length > 0) {
      // Pwd matchs   
      let args = {
        "filter": { "_id": new ObjectId(userID) },
        "update": { $set: { "password": newPWD } },
        };
      // Update with new pwd  
      await query('users','update',args);
      result = { success: true, title: 'Password Changed', msg: "Your new password is set, this page will auto-reload shortly, login with your new credential." };
      req.session.destroy();
      res.json(result); 
    }
    else {
      result = { success: false, msg: 'The password does not match.' };
      res.json(result);
    }
};