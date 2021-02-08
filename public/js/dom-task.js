//1. ### Populate 'tasks-list' ###
//   Straight forward xhr call, then push html into div
function push_taskList() {
    const call = "/task/list";
    taskList = makeAjaxCall(call,"GET");
    taskList.then( (resp) => {
        document.getElementById('task-tables').innerHTML = resp;
        // Assing actions on table buttons
        setTasks_inTable();
    })
    taskList.catch( (e) => {
        pushError(e);
    })
    return taskList;
}
// Call 'pushComments' inmediately
let push_tasks = push_taskList();

//2. ### Set actions ###
const add_button = document.getElementById("add-task");

// Since there's only 1 of these and it's outside the component 
// let's just assing the event
add_button.addEventListener('click', setTaskAction.bind(add_button) );

// There are many of these and they are loaded along side the
// component, 'tasks-list', so we gotta refresh these listeners
// with the component
function setTasks_inTable() {
    const task_edit_buttons = document.querySelectorAll('.task-action[name="edit"]');
    const task_erase_buttons = document.querySelectorAll('.task-action[name="erase"]');
    const task_tick_buttons = document.querySelectorAll('.task-action[name="tick"]');
    task_edit_buttons.forEach( (button) => { button.addEventListener('click', setTaskAction.bind(button) )});
    task_erase_buttons.forEach( (button) => { button.addEventListener('click', setTaskAction.bind(button) )});
    // With the 'tick' actions we don't really need user confirmation, when the users clicks the icon 
    // we are gonna set the task as commpleted. So, there's no need to build a form or anything, let's just
    // make an ajax call faking the inputs
    task_tick_buttons.forEach( (button) => {
      button.addEventListener('click', () => {
        let data = new Object(); 
        let type = "PUT"; 
        let call= '/task/mark';
        const data_reference = button.closest('[name="data-reference"]');
        const id = data_reference.querySelector('[name="title"]').getAttribute('taskID');
        data['id'] = id;
        data['completed'] = 1;
        const args = encodeData(data);
        // The promise
        let operationAttempt = makeAjaxCall(call,type,args,"application/x-www-form-urlencoded");
          // When its resolved succesfully, bind callback with variables
          operationAttempt.then( () => {
            // Refresh the component
            let push_tasks = push_taskList();
            // Reload tables actions
            push_tasks.then( () => { setTasks_inTable() });
          });
          operationAttempt.catch( (e) => {
              pushError(e);
          })
      });
    });
}

// The listener to assing the action depending on the 'button'
function setTaskAction() {
    const type = this.getAttribute('name');
    // Fill the form in the modal
    const form_id = 'variable-form';
    const form = document.getElementById(form_id);
    // This calls to a functions that makes the form into the modal depending on the button clicked. It returns a data object.
    let form_maker = make_task_form(this,type);
    // "Remove" previous Listeners, actually replacing the submit button with its clone
    let clone = form.cloneNode(true);                            // The clone doesn't retains its DOM events
    form.replaceWith(clone);                                     // Replacing..
    // Prepare it as usual, type of call(GET,POST,etc..) 
    prepareForm(form_id,form_maker["type"],form_maker["call"],taskForm_then);
    // Finally show modal with proper block
    myModal.style.display = 'block';
    displayAllBut('logged-template','modal-form');
}

