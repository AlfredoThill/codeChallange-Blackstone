// ------------ AJAX LOGIN/SIGN IN/STATUS HANDLER -----------------

//1. Check user STATUS
// Here we'll check the current user's session status, '/checkStatus'(c-user@checkStatus)
// gives a response with relevant session paramenters, based in this params we r gonna handle what
// the user can see and we'll prepare several features
let checkStatus;
function checkSession(){
    checkStatus = makeAjaxCall("/user/checkStatus","GET"); // promisify Ajax Call, refer to '/public/js/helpers/ajax-helper.js'
    // when the promises is resolved
    checkStatus.then( (resp) => {
        const results = JSON.parse(resp);
        // Based on the param 'logged' we are gonna find out if the user is logged-in
        // 1.1 - The user is logged-in
        if (results.logged == true) {
                // Since this event, when the users logs in, could result in many actions
                // we are gonna condense them in the following function, for clarity's sake.  
                cascadeLogin(results,'modal-dashboard');
        }
        // 1.2 - The user is NOT logged-in
        else if (results.logged == false) {
                // Since the user is not logged we'll leave the modal view at its default
                // Then we are gonna 'prepare' all features
                prepareForm('login-form','POST','/user/login',loginThen);              // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
                prepareForm('signin-form','POST','/user/sign',singInThen);             // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
                prepareForm('reset-form','POST','/user/reset-pwd',pwdResetThen);       // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
                if (results.title) {
                    // When the user is not logged-in but the session has a pending msg, we are gonna show it
                    // The message is passed in the session and then destroyed. An example of this functionality
                    // is when the user creates and account: it's gonna recieve an email with a link to activate
                    // the account, when the page is loaded and all has gona well there will be a msg to confirm
                    // its action.
                    handleAwaitMsg(results);
                }
        }
    })
    // when there's an error in the resolution
    checkStatus.catch( (e) => {
        // log error and show error to user in a nice way, hopefully
        pushError(e);
    })
    return checkStatus;
}
// Call it inmediately
checkStatus = checkSession();

//2. DEFINING CALLBACKS
// Prepare Login 'THEN' callback
function loginThen(form,resp) {
  const results = JSON.parse(resp);
  // login succesful
  if (results.logged == true) {
      // Since this event, when the users logs in, could result in many actions
      // we are gonna condense them in the following function, for clarity's sake.  
      cascadeLogin(results,'modal-welcome');
  }
  // login failed beacuse of validation
  else if (results.logged == false) {
    // reset form and show user its mistake
    if(results.msg === 'Wrong password.'){
      document.getElementById('login-pwd').value = '';
    } else {  
      form.reset();
    }
    form.querySelector('.alertForm').style.display = null;
    form.querySelector('span[name=modal-alert]').innerHTML = results.msg;
  }
}
// Prepare Sign in 'THEN' callback
function singInThen(form,resp) {
  const results = JSON.parse(resp);
  // sign-in attemp succesful
  if (results.success == true) {
      // Show msg asserting success
      handleAwaitMsg(results);
  }
  // sign-in failed beacuse of validation
  else if (results.success == false) {
      // reset form and show user its mistake
      form.reset();
      form.querySelector('.alertForm').style.display = null;
      form.querySelector('span[name=modal-alert]').innerHTML = results.msg;
  }
}
// Prepare Pwd Reset 'THEN' callback
function pwdResetThen(form,resp) {
  const results = JSON.parse(resp);
  // reset attemp succesful
  if (results.success == true) {
      // Show msg asserting success
      handleAwaitMsg(results);
  }
  // reset failed because of validation
  else if (results.success == false) {
      // reset form and show user its mistake
      form.reset();
      form.querySelector('.alertForm').style.display = null;
      form.querySelector('span[name=modal-alert]').innerHTML = results.msg;
  }
}
// Prepare pwd Change 'THEN' callback
function pwdChangeThen(form,resp) {
  const results = JSON.parse(resp);
  // change attemp succesful
  if (results.success == true) {
      // Show msg asserting success and reload page in 10 secs
      handleMsg(results);
      setTimeout(function () { location.reload() }, 10000);
  }
  // change attemp failed because of validation
  else if (results.success == false) {
      // reset form and show user its mistake
      form.reset();
      form.querySelector('.alertForm').style.display = null;
      form.querySelector('span[name=modal-alert]').innerHTML = results.msg;
  }
}

//3. Helpers Functions
// 'loginThen' cascade, run when 'login' was succesful
function cascadeLogin(results,block){
    // Show welcome msg an prepare dashboard
    displayAllBut('logged-template',block);
    handleDashboard(results);
    // 'prepare' the 'change-password' feature
    prepareForm('change-pwd-form','PUT','/user/pwd-change',pwdChangeThen); // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
    // Frontside 'tasks' access handling, refer to '/public/js/dom.main.js'
    activateTasks();
}
// Push Error
function pushError(e) {
    // make sure the modal is shown
    showModal();
    displayAllBut('errors-template','modal-error');
    document.getElementById('error-msg').innerHTML = e.message;
    document.getElementById('error-status').innerHTML = e.status;
    document.getElementById('error-stack').innerHTML = e;
    setTimeout(function () { location.reload() }, 10000);
}
// Populate dashboard
function handleDashboard(obj) {
    document.getElementById('show-modal').innerHTML = obj.name;
    document.getElementsByName('modal-user-name').forEach( (element) => {
      element.innerHTML = obj.name;
    })
  }
// Handle MSG
function handleMsg(obj) {
    const modalMSG = document.getElementById('modal-msg');
    modalMSG.querySelector('#msg-title').innerHTML = obj.title;
    modalMSG.querySelector('#msg-content').innerHTML = obj.msg;
    displayAllBut('logged-template','modal-msg');
}
// Handle AWAIT-MSG
function handleAwaitMsg(obj) {
    // make sure the modal is shown, in case of 'pending_msg', redundant
    showModal();
    const modalMSG = document.getElementById('await-msg');
    displayAllBut('login-template','await-msg');
    modalMSG.querySelector('span[name="msg-title"]').innerHTML = obj.title;
    modalMSG.querySelector('span[name="msg-content"]').innerHTML = obj.msg;
}