/* =========================================================
   HEEL & STORY - SHARED SCRIPT (all pages)
   ========================================================= */

// ===== SINGLE SOURCE OF TRUTH: product catalog =====
// price = plain number in INR. Never store "₹"/"$" here.
const PRODUCTS = [
    { id: 1,  name: "Velvet Rose Heels",  price: 2499,  img: "assets/images/product-1.jpg" },
    { id: 2,  name: "Noir Heels",         price: 4999,  img: "assets/images/product-2.jpg" },
    { id: 3,  name: "White Swan Heels",   price: 3499,  img: "assets/images/product-3.jpg" },
    { id: 4,  name: "Marilyn Heels",      price: 6999,  img: "assets/images/product-4.jpg" },
    { id: 5,  name: "Beige Heels",        price: 4999,  img: "assets/images/product-5.jpg" },
    { id: 6,  name: "Paris Love",         price: 8999,  img: "assets/images/product-6.jpg" },
    { id: 7,  name: "Bridal Safe Heels",  price: 2499,  img: "assets/images/product-7.jpg" },
    { id: 8,  name: "White Pearly Heels", price: 5999,  img: "assets/images/product-8.jpg" },
    { id: 9,  name: "Kim Cut Boots",      price: 14999, img: "assets/images/product-9.jpg" },
    { id: 10, name: "Tokyo Heels",        price: 2499,  img: "assets/images/product-10.jpg" },
    { id: 11, name: "School Heels",       price: 4999,  img: "assets/images/product-11.jpg" },
    { id: 12, name: "Ballet Heels",       price: 1499,  img: "assets/images/product-12.jpg" }
];

// ===== SINGLE PRICE FORMATTER (₹ everywhere) =====
function formatPrice(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// DOM Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const toastEl = document.getElementById('toast');
const navbar = document.getElementById('navbar');

// State (key bumped to v3 so old carts with stale names/prices are ignored)
const CART_KEY = 'heelStoryCart_v3';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

/* ===== CART LOGIC ===== */
function addToCart(product, size) {
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === size);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            size: size,
            quantity: 1,
            cartItemId: `${product.id}-${size}-${Date.now()}`
        });
    }
    saveCart();
    renderCart();
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align:center; padding: 3rem 1rem; color: var(--color-subtle-text);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Your bag is currently empty.</p>
                <p style="font-size: 0.85rem; opacity: 0.7;">Explore our collection to find your pair.</p>
            </div>
        `;
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-meta">Size: ${item.size} • Qty: ${item.quantity}</div>
                <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                <span class="cart-item-remove" data-id="${item.cartItemId}">Remove</span>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(subtotal);

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
        });
    });
}

function openCartDrawer() {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
}

// Occasion cards (home page) -> go to the shop page
document.querySelectorAll('.occasion-card').forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });
});

/* ===== TOAST NOTIFICATION ===== */
let toastTimeout = null;
function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove('active');
    }, 2600);
}

/* ===== NAVBAR SCROLL EFFECT ===== */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ===== SCROLL REVEAL OBSERVER ===== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ===== EVENT LISTENERS ===== */
if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Your bag is empty.");
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Ensure background videos auto-play reliably
document.querySelectorAll('video').forEach(video => {
    video.play().catch(() => {
        // Autoplay policy handled quietly
    });
});

/* ===== INITIALIZE ===== */
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initBowCursor();
});

/* ===== CUSTOM COQUETTE RIBBON BOW CURSOR 🎀 ===== */
function initBowCursor() {
    // Only run on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cursor = document.getElementById('bowCursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'bowCursor';
        cursor.className = 'custom-bow-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML = `
            <svg class="cursor-bow-icon" viewBox="0 0 36 36" fill="none">
                <!-- Left Ribbon Loop -->
                <path d="M15 14 C8 4 1 8 3 16 C5 22 13 18 15 16 Z" fill="#d90429" stroke="#2b0408" stroke-width="1.3" stroke-linejoin="round"/>
                <path d="M5 10 C7 8 11 10 13 15" stroke="#ffb3c1" stroke-width="1.2" stroke-linecap="round"/>
                <!-- Right Ribbon Loop -->
                <path d="M19 14 C26 4 33 8 31 16 C29 22 21 18 19 16 Z" fill="#d90429" stroke="#2b0408" stroke-width="1.3" stroke-linejoin="round"/>
                <path d="M29 10 C27 8 23 10 21 15" stroke="#ffb3c1" stroke-width="1.2" stroke-linecap="round"/>
                <!-- Left Streamer Tail -->
                <path d="M14 17 C11 23 7 28 3 33 C7 31 10 32 12 30 C15 25 16 20 16 17 Z" fill="#9d0208" stroke="#2b0408" stroke-width="1.2" stroke-linejoin="round"/>
                <!-- Right Streamer Tail -->
                <path d="M20 17 C23 23 27 28 31 33 C27 31 24 32 22 30 C19 25 18 20 18 17 Z" fill="#9d0208" stroke="#2b0408" stroke-width="1.2" stroke-linejoin="round"/>
                <!-- Center Ribbon Knot -->
                <circle cx="17" cy="15" r="3.8" fill="#ff4d6d" stroke="#2b0408" stroke-width="1.3"/>
                <circle cx="16" cy="14" r="1.2" fill="#ffffff" opacity="0.95"/>
            </svg>
        `;
        document.body.appendChild(cursor);
    }

    let mouseX = -100, mouseY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        if (!cursor.classList.contains('active')) {
            cursor.classList.add('active');
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    const clickables = 'a, button, input, select, textarea, label, [role="button"], .nav-cart, .btn-add-cart-pill, .modal-size-btn, .btn-modal-confirm-add, .card-media, .shop-catalog-card, .trio-card, .behind-circle-card';

    document.addEventListener('mouseover', (e) => {
        if (e.target && e.target.closest && e.target.closest(clickables)) {
            cursor.classList.add('hovered');
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (e.target && e.target.closest && e.target.closest(clickables)) {
            cursor.classList.remove('hovered');
        }
    }, { passive: true });

    window.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    }, { passive: true });

    window.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
        createSparkle(mouseX, mouseY);
    }, { passive: true });

    function createSparkle(x, y) {
        if (x < 0 || y < 0) return;
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle-trail';
        const icons = ['🎀', '✨', '💖', '✦', '🌸'];
        sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--dx', `${(Math.random() - 0.5) * 36}px`);
        sparkle.style.setProperty('--dy', `${-18 - Math.random() * 24}px`);
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }
}