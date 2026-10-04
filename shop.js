/* =========================================================
   HEEL & STORY - SHOP PAGE LOGIC
   Uses PRODUCTS + formatPrice() from script.js (load script.js first)
   ========================================================= */

const catalogGrid = document.getElementById('shopCatalogGrid');
const sizeModalBackdrop = document.getElementById('sizeModalBackdrop');
const closeSizeModal = document.getElementById('closeSizeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalConfirmAdd = document.getElementById('modalConfirmAdd');
const modalSizeBtns = document.querySelectorAll('.modal-size-btn');

let currentModalProduct = null;
let currentSelectedSize = "38";

function renderCatalog() {
    if (!catalogGrid) return;

    catalogGrid.innerHTML = PRODUCTS.map(item => `
        <div class="shop-catalog-card" data-id="${item.id}">
            <div class="catalog-card-image">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
            </div>
            <div class="catalog-card-name">${item.name}</div>
            <div class="catalog-card-price">${formatPrice(item.price)}</div>
            <button class="btn-add-cart-pill" data-id="${item.id}">
                Add to cart→
            </button>
        </div>
    `).join('');

    attachCatalogEvents();
}

function attachCatalogEvents() {
    document.querySelectorAll('.btn-add-cart-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const product = PRODUCTS.find(p => p.id === id);
            if (!product) return;

            openSizeSelectorModal(product);
        });
    });
}

function openSizeSelectorModal(product) {
    currentModalProduct = product;
    modalImg.src = product.img;
    modalImg.alt = product.name;
    modalTitle.textContent = product.name;
    modalPrice.textContent = formatPrice(product.price);

    sizeModalBackdrop.classList.add('open');
}

function closeSizeSelectorModal() {
    sizeModalBackdrop.classList.remove('open');
    currentModalProduct = null;
}

if (closeSizeModal) closeSizeModal.addEventListener('click', closeSizeSelectorModal);
if (sizeModalBackdrop) {
    sizeModalBackdrop.addEventListener('click', (e) => {
        if (e.target === sizeModalBackdrop) closeSizeSelectorModal();
    });
}

modalSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modalSizeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentSelectedSize = btn.dataset.size;
    });
});

if (modalConfirmAdd) {
    modalConfirmAdd.addEventListener('click', () => {
        if (!currentModalProduct) return;

        const product = currentModalProduct; // closeSizeSelectorModal() nulls it

        addToCart(product, currentSelectedSize);

        closeSizeSelectorModal();
        showToast(`Added ${product.name} (Size ${currentSelectedSize}) to Bag`);
        openCartDrawer();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
});