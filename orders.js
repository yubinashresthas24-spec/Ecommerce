// orders.js - Complete Order Management System

let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Place order
function placeOrder() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!user || user.role !== "customer") {
        showToast("Please login as customer to place order", "error");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return false;
    }
    
    if (cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return false;
    }
    
    // Get form data
    const fullName = document.getElementById("deliveryName")?.value;
    const phone = document.getElementById("deliveryPhone")?.value;
    const email = document.getElementById("deliveryEmail")?.value;
    const address = document.getElementById("deliveryAddress")?.value;
    const city = document.getElementById("deliveryCity")?.value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const notes = document.getElementById("orderNotes")?.value;
    
    if (!fullName || !phone || !address || !city) {
        showToast("Please fill all required fields!", "error");
        return false;
    }
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3500 ? 0 : 150;
    const total = subtotal + shipping;
    
    // Generate order ID
    const orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    
    // Create order object
    const order = {
        orderId: orderId,
        customerId: user.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: address,
        city: city,
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        paymentMethod: paymentMethod,
        notes: notes,
        status: "pending",
        orderDate: new Date().toISOString(),
        estimatedDelivery: getEstimatedDeliveryDate()
    };
    
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    
    showToast(`Order placed successfully! Order ID: ${orderId}`, "success");
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = `order-tracking.html?id=${orderId}`;
    }, 2000);
    
    return true;
}

// Get estimated delivery date
function getEstimatedDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
}

// Display customer orders
function displayCustomerOrders() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const container = document.getElementById("ordersContainer");
    
    if (!container) return;
    
    if (!user || user.role !== "customer") {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-lock" style="font-size: 48px; color: #ccc;"></i>
                <h3>Please login to view your orders</h3>
                <a href="login.html" class="btn-primary">Login Now</a>
            </div>
        `;
        return;
    }
    
    const customerOrders = orders.filter(order => order.customerId === user.id);
    
    if (customerOrders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ccc;"></i>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <a href="products.html" class="btn-primary">Shop Now</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = customerOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>Order #${order.orderId}</strong><br>
                    <small>${new Date(order.orderDate).toLocaleDateString()}</small>
                </div>
                <div>
                    <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                    <button class="track-btn" onclick="window.location.href='order-tracking.html?id=${order.orderId}'">Track Order</button>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <strong>${item.name}</strong><br>
                            Qty: ${item.quantity} × Rs. ${item.price}
                        </div>
                        <div style="margin-left: auto; font-weight: bold;">
                            Rs. ${item.price * item.quantity}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="padding: 15px 20px; background: #f8f9fa; display: flex; justify-content: space-between;">
                <span>Total Paid:</span>
                <strong style="color: #ff6b35;">Rs. ${order.total}</strong>
            </div>
        </div>
    `).join('');
}

// Track order by ID
function trackOrder() {
    let orderId = document.getElementById("orderIdInput")?.value;
    
    if (!orderId && window.location.href.includes("order-tracking.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        orderId = urlParams.get('id');
        if (orderId && document.getElementById("orderIdInput")) {
            document.getElementById("orderIdInput").value = orderId;
       