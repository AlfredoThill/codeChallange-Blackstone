const cache = require('../cache').bring;

let validation = function validate(name,mail,pwd) {
 let error = 'none';
 // Check again input
 const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
 if ( emailRegexp.test(mail) && name != '' && pwd.length > 5 ) {
  // input quality ok, then check for availability
    for (let i = 0 ; i < cache['users'].length ; i++) {
      // email  
        if (mail == cache['users'][i].email) { 
         error = 'Email already in use.'
         break  
        } 
      // name 
       if (name == cache['users'][i].name) { 
         error = 'Name already in use.'
         break  
       }  
    }
 }
 else {
  // input quality bad   
    error = 'Please enter a valid email, a non-blank name and password at least 6 characters long.'
 }
 return error
}

module.exports = validation;