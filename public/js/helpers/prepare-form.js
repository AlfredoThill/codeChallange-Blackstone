// --------------- PREPARE FORM BUILDER --------------
// This function prepares the forms on the model for execution, that is setting the 'subtmit'
// event and associated ajax call, it has 4 inputs ====>
//  inputs:
//      formID => id del formulario,
//      type => [GET,POST,PUT,DELETE],
//      call => the route, ej. '/user/log-in',
//      callback => a binded function that runs when the promise is resolved
function prepareForm(formID,type,call,callback) {
    // Defining form and associated submit 'button'
    const form = document.getElementById(formID);
    const submitBtn = form.querySelector('input[type="submit"]');
    // Adding the event
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Some style on the submit 'button' to 'fake' progress
        submitBtn.disabled = true;
        submitBtn.style.opacity = 0.5;
        // Building the data to append in the call, refer to '/public/js/helpers/ajax-helper.js'
        const data = formData(form);
        const args = encodeData(data);
        // The promise
        let operationAttempt = makeAjaxCall(call,type,args,"application/x-www-form-urlencoded");
          // When its resolved succesfully, bind callback with variables
          operationAttempt.then( callback.bind(null,form) );
          // On error show it to the user
          operationAttempt.catch( (e) => {
              pushError(e);
          })
          // Anyhow, restore style on the submit 'button'
          operationAttempt.finally( () => {
              submitBtn.disabled = false;
              submitBtn.style.opacity = 1;
          })
    })
  }
 
// --------------- PREPARE FILE UPLOAD FORM BUILDER --------------
// Note: won't be needing this on the current proyect but whatever
// maybe u'll enjoy reading the code. =O
function prepareUpload(formID,type,call,callback) {
    // Defining form and associated submit 'button'
    const form = document.getElementById(formID);
    const submitBtn = form.querySelector('input[type="submit"]');
    // Adding the event
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Some style on the submit 'button' to 'fake' progress
        submitBtn.disabled = true;
        submitBtn.style.opacity = 0.5;
        // Using FormData to create key-value pairs encoded like "multipart/form-data"
        const data = new FormData(form);
        // The promise
        let operationAttempt = makeAjaxCall(call,type,data);
          // When its resolved succesfully, bind callback with variables
          operationAttempt.then( callback.bind(null,form) );
          // On error show it to the user
          operationAttempt.catch( (e) => {
              pushError(e);
          })
          // Anyhow, restore style on the submit 'button'
          operationAttempt.finally( () => {
              submitBtn.disabled = false;
              submitBtn.style.opacity = 1;
          })
    })
  }
