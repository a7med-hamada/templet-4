document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        cartItemsContainer: document.getElementById('cart-items'),
        emptyCartMessage: document.getElementById('empty-cart'),
        cartCount: document.getElementById('cart-count'),
        totalPriceElement: document.getElementById('total-price'),
        buyAllButton: document.getElementById('buy-all-btn'),
        deleteAllButton: document.getElementById('delete-all-btn'),
        cartIcon: document.getElementById('cart')
    };


    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);


        elements.cartCount.textContent = totalItems;
        elements.totalPriceElement.textContent = `Total Price: $${totalPrice}`;
        localStorage.setItem('cart', JSON.stringify(cart));


        if (cart.length === 0) {
            toggleCartVisibility(true);
            return;
        }


        toggleCartVisibility(false);
        renderCartItems();
    }


    function toggleCartVisibility(isEmpty) {
        elements.emptyCartMessage.classList.toggle('hidden', !isEmpty);
        elements.cartItemsContainer.classList.toggle('hidden', isEmpty);
        elements.buyAllButton.classList.toggle('hidden', isEmpty);
        elements.deleteAllButton.classList.toggle('hidden', isEmpty);
    }


    function renderCartItems() {
        elements.cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'bg-zinc-400 rounded-lg shadow-md p-4 transition-all duration-700 reveal';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="mx-auto w-fit object-cover rounded-md h-64">
                <h3 class="text-lg font-semibold mt-2">${item.name}</h3>
                <p class="text-gray-600 mt-1">${item.description}</p>
                <p class="mt-1 text-gray-900">Price: $${item.price.toFixed(2)}</p>
                <div class="flex items-center justify-between mt-2">
                    <p class="text-gray-900">Quantity: <span class="quantity">${item.quantity}</span></p>
                    <div class="flex gap-2">
                        <button class="increase-btn bg-green-600 text-white px-3 py-1 rounded">+</button>
                        <button class="decrease-btn bg-red-600 text-white px-3 py-1 rounded">-</button>
                        <button class="delete-btn bg-gray-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                </div>
            `;
            elements.cartItemsContainer.appendChild(itemDiv);


            addItemEventListeners(itemDiv, item, index);
        });
    }


    function addItemEventListeners(itemDiv, item, index) {
        const buttons = {
            increase: itemDiv.querySelector('.increase-btn'),
            decrease: itemDiv.querySelector('.decrease-btn'),
            delete: itemDiv.querySelector('.delete-btn')
        };

        buttons.increase.addEventListener('click', () => {
            item.quantity += 1;
            updateCartDisplay();
            showNotification('success', 'Updated!', `${item.name} quantity increased`);
        });

        buttons.decrease.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartDisplay();
            showNotification('success', 'Updated!', `${item.name} quantity decreased or removed from cart`);
        });

        buttons.delete.addEventListener('click', () => {
            cart.splice(index, 1);
            updateCartDisplay();
            showNotification('success', 'Deleted!', `${item.name} removed from cart`);
        });
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


    function setupBuyAllButton() {
        if (elements.buyAllButton) {
            elements.buyAllButton.addEventListener('click', () => {
                const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
                const finalPrice = parseFloat(totalPrice) > 5000 ? (parseFloat(totalPrice) * 0.75).toFixed(2) : totalPrice;
                const discountMessage = parseFloat(totalPrice) > 5000
                    ? `Congratulations! You got a 25% discount!<br>Price before discount: $${totalPrice}<br>Price after discount: $${finalPrice}`
                    : `Purchase successful!<br>Total Price: $${totalPrice}`;

                Swal.fire({
                    icon: 'success',
                    title: 'Purchase Completed!',
                    html: discountMessage,
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                }).then(() => {
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                });
            });
        }
    }


    function setupDeleteAllButton() {
        if (elements.deleteAllButton) {
            elements.deleteAllButton.addEventListener('click', () => {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure?',
                    text: 'This will remove all items from the cart!',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete all',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        cart = [];
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartDisplay();
                        showNotification('success', 'Deleted!', 'All items removed from cart');
                    }
                });
            });
        }
    }


    function setupCartIcon() {
        if (elements.cartIcon) {
            elements.cartIcon.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        } else {
            console.error('Cart icon not found');
        }
    }



        setupBuyAllButton();
        setupDeleteAllButton();
        setupCartIcon();
        updateCartDisplay();
});