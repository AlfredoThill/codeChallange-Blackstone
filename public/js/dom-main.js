// 1. Highlight menu option when page loads reflecting the current view
const current_template = document.querySelector('.view').getAttribute('name');
const menu_items = document.querySelectorAll('#menu > a');
menu_items.forEach( (item) => {
    const item_name = item.getAttribute('name');
    if (current_template == item_name) {
        item.classList.add('active-nav');
    }
});

// 2 . Frontside 'tasks' access handling
// When the user is not logged-in show modal login form on click
const tasks_menu_item = document.querySelector('#menu > a[name="tasks"]');
tasks_menu_item.addEventListener('click', showModal );
// When logged in, remove the listener and set 'href', refer to '/public/js/dom-user.js'
function activateTasks() {
    tasks_menu_item.removeEventListener('click', showModal );
    tasks_menu_item.setAttribute('href','/task/index');
}