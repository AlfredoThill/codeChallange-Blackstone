/* Load me if AJAX is involved, boiiiiiiii */
//. AJAX BUILDER, self-explanatory, build ajax as promise. Receives 4 inputs.
//  inputs:
//      url => the route, ej. '/user/log-in',
//      methodType => [GET,POST,PUT,DELETE],
//      data => data to be appended,
//      contentType => only when data is sended, "application/x-www-form-urlencoded" unless files are
//                     being send, should be "multipart/form-data" BUT said header need further paramaters
//                     so when files are sended we'll leave this param 'null' and use the native helper
//                     "FormData" which encodes the key-value pairs like "multipart/form-data" so the browser
//                     will automatically assing the content-type to "multipart/form-data" and its params
function makeAjaxCall(url, methodType, data, contentType){
    // Make the promise
    let promiseObj = new Promise(function(resolve, reject){
       // Make the XMLreq, the ajax call
       const xhr = new XMLHttpRequest();
       xhr.open(methodType, url, true);
       // if there's data to append then set headers
       if (data) {
        // Unless specified we'll let the browser guess the content-type
        if (contentType) {
            xhr.setRequestHeader("Content-type", contentType);
        }
        xhr.send(data);
       }
       // no data sended, just send request
       else {
        xhr.send();
       }
       // 'Listeing state changes of the call
       xhr.onreadystatechange = function(){
        // readyState = 4 means 'request finished and response is ready'
        if (xhr.readyState === 4){
            // http status = 200 means 'OK'
            if (xhr.status === 200){
                let resp = xhr.responseText;
                // Resolve the promise and send response text
                resolve(resp);
            } else { // xhr failed
                // Reject the promise and send the full request
                reject(xhr);
            }
        } else {
            // xhr processing going on, status other than 4:
                // 0: request not initialized
                // 1: server connection established
                // 2: request received
                // 3: processing request
        }
       }
    // request sent succesfully!
   });
   return promiseObj;
  }
  //. AJAX JSON ENCODER, needed to append data to the calls
  function encodeData(data) {
    let urlEncodedDataPairs = [];
    let name;
    // Turn the data object into an array of URL-encoded key/value pairs.
    for( name in data ) {
    urlEncodedDataPairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( data[name] ) );
    }
    // Combine the pairs into a single string and replace all %-encoded spaces to the '+' character; matches the behaviour of browser form submissions.
    let urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
    return urlEncodedData
  }
  //. BUILD FORM DATA, getting the FORM input into a nice Object to feed the encoder
  function formData(form) {
   const elements = form.elements;
   let data = new Object();
   for (let i = 0; i < elements.length; i++) {
     let element = elements[i];
     data[element.name] = element.value;
   }
   return data
  }