
// We need a key to access the local storage cartItems consistently.
const mweowCartItemsKey = "mweow:cartItems";

// Get the value of the cart in case the user has selected an item(s) to purchase.
// (|| OR) get an empty array.
let cartItems = JSON.parse(localStorage.getItem(mweowCartItemsKey)) || [];

function updateCartIcon() {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.totalQuantity').textContent = totalQuantity;
}

function addToCart(productName, price, imageSrc) {
    const existingItem = cartItems.find(item => item.productName === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({productName, price, imageSrc, quantity: 1});
    }
    // Persist the contents of the cart to a storage in the user's browser so that we can use it across pages.
    // When we change from index.html to Products.html, the cartItems is reset. The localStorage stays, though.
    localStorage.setItem(mweowCartItemsKey, JSON.stringify(cartItems));
    updateCartIcon();
}

function clearCart() {
    cartItems = [];
    // Persist the empty array to local storage so that it is not used in the next page
    localStorage.removeItem(mweowCartItemsKey);
    updateCartIcon();
    renderCart();
}

// Attach event listeners to add to cart buttons
// Limit this querySelector to just btns that have the required attributes.
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn[data-product-name][data-price][data-image-src]');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.getAttribute('data-product-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const imageSrc = this.getAttribute('data-image-src');
        addToCart(productName, price, imageSrc);
    });
});

// Attach event listener to clear cart button
const clearCartButton = document.getElementById('clear-cart');
clearCartButton.addEventListener('click', clearCart);

// Function to render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        // If the user is viewing a different page than view-cart.html; this code will stop
        // There is no cart to render
        return;
    }
    cartItemsContainer.innerHTML = ''; // Clear previous content

    let totalAmount = 0;

    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('col-12', 'mb-3');
        cartItemDiv.innerHTML = `
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${item.imageSrc}" class="img-fluid" alt="Product Image">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.productName}</h5>
                                <p class="card-text">Price: ₱${item.price}</p>
                                <p class="card-text">Quantity: ${item.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        cartItemsContainer.appendChild(cartItemDiv);

        totalAmount += item.price * item.quantity;
    });

    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = `₱${totalAmount}`;
}

// Call renderCart() initially to display cart items on page load
renderCart();



