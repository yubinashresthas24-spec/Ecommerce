// cart.js - Complete Shopping Cart System

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Add to cart
function addToCart(id, quantity = 1) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    showToast(`${product.name} added to cart!`, "success");
}

// Update quantity
function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
    }
    
    if (window.location.href.includes("cart.html")) {
        displayCart();
    }
}

// Remove from cart
function removeFromCart(id) {
    const item = cart.find(item => item.id === id);
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showToast(`${item?.name || "Item"} removed from cart`, "info");
    
    if (window.location.href.includes("cart.html")) {
        displayCart();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    if (window.location.href.includes("cart.html")) {
        displayCart();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count badge
function updateCartCount() {
    const countElements = document.querySelectorAll("#cartCount");
    const totalItems = getCartItemCount();
    
    countElements.forEach(element => {
        if (element) element.innerText = totalItems;
    });
}

// Display cart on cart page
function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart" style="text-align:center; padding:60px;">
                <i class="fas fa-shopping-cart" style="font-size:64px; color:#ccc;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart!</p>
                <a href="products.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    let itemsHtml = '<div class="cart-items"><h3>Cart Items</h3>';
    
    cart.forEach(item => {
        itemsHtml += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price}</p>
                </div>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i> Remove</button>
            </div>
        `;
    });
    
    itemsHtml += '</div>';
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3500 ? 0 : 150;
    const total = subtotal + shipping;
    
    itemsHtml += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>Rs. ${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'Free' : 'Rs. ' + shipping}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>Rs. ${total}</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout →</button>
        </div>
    `;
    
    cartContainer.innerHTML = itemsHtml;
}

// Proceed to checkout
function proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!user) {
        showToast("Please login to continue", "warning");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return;
    }
    
    if (user.role === "admin") {
        showToast("Admin cannot place orders. Please login as customer.", "error");
        return;
    }
    
    window.location.href = "checkout.html";
}

// Toast notification
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast";
    
    if (type === "success") {
        toast.style.background = "#28a745";
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else if (type === "error") {
        toast.style.background = "#dc3545";
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else {
        toast.style.background = "#ffc107";
        toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize cart display
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    if (window.location.href.includes("cart.html")) {
        displayCart();
    }
});