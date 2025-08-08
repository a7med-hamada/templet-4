let username = document.getElementById('username');
let password = document.getElementById('password');
let loginBtn = document.getElementById('login-btn');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let togglePassword = document.getElementById('togglePassword');
let menuOpen = false;

        
menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
    mobileMenu.classList.remove('max-h-0', 'opacity-0', 'translate-y-[-30px]');
    mobileMenu.classList.add('max-h-[500px]', 'opacity-100', 'translate-y-0');
    } else {
    mobileMenu.classList.remove('max-h-[500px]', 'opacity-100', 'translate-y-0');
    mobileMenu.classList.add('max-h-0', 'opacity-0', 'translate-y-[-30px]');
    }
    menuBtn.classList.toggle('open', menuOpen);
});



let getUsername = localStorage.getItem('username');
let getPassword = localStorage.getItem('password');


loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (username.value == '' || password.value == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill in all fields',
            timer: 1000,
            timerProgressBar: true
        });
    } else {
        if (getUsername.trim() === username.value.trim() && getPassword === password.value) {
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Login successful!',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    window.location.href = 'shop.html';
                });
                
            }, timeout = 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: 'Invalid username or password',
                timer: 1000,
                timerProgressBar: true
            });
        }
    }
});



togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
    togglePassword.classList.toggle('fa-eye');
});