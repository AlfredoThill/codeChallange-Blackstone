// ### ---------------- Modal stuff  ---------------- ###
// # Defining variables, pretty straightforward
// --- General ---
const myModal = document.getElementById("myModal");
const modal_display_button = document.getElementById('show-modal');
const modal_close_buttons =  document.querySelectorAll('.close[name=close-modal');
// --- Login block ---
const login_template = document.getElementById("login-template");
const login_show_signin = document.getElementById('show-signin');
const login_reset_pwd= document.getElementById('reset-password');
const login_content = document.getElementById('login-content');
const login_signin = document.getElementById('signin-content');
const login_forgot = document.getElementById('forgot-content');
// --- Logged block ---
const logged_welcome = document.getElementById('modal-welcome');
const logged_dashboard = document.getElementById('modal-dashboard');
const logged_acknowledge = document.getElementById('acknowledge-login');
const logged_change_pwd = document.getElementById('change-pwd-modal');
const logged_show_change_pwd = document.getElementById('show-change-pwd');

// # Simple listeners

// --- General ---
// Show modal, when the users clicks the 'login/register' red button on the top navbar
modal_display_button.addEventListener('click', showModal);
// Hide modal, when the user click's the "X" on the left corner of a modal template
modal_close_buttons.forEach( (element) => {
  element.addEventListener('click', hideModal );
})

// --- Login block ---
// Swicth betwen [login, sign in, reset pwd]
if (login_template) {
 login_show_signin.addEventListener('click', () => {
  login_content.style.display = 'none';
  login_signin.style.display = null;
 })
 login_reset_pwd.addEventListener('click', () => {
  login_content.style.display = 'none';
  login_forgot.style.display = null;
 })
}

// --- Logged block ---
// After the user logs in there's a welcome msg, when the user clicks on the button inside the msg
logged_acknowledge.addEventListener('click', () => {
  myModal.style.display = 'none';
  logged_welcome.style.display = 'none';
  logged_dashboard.style.display = null;
})

// Change password, when the logged users wants to change it's pass, switch blocks
logged_show_change_pwd.addEventListener('click', () => {
  logged_dashboard.style.display = 'none';
  logged_show_change_pwd.style.display = null;
})

// ### -------------- Helpers ---------------- ###
// 1. Show Modal
function showModal() { myModal.style.display = 'block'; }

// 2. Hide/show modal-templates and modal-blocks
function hideModal() {
    // Hide the modal
    myModal.style.display = 'none';
    // Find and reset all forms in the modal
    const forms = myModal.querySelectorAll('form');
    forms.forEach( (form) => {
        form.reset();
    });
    // Go back to default display of blocks
    const blocks = myModal.querySelectorAll('.modal-content > .column');
    blocks.forEach( (block) => {
        const id = block.getAttribute('id');
        const IdstoShow = ['login-content','modal-dashboard'];
        if (IdstoShow.includes(id)) {
            block.style.display = null;
        }
        else {
            block.style.display = 'none';
        }
    });
}

//3.  HIDE all in 'modal' but 'toShow' argument
function displayAllBut(modalID,toShow) {
    const modals = myModal.querySelectorAll('.modal-content');
    // Show-hide modal containers
    for (let i = 0; i < modals.length; i++) {
      let modal = modals[i];
      if (modal.getAttribute('id') == modalID) {
          modal.style.display = null
      }
      else {
          modal.style.display = 'none'
      }
    }
    const blocks = document.querySelectorAll('#'+modalID+' > div.column');
    // Show-hide modal blocks
    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      if (block.getAttribute('id') == toShow) {
          block.style.display = null
      }
      else {
          block.style.display = 'none'
      }
    }
}