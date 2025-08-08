const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
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