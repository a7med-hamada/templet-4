document.addEventListener('DOMContentLoaded', () => {

    const elements = {
        menuBtn: document.getElementById('menu-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        logoutBtnDesktop: document.getElementById('logout-btn-desktop'),
        logoutBtnMobile: document.getElementById('logout-btn-mobile'),
        scrollBtn: document.getElementById('scrollToTopBtn'),
        cartIcon: document.getElementById('cart'),
        cartCount: document.getElementById('cart-count'),
        searchInput: document.getElementById('search-input'),
        noResultsMessage: document.getElementById('no-results'),
        productSections: document.querySelectorAll('.items > div'),
        products: document.getElementById('products'),
        btnFavorite: document.querySelector('.btn-favorite'),
        reveals: document.querySelectorAll('.reveal'),
        nameElements: document.querySelectorAll('#username-mobile, #username-desktop')
    };


    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let menuOpen = false;


    const wishlistCount = document.createElement('span');
    wishlistCount.id = 'wishlist-count';
    wishlistCount.className = 'text-white text-sm bg-red-500 rounded-full px-2 absolute -top-2 -right-3';
    wishlistCount.textContent = '0';
    elements.cartIcon.parentElement.insertAdjacentElement('afterend', wishlistCount);

    function toggleMobileMenu() {
        menuOpen = !menuOpen;
        elements.mobileMenu.classList.toggle('max-h-0', !menuOpen);
        elements.mobileMenu.classList.toggle('opacity-0', !menuOpen);
        elements.mobileMenu.classList.toggle('translate-y-[-30px]', !menuOpen);
        elements.mobileMenu.classList.toggle('max-h-[500px]', menuOpen);
        elements.mobileMenu.classList.toggle('opacity-100', menuOpen);
        elements.mobileMenu.classList.toggle('translate-y-0', menuOpen);
        elements.menuBtn.classList.toggle('open', menuOpen);
    }


    function displayUsername() {
        const storedUsername = localStorage.getItem('username');
        elements.nameElements.forEach(el => {
            if (storedUsername) {
                el.textContent = storedUsername;
                el.classList.add('text-white', 'text-lg', 'font-semibold');
                el.style.textTransform = 'uppercase';
            }
        });
    }


    function handleLogout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('email');
        window.location.href = 'index.html';
    }


    function handleScroll() {
        elements.scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    }


    function addToCart(button) {
        const productCard = button.parentElement;
        const product = {
            name: productCard.querySelector('h3').textContent,
            description: productCard.querySelector('p:nth-of-type(1)').textContent,
            image: productCard.querySelector('img').src,
            price: parseFloat(productCard.querySelector('p:nth-of-type(2)').textContent.replace('$', '')),
            quantity: 1
        };

        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('success', 'Added!', `${product.name} has been added to the cart`);
    }


    function toggleWishlist(button) {
        const productCard = button.parentElement.parentElement;
        const productName = productCard.querySelector('h3').textContent;
        const heartIcon = button.querySelector('i');
        const existingItem = wishlist.find(item => item.name === productName);

        if (existingItem) {
            wishlist = wishlist.filter(item => item.name !== productName);
            heartIcon.classList.remove('fa-solid', 'text-red-500');
            heartIcon.classList.add('fa-regular', 'text-white');
            showNotification('info', 'Removed!', `${productName} has been removed from the wishlist`);
        } else {
            const product = {
                name: productName,
                description: productCard.querySelector('p:nth-of-type(1)').textContent,
                image: productCard.querySelector('img').src,
                price: parseFloat(productCard.querySelector('p:nth-of-type(2)').textContent.replace('$', ''))
            };
            wishlist.push(product);
            heartIcon.classList.remove('fa-regular', 'text-white');
            heartIcon.classList.add('fa-solid', 'text-red-500');
            showNotification('success', 'Added!', `${productName} has been added to the wishlist`);
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }


    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
    }


    function updateWishlistCount() {
        wishlistCount.textContent = wishlist.length;
    }


    function handleSearch() {
        const searchTerm = elements.searchInput.value.toLowerCase().trim();
        let hasResults = false;

        if (searchTerm === '') {
            elements.productSections.forEach(item => {
                item.style.display = 'grid';
                item.classList.add('opacity-100', 'scale-100', 'translate-y-0');
                item.classList.remove('opacity-0', 'scale-75', 'translate-y-10');
            });
            if (elements.noResultsMessage) elements.noResultsMessage.style.display = 'none';
            elements.products.style.display = 'block';
            return;
        }

        elements.productSections.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                item.style.display = 'grid';
                item.classList.add('opacity-100', 'scale-100', 'translate-y-0');
                item.classList.remove('opacity-0', 'scale-75', 'translate-y-10');
                hasResults = true;
            } else {
                item.style.display = 'none';
                item.classList.add('opacity-0', 'scale-75', 'translate-y-10');
                item.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            }
        });

        if (elements.noResultsMessage) {
            elements.noResultsMessage.style.display = hasResults ? 'none' : 'block';
            elements.products.style.display = hasResults ? 'block' : 'none';
        }
    }


    function showNotification(icon, title, text) {
        Swal.fire({
            icon,
            title,
            text,
            timer: 1500,
            showConfirmButton: false
        });
    }


    function setupRevealAnimations() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'scale-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'scale-75', 'translate-y-10');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        elements.reveals.forEach(el => observer.observe(el));
    }


    function setupEventListeners() {
        if (elements.menuBtn) elements.menuBtn.addEventListener('click', toggleMobileMenu);
        if (elements.logoutBtnDesktop) elements.logoutBtnDesktop.addEventListener('click', handleLogout);
        if (elements.logoutBtnMobile) elements.logoutBtnMobile.addEventListener('click', handleLogout);
        if (elements.scrollBtn) elements.scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        if (elements.cartIcon) elements.cartIcon.addEventListener('click', () => window.location.href = 'purchases.html');
        if (elements.btnFavorite) elements.btnFavorite.addEventListener('click', () => window.location.href = 'favorite.html');
        if (elements.searchInput) elements.searchInput.addEventListener('input', handleSearch);
        window.addEventListener('scroll', handleScroll);

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => addToCart(button));
        });

        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', () => toggleWishlist(button));
            const productName = button.parentElement.parentElement.querySelector('h3').textContent;
            const heartIcon = button.querySelector('i');
            if (wishlist.some(item => item.name === productName)) {
                heartIcon.classList.add('fa-solid', 'text-red-500');
                heartIcon.classList.remove('fa-regular', 'text-white');
            } else {
                heartIcon.classList.add('fa-regular', 'text-white');
                heartIcon.classList.remove('fa-solid', 'text-red-500');
            }
        });
    }


        displayUsername();
        setupEventListeners();
        setupRevealAnimations();
        updateCartCount();
        updateWishlistCount();

});