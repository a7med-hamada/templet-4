let username = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');
let registerBtn = document.getElementById('register-btn');
let menuBtn = document.getElementById('menu-btn');
let mobileMenu = document.getElementById('mobile-menu');
let passwordInput = document.getElementById('password');
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
    localStorage.setItem('menuOpen', menuOpen);
});




registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (username.value === '' || email.value === '' || password.value === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill in all fields'
        });
    } else {
        localStorage.setItem('username', username.value);
        localStorage.setItem('email', email.value);
        localStorage.setItem('password', password.value);
        Swal.fire({
            icon: 'success',
            title: 'Registration successful!',
            showConfirmButton: false,
            timer: 1000
        }).then(() => {
            window.location.href = 'login.html';
        });
    }
});


togglePassword.addEventListener('click', () => {
    let type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
    togglePassword.classList.toggle('fa-eye');
});
