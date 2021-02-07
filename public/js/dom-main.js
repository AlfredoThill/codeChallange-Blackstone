// 1. Highlight menu option when page loads reflecting the current view
const current_template = document.querySelector('.view').getAttribute('name');
const menu_items = document.querySelectorAll('#menu > a');
menu_items.forEach( (item) => {
    const item_name = item.getAttribute('name');
    if (current_template == item_name) {
        item.classList.add('active-nav');
    }
});
// 2 . If user is logged-in show the 'Tasks' item on the menu
checkStatus.then( (resp) => {
    const results = JSON.parse(resp);
    if (results.logged == true) {
        console.log("hi")
    }
});