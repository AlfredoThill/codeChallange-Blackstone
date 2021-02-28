// 1. Defining a global variable to track app state
const app_state = {
    main_content: null,
    logged: false,
    userID: null
};
// Using a proxy to intercept changes on app_state 
function watchPropsOn(app_state) {
  return new Proxy(app_state, {
    get(target, propKey, receiver) {
      console.log('get', propKey);
      return app_state[propKey];
    },
    set(target, propKey, value, receiver) {
      console.log('set', propKey, value);
      target[propKey] = value;     
      switch (propKey) {
          case "main_content":
            handleContent(value)
            handleMenu(value)
            break;
      }
      return true;
    }
  });
}
let app_stateProxy = watchPropsOn(app_state);

// 2. Highlight menu option when page loads reflecting the current view
function handleMenu(main_content){
    const menu_items = document.querySelectorAll('#menu > a');
    for (let i = 0; i < menu_items.length; i++){
        const item_name = menu_items[i].getAttribute('name');
        if (main_content == item_name) {
          menu_items[i].classList.add('active-nav');
        }
        else {
          menu_items[i].classList.remove('active-nav');
        } 
    }  
}
// 3. Highlight menu option when page loads reflecting the current view
function handleContent(main_content){
    const main = document.querySelector("main");
    let old_content = main.firstElementChild;
    if (app_state['main_content'] != old_content.nodeName.toLowerCase()){
      let old_content = main.firstElementChild;
      let new_content= document.createElement(main_content);
      old_content.replaceWith(new_content);
    }
}

// 4. Menu items listeners
// # Tasks
const tasks_menu_item = document.querySelector('#menu > a[name="x-tasks"]');
tasks_menu_item.addEventListener('click', showModal );
function activateTasks() { // When logged in, remove the listener and set 'href', refer to '/public/js/dom-user.js'
    tasks_menu_item.removeEventListener('click', showModal );
    tasks_menu_item.addEventListener('click', set_AppState_MainContent);
}
// # About
const about_menu_item = document.querySelector('#menu > a[name="x-about"]');
about_menu_item.addEventListener('click', set_AppState_MainContent);
// # Home
const home_menu_item = document.querySelector('#menu > a[name="x-home"]');
home_menu_item.addEventListener('click', set_AppState_MainContent);

// Listener to swap main content
function set_AppState_MainContent(e) {
  let target = e.currentTarget;
  let component =  target.getAttribute('name');
  app_stateProxy.main_content = component;
}