//3. ### Form makers  ###
//- Building the forms into the modal using JS depending on the clicked button
//  Note: this could have been done in many ways, for example: 
//      - declaring the a single form for each action in html and feeding the input
//        depending on the clicked button.
//      - declaring multiple forms for each action, 1 for every item, so some of it's
//        inputs would be static.
//  I went for this trying to show off some good JS, although I'm not sure it's the 
//  optimal choice and I'm pretty sure it ain't the fastest.
function make_task_form(button,type) {
    // Defining variables
    const parent = document.getElementById('modal-form');          //  the parent form
    const title = parent.querySelector('.modal-title');            //  the title in the block
    const content = parent.querySelector('#variable-form-content');//  the content of the form
    const msg = parent.querySelector('.modal-message');            //  the msg in the block
    // Clear the content, just in case
    resetVariableForm();
    // Creating an empty Object
    let data = new Object();
    let task_title_input,title_label,task_description_input,description_label,task_dueDate_input,dueDate_label,
        data_reference,title_ref,description_ref,completed_ref,task_id_input,task_completed_input,completed_label
    switch (type) {
        // Add a Task
        case 'add':
          // - Building elements
          // Title  
          task_title_input = document.createElement("INPUT");
            task_title_input.setAttribute("type", "text");
            task_title_input.setAttribute("name", "title");
            task_title_input.setAttribute("maxlength", "30");
            task_title_input.setAttribute("required","");
          title_label = document.createElement("LABEL");
            title_label.innerHTML = "Title";  
          // Description  
          task_description_input = document.createElement("TEXTAREA");
            task_description_input.setAttribute("name", "description");
            task_description_input.setAttribute("rows", "5");
            task_description_input.setAttribute("maxlength", "150");
            task_description_input.setAttribute("required","");
          description_label = document.createElement("LABEL");
            description_label.innerHTML = "Description";   
          // Due Date  
          task_dueDate_input = document.createElement("INPUT");
            task_dueDate_input.setAttribute("type", "date");
            task_dueDate_input.setAttribute("name", "due-date");
            let today = currentISOdate();
            task_dueDate_input.setAttribute("min", today);
            task_dueDate_input.setAttribute("required","");
          dueDate_label = document.createElement("LABEL");
            dueDate_label.innerHTML = "Due Date";   
          // - Populating the form's content
          content.append(title_label);
          content.append(task_title_input);
          content.append(description_label);
          content.append(task_description_input);
          content.append(dueDate_label);
          content.append(task_dueDate_input);
          title.innerHTML = 'Add a Task'
          msg.innerHTML = 'You are about to add a new task.';
          // - Defining the data to return
          data['type'] = 'POST';
          data['call'] = '/task/create';
          break;
        case 'erase':
          // - Reference   
          data_reference = button.closest('[name="data-reference"]');
          title_ref = data_reference.querySelector('[name="title"]');
          // - Building elements, only needed task 'id'
          task_id_input = document.createElement("INPUT");
            task_id_input.setAttribute("type", "hidden");
            task_id_input.setAttribute("name", "id");
            task_id_input.setAttribute("value", title_ref.getAttribute('taskID'));
            task_id_input.setAttribute("required","");
          // - Populating the form's content  
          content.append(task_id_input);  
          title.innerHTML = 'Warning!'  
          msg.innerHTML = 'You are about to delete the task titled "' + title_ref.innerHTML + '", this action is permanent. Are you sure?';
          // - Defining the data to return
          data['type'] = 'PUT';
          data['call'] = '/task/destroy';
          break;
        case 'edit':     
            data_reference = button.closest('[name="data-reference"]');
            // - References
            title_ref = data_reference.querySelector('[name="title"]');
            description_ref = data_reference.querySelector('[name="description"]');
            // - Building elements
            // id
            task_id_input = document.createElement("INPUT");
                task_id_input.setAttribute("type", "hidden");
                task_id_input.setAttribute("name", "id");
                task_id_input.setAttribute("value", title_ref.getAttribute('taskID'));
                task_id_input.setAttribute("required","");
            // Title
            task_title_input = document.createElement("INPUT");
                task_title_input.setAttribute("type", "text");
                task_title_input.setAttribute("name", "title");
                task_title_input.setAttribute("maxlength", "30");
                task_title_input.setAttribute("value", title_ref.innerHTML);
                task_title_input.setAttribute("required","");
            title_label = document.createElement("LABEL");
                title_label.innerHTML = "Title";  
            // Description    
            task_description_input = document.createElement("TEXTAREA");
                task_description_input.setAttribute("name", "description");
                task_description_input.setAttribute("rows", "5");
                task_description_input.setAttribute("maxlength", "150");
                task_description_input.value = description_ref.innerHTML;
                task_description_input.setAttribute("required","");
            description_label = document.createElement("LABEL");
                description_label.innerHTML = "Description";   
            // Completed    
            task_completed_input = document.createElement("SELECT");
                task_completed_input.setAttribute("name", "completed");
                task_completed_input.setAttribute("required", '');
                let option1 = document.createElement("option");
                    option1.text = "No";
                    option1.value = 0;
                task_completed_input.add(option1);
                let option2 = document.createElement("option");
                    option2.text = "Yes";
                    option2.value = 1;
                task_completed_input.add(option2);
                let option3 = document.createElement("option");
                    option3.text = "Select an option.";
                    option3.setAttribute("disabled",'');
                    option3.setAttribute("selected",'');
                    option3.setAttribute("hidden",'');
                task_completed_input.add(option3);
            completed_label = document.createElement("LABEL");
                completed_label.innerHTML = "Completed";    
            // - Populating the form's content
            content.append(task_id_input); 
            content.append(title_label);
            content.append(task_title_input);
            content.append(description_label);
            content.append(task_description_input);
            content.append(completed_label);
            content.append(task_completed_input);
            title.innerHTML = 'Edit a Task'
            msg.innerHTML = 'You are about to edit a task.';
            // - Defining the data to return
            data['type'] = 'PUT';
            data['call'] = '/task/update';
          break;
        default:
          console.log('Missing action definer in html tag => (.admin-action-img[name])');
          break;
    }
    return data;
}

//4.  ### Callback ###
function taskForm_then(form,resp) {
    const results = JSON.parse(resp);
    // If operation was a success
    if (results.success == true) {
        // Show msg asserting success
        handleMsg(results);
        // Close the modal in 1 sec
        setTimeout(function(){ 
          hideModal() }, 2000);  
        // Refresh vendors_states
        let push_tasks = push_taskList();
        // Reload tables actions
        push_tasks.then( () => {
          // Assing actions on table buttons
          setTasks_inTable(); 
        })
    }
    // change attemp failed because of validation
    else if (results.success == false) {
        // reset form and show user its mistake
        form.reset();
        form.querySelector('.alertForm').style.display = null;
        form.querySelector('span[name=modal-alert]').innerHTML = results.msg;
    }
  }

//5.  ### Helpers ###
// Reset admin variable form, just empty html content
function resetVariableForm() {
    const parent = document.getElementById('modal-form');           //  the parent form
    const title = parent.querySelector('.modal-title');             //  the title in the block
    const content = parent.querySelector('#variable-form-content'); //  the content of the form
    const msg = parent.querySelector('.modal-message');             //  the msg in the block
    const alert = parent.querySelector('.alertForm');
    const alert_content = alert.querySelector('.closebtn');
    title.innerHTML = '';
    content.innerHTML = '';
    msg.innerHTML = '';
    alert.style.display = "none";
    alert_content.innerHTML = '';
};
// Current date
function currentISOdate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //As January is 0.
    let yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return (yyyy + '-' + mm + '-' + dd);
};