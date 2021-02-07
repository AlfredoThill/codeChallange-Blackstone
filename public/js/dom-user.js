// ------------ AJAX LOGIN/SIGN IN/STATUS HANDLER -----------------

//1. Check user STATUS
// Here we'll check the current user's session status, '/checkStatus'(c-user@checkStatus)
// gives a response with relevant session paramenters, based in this params we r gonna handle what
// the user can see and we'll prepare several features
let checkStatus; let user_status;
function checkSession(){
    checkStatus = makeAjaxCall("/user/checkStatus","GET"); // promisify Ajax Call, refer to '/public/js/helpers/ajax-helper.js'
    // when the promises is resolved
    checkStatus.then( (resp) => {
        const results = JSON.parse(resp); // parsing json for further use
        user_status = results;
        // Based on the param 'logged' we are gonna find out if the user is logged-in
        // 1.1 - The user is logged-in
        if (results.logged == true) {
                // Since the user is logged we'll show the dashboard and populate
                displayAllBut('logged-template','modal-dashboard');
                handleDashboard(results); // dashboard population
                // Then we are gonna 'prepare' the 'change-password' feature
                prepareForm('change-pwd-form','PUT','/user/pwd-change',pwdChangeThen); // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
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
      // Show welcome msg an prepare dashboard
      displayAllBut('logged-template','modal-welcome');
      handleDashboard(results);
      // 'prepare' the 'change-password' feature
      prepareForm('change-pwd-form','PUT','/user/pwd-change',pwdChangeThen); // PREPARE FORM - BUILDER, refer to '/public/js/helpers/prepare-form.js'
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
// Push Error
function pushError(e) {
    const errorObject = JSON.parse(e.response);
    // make sure the modal is shown
    showModal();
    displayAllBut('errors-template','modal-error');
    document.getElementById('error-url').innerHTML = e.responseURL;
    document.getElementById('error-status').innerHTML = e.status;
    document.getElementById('error-statusText').innerHTML = e.statusText;
    document.getElementById('error-msg').innerHTML = errorObject.message;
    // Show full stack only while in DEV, 'comment' the line below while in production
    document.getElementById('error-stack').innerHTML = e.response;
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
// Handle DELETE Warning.
//      When any action requires user confirmation, usually for 'delete' operations,
//      this modal block('modal-delete-warning') will be filled with the apropiate
//      'form', 'title' and 'content'. Then the modal will be showed prompting the user
//      for confirmation. Since the 'form' to be submited will be built on the spot the
//      function also need the route('call') it'll be refering to and the callback to be executed.
function handleDelete(form,title,content,call,callback){
    // Defining the existing form in the modal, empty by default
    const initialForm = document.getElementById('modal-delete');
    // Filling title and content for the user to read
    const titleWarning = document.getElementById('warning-title');
        titleWarning.innerHTML = title;
    const contentWarning = document.getElementById('warning-content');
        contentWarning.innerHTML = content;
    // Clone the input form and its nodes, then replace the original form
    let clone = form.cloneNode(true);  // The clone doesn't retains its DOM events
        initialForm.replaceWith(clone);
        // Make sure the cloned form display is correct and assing its new 'id'
        clone.style.display = null;
        clone.setAttribute('id','modal-delete');
    // If no 'call'(or 'callback') is feed the delete is a non-ajax form submission
    if (call) {
        // Prepare the form for submition
        prepareForm('modal-delete','DELETE',call,callback);
    }
    // Display the modal
    displayAllBut('logged-template','modal-delete-warning');
    showModal();
}