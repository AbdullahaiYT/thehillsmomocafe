let cart = [];

function addToCart(name, variant, price) {
    let existing = cart.find(item => item.name === name && item.variant === variant);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, variant, price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const floatingCart = document.getElementById('floating-cart');
    const cartCount = document.getElementById('cart-count');
    const cartPrice = document.getElementById('cart-price');

    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartCount.innerText = totalQty;
    cartPrice.innerText = totalPrice;

    if (totalQty > 0) {
        floatingCart.classList.remove('hidden');
    } else {
        floatingCart.classList.add('hidden');
        closeCheckout(); 
    }
}

function openCheckout() {
    if (cart.length === 0) return; 
    
    const modal = document.getElementById('checkout-modal');
    const orderList = document.getElementById('order-list');
    const modalTotal = document.getElementById('modal-total-price');
    
    orderList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        let variantText = item.variant ? `<span style="color:#aaa; font-size:0.85rem">(${item.variant})</span>` : '';
        let itemTotal = item.price * item.qty;
        totalPrice += itemTotal;

        orderList.innerHTML += `
            <div class="order-list-item">
                <div>${item.qty}x ${item.name} ${variantText}</div>
                <div>₹${itemTotal}</div>
            </div>
        `;
    });

    modalTotal.innerText = totalPrice;
    modal.classList.remove('hidden');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function fetchLocation() {
    const locInput = document.getElementById('customer-location');
    locInput.value = "Fetching location...";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                locInput.value = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
            },
            (error) => {
                locInput.value = "";
                alert("Location access denied. Please type your address manually.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        alert("Geolocation not supported by your browser.");
        locInput.value = "";
    }
}

function sendOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const location = document.getElementById('customer-location').value.trim();

    if (!name || !location) {
        alert("Please enter your Name and Location for Home Delivery.");
        return;
    }

    let message = `*🛵 New Home Delivery Order! 🥟*\n\n`;
    message += `*👤 Name:* ${name}\n`;
    message += `*📍 Location:* ${location}\n\n`;
    message += `*🛒 Order Details:*\n`;
    message += `------------------------\n`;
    
    let totalPrice = 0;
    cart.forEach(item => {
        let variantText = item.variant ? `(${item.variant})` : '';
        let itemTotal = item.price * item.qty;
        totalPrice += itemTotal;
        message += `▪️ ${item.qty}x ${item.name} ${variantText} - ₹${itemTotal}\n`;
    });

    message += `------------------------\n`;
    message += `*💰 Total Amount to Pay: ₹${totalPrice}*\n`;

    const waNumber = "919310268055";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
}

// Fade In Fade Out Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in-out');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    elements.forEach(el => observer.observe(el));
});
