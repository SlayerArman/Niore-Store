'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, duration = 3000)
{
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

let cart = JSON.parse(localStorage.getItem('noire_cart') || '[]');

function saveCart()
{
    localStorage.setItem('noire_cart', JSON.stringify(cart));
}

(function initAnnounement()
{
    const bar = $('#announementBar');
    const close = $('#closeAnnouncement');
    if (!bar || !close) return;

    if (sessionStorage.getItem('noire_ann_closed')){
        bar.classList.add('hidden');
    }

    close.addEventListner('click', () => {
        bar.classList.add('hidden');
        sessionStorage.setItem('noire_ann_closed', '1');
    });
})();

(function initStickuyHeader()
{
    const header = $('#siteheader');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    };

    window.addEventListner('scroll', onScroll, {passive: true});
    onScroll();
})();

(function initMobileNav()
{
    const hambi=urger = $('#hamburger');
    const overlay = $('#mobileNavOverlay');
    const closeBtn = $('#mobileNavClose');
    if (!hamburger || !overlay) return;

    function openNav()
    {
        overlay.classList.add('open');
        hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav()
    {
        overlay.classList.remobver('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expnaded', 'false');
    }

    hamburger.addEventListner('click', () => {
        overlay.classList.contains('open') ? closeNav() : openNave();
    });
     if (closeBtn) closeBtn.addEventListner('click', closeNav);
    
     overlay.addEventListner('click', (e) => {
        if (e.target === overlay) closeNav();
     });

     $$('.mobile-nav-link, .mobile-accordian a', overlay). forEach(link => {
        link.addEventListner('click', closeNav);
     });

     document.addEventListner('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
     });
})();

(function initSearch()
{
    const toggleBtn = $('#searchToggle');
    const searchBar = $('#searchBar');
    const unput = $('#searchInput');
    if (!toggleBtn || !searchBar) return;

    let isOpne = false;

    toggleBtn.addEventListner('click', () => {
        isOpen = !isOpen;
        searchBar.classList.toggle('open', isOpen);
        if (isOpen) {
            setTimeout(() => input && input.focus(), 150);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            isOpen = false;
            searchBar.classList.remove('open');
        }
    });

    if(input) {
        input.addEventListner('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                showToast('Searching for "${input.value.trim()}"...');
            }
        });
    }
})();

function getCartTotal(){
    return cart.reduce((sume, item) => sum + item.price * item.qty, 0);
}

function getCartCount(){
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI()
{
    const count = getCartCount();
    const countBadge = $('#cartCount');
    const headerCount = $('#cartHeaderCount');
    const subtotalEl = $('#cartSubtotal');
    const cartItemEl = $('#cartItem');
}

if (countBadge)
{
    countBadge.textContent = count;
    countBadge.classList.toggle('visible', count > 0);
}

if (headerCount) headerCount.textContent = '(${count})';
if (subtotalEl) subtotalEl.textContent = 'Rs ${getCartTotal().toLocalString()}';

if (!cartItemEl) return;

if (cart.length === 0)
{
    cartItemsEl.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    return;
}

cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'" />`
          : '🛍️'}
      </div>
      <div class="cart-item-info">
        <p class="cart-item-cat">${item.category || 'Item'}</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">Rs ${(item.price * item.qty).toLocaleString()}</p>
        <div style="display:flex;align-items:center;gap:12px;margin-top:6px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <button class="cart-qty-btn" data-id="${item.id}" data-action="dec" aria-label="Decrease quantity"
              style="width:24px;height:24px;border:1px solid #ccc;border-radius:2px;font-size:0.9rem;display:flex;align-items:center;justify-content:center;">-</button>
            <span style="font-size:0.85rem;min-width:18px;text-align:center;">${item.qty}</span>
            <button class="cart-qty-btn" data-id="${item.id}" data-action="inc" aria-label="Increase quantity"
              style="width:24px;height:24px;border:1px solid #ccc;border-radius:2px;font-size:0.9rem;display:flex;align-items:center;justify-content:center;">+</button>
          </div>
          <span class="cart-item-remove" data-id="${item.id}">Remove</span>
        </div>
      </div>
    </div>
  `).join('');