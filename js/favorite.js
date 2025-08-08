document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        wishlistItemsContainer: document.getElementById('wishlist-items'),
        noFavoritesMessage: document.getElementById('no-favorites'),
        cartIcon: document.getElementById('cart'),
        cartCount: document.getElementById('cart-count')
    };


    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    function displayWishlist() {
        elements.wishlistItemsContainer.innerHTML = '';
        
        if (wishlist.length === 0) {
            toggleWishlistVisibility(true);
            return;
        }

        toggleWishlistVisibility(false);
        wishlist.forEach(item => {
            const itemCard = `
                <div class="bg-zinc-400 rounded-lg shadow-md p-4 relative box-border">
                    <img src="${item.image}" alt="${item.name}" class="mx-auto w-fit object-cover rounded-md h-64">
                    <h3 class="text-lg font-semibold mt-2">${item.name}</h3>
                    <p class="text-gray-600 mt-1">${item.description}</p>
                    <p class="mt-1 text-gray-900">$${item.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full" data-name="${item.name}">
                        Add to Cart
                    </button>
                    <div class="absolute top-2 right-2">
                        <button class="wishlist-btn text-red-500 px-2 py-1 rounded" data-name="${item.name}">
                            <i class="fa-solid fa-heart text-2xl"></i>
                        </button>
                    </div>
                </div>
            `;
            elements.wishlistItemsContainer.insertAdjacentHTML('beforeend', itemCard);
        });
    }


    function toggleWishlistVisibility(isEmpty) {
        elements.noFavoritesMessage.style.display = isEmpty ? 'block' : 'none';
        elements.wishlistItemsContainer.style.display = isEmpty ? 'none' : 'grid';
    }


    function addToCart(button) {
        const productName = button.getAttribute('data-name');
        const product = wishlist.find(item => item.name === productName);
        if (!product) return;

        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('success', 'Added!', `${productName} has been added to the cart`);
    }


    function removeFromWishlist(button) {
        const productName = button.getAttribute('data-name');
        wishlist = wishlist.filter(item => item.name !== productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist();
        showNotification('info', 'Removed!', `${productName} has been removed from the wishlist`);
    }


    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
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


    function setupEventListeners() {
        // Cart icon navigation
        if (elements.cartIcon) {
            elements.cartIcon.addEventListener('click', () => {
                window.location.href = 'purchases.html';
            });
        } else {
            console.error('Cart icon not found');
        }


        elements.wishlistItemsContainer.addEventListener('click', (e) => {
            const wishlistButton = e.target.closest('.wishlist-btn');
            const addToCartButton = e.target.classList.contains('add-to-cart-btn');

            if (wishlistButton) {
                removeFromWishlist(wishlistButton);
            } else if (addToCartButton) {
                addToCart(e.target);
            }
        });
    }


        setupEventListeners();
        displayWishlist();
        updateCartCount();

});