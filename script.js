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

     $$('.mobile-nav-link, .mobile-accordion a', overlay). forEach(link => {
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

  $$('cart-item-remove', cartItemEl).forEach(btn => {
    btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartUI();
        showToast('Item removed from your bag.');
    });
  });

  $$('.cart-qty-btn', cartItemEl).forEach(btn => {
    btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.actionn;
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (action === 'inc') {
            item.qty += 1;
        } else {
            item.qty -= 1;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        saveCart();
        updateCartUI();
    });
  });
}

function addToCart(card) {
    const id = parseInt(card.dataset.id);
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const image = card.dataset.image || '';
    const catEl = $('.product-catergory', card);
    const category = catEl ? catEl.textContent : '';

    const existing = cart.find(i => i.id === id);
    if(existing)
    {
        existing.qty += 1;
        showToast('{name} - quantity updated ✓');
    } else {
        cart.push({id, name, price, image, category, qty: 1});
        showToast('${name} added to your bag ✓');
    }

    saveCart();
    updateCartUI();
    openCart();
}

function openCart()
{
    $('#cartDrawer')?.classList.add('open');
    $('#cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart()
{
    $('#cartDrawer')?.classList.remove('open');
    $('#cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

(function initCart() {
    $('#cartToggle')?.addEventListener('click', () => {
        $('#cartDrawer')?.classList.contains('open') ? closeCart() : openCart();
    });

    $('.cart-checkout')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your bag is empty!');
            return;
        }
        // TODO: replace with real checkout URL
        showToast('Redirecting to checkout...');
    });

    updateCartUI();
})();

(function initWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('noire_wishlisyt') || '[]');

    function saveWishlist()
    {
        localStorage.setItem('noire_wishlist', JSON.stringify(wishlist));
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-wishlist');
        if (!btn) return;
        const card = btn.closest('.product-card');
        if (!card) return;
        const id = parseInt(card.dataset.id);
        const name = card.dataset.name;
        const idx = wishlist.indexOf(id);

        if (idx === -1)
        {
            wishlist.psh(id);
            btn.classList.add('active');
            showToast(`${name} saved to wishlist ♥`)
        } else {
            wishlist.splice(idx, 1);
            btn.classList.remove('active');
            showToast(`${name} removed from wishlist`);
        }
        saveWishlist();
    });

    const saved = JSON.parse(localStorage.getItem('noire_wishlist') || '[]');
    $$('.product-card').forEach(card => {
        if (saved.includes(parseInt(card.dataset.id)))
        {
            const btn = $('.product-wishlist', card);
            if (btn) btn.classList.add('active');
        }
    });
})();

(function initSizeSelector ()
{
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.size-btn');
        if (!btn) return;
        const group = btn.closest('.product-sizes');
        if (!group) return;
        $$('.size-btn', group).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
})();

(function initSlider() {
    const track = $('#sliderTrack');
    const prevBtn = $('#sliderPrev');
    const nextBtn = $('#sliderNext');
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function getVisibleCount()
    {
        if (window.innerWidth <= 540) return 1;
        if (window.innerWidth <= 860) return 2;
        if (window.innerWidth <= 1100) return 3;
        return;
    }

    function getSlides()
    {
        return $$('.product-card--slide', track);
    }

    function updateSlider()
    {
        const slides = getSlides();
        const visible = getVisibleCount();
        const maxId = Math.max(0, slides.length - visible);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIdx));

        const cardWidth = slides[0]?.offsetWidth || 0;
        const gap = 20;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxId;
    }

    prevBtn.addEventListener('click', () => {currentIndex -= 1; updateSlider(); });
    nextBtn.addEventListener('click', () => {currentIndex += 1; updateSlider(); });

    window.addEventListner('resize', () => {
        currentIndex = 0;
        updateSlider();
    }, {passive: true});
    })();

    (function initNewsletter() {
        function handleNewsletterSubmit(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input[type="email"]');
                if (!input) return;
                const email = input.value.trim();

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                {
                    showToast('Please enter a valid email address.');
                    input.focus();
                    return;
                }

                // TODO: send `email` to your newsletter service (e.g. Mailchimp, SendGrid)
                showToast(`You're subscribed! Welcome to Noire. ✓`);
                input.value = '';
            });
        }

        const mainForm = $('#newsletterForm')
        const footerForm = $('#footerNewsletterForm');
        if (mainForm) handleNewsletterSubmit(mainForm);
        if (footerForm) handleNewsletterSubmit(footerForm);
    })();

    (function initContactForm()
    {
        const form = $('#contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = $('#contactName')?.value.trim();
            const email = $('#contactEmail')?.value.trim();
            const message = $('#contactMessage')?.value.trim();

            if (!name)
            {
               showToast('please enter your name.');
               $('#contactName')?.focus();
               return;
            }

            if (!email|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
               showToast ('please enter a valid email address.');
               $('#contactEmail')?.focus();
               return;
            }

            if (!message)
            {
                showToast('Please write a message.');
                $('#contactMessage')?.focus();
                return;
            }

            // TODO: send form data to your backend / Formspree / EmailJS
            // Example with Formspree: fetch('https://formspree.io/f/YOUR_FORM_ID',) {
            showToast('Message sent! We\'ll get back to you soon. ✓' );
            form.reset();

            });
                
            })();

            (function initScrollReveal()
            {
                const targets = [
                    '.product-card',
                    '.category-card',
                    '.trust-item',
                    '.insta-iten',
                    '.about-inner',
                    '.contact-detail-item',
                ];

                const allEls = $$(targets.join(','));

                if(!('IntersectionObserver' in window))
                {
                    allEls.forEach(el.style.opacity = '1');
                    return;
                }

                allEls.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(24px)';
                    el.style.transition = 'opacity 0.55s eae, transform 0.55s ease';
                });

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px -px -40px 0px',
                });

                allEls,forEach((el, i) => {
                    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
                    observer.observe(el);
                });
            })();

            (function initSmoothScroll() {
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a [href^="#"]');
                    if (!link) return;
                    const hash = link.getAttribute('herf');
                    if (hash === '#') return;
                    const taret = document.querySelector('hash');
                    if (!target) return;
                    e.preventDefault();
                    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
                    windown.scrollTo({top, behaviour: 'smooth'});
                });
            })();

            (function initActiveNav() {
                const sections = $$('section[id]');
                const navLinks = $$('.nav-link');
                if (!sections.length || !navLinks.length) return;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                      if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            link.style.color = (href === `#${id}`) ? 'var(--gold)' : '';
                        });
                    }
              });
            }, {rootMargin: '-40% 0px -55% 0px' });

            sections.forEach(sec=> observer.observer(sec));
        })();

        (function initLazyImages() {
         if(!('IntersectionObserver' in window)) return;

         const imgs = $$('img[data-src]');
         if (!imgs.length) return;

         const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            });
         }, {rootMargin: '200px'});

         imgs.forEach(img => imgObserver.observe(img));
        })();

        (function initCookieBanner() {
            if (localStorage.getItem('noire_cookies_accepted')) return;

            const banner = document.createElement('div');
            banner.id = 'cookieBanner';
            banner.style.cssText = `
                positon: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--charcoal);
                color: rgba(240, 237 232, 0.8);
                padding: 16px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                z-index: 600;
                flex-wrap: wrap;
                border-top: 1px solid rgba(201, 169, 110. 0.2);
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
            `;

            banner.innerHTML =`
                <span>We use cookies to improve your experience. By continuing, you agree to our <a href='#' style="color:var(--gold); text-decoration: underline;">Privacy Policy</a>.</span>
                <div style = "display: flex; gap: 10px; flex-shrink: 0;">
                    <button id = "cookieDecline" style = "paddign: 8px 18px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: 1.5px solid rgba(255, 255, 255, 0.2); border-radius: 2px; color: rgba(255, 255, 255, 0.6); background: none; cursor: pointer;">Decline</button>
                    <button id = "cookieAccept" style = "padding:8px 18px; font-size:0.75rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; background:var(--gold); color:var(--black); border:none; border-radius:2px; cursor:pointer;">Accept</button>
                </div>
                `;

                document.body.appendChild(banner);

                function dismissBanner(accepted)
                {
                    if (accepted) localStorage.setItem('noire_cookies_accepted', '1');
                    banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    banner.style.opacity = '0';
                    banner.style.transform = 'translateY(20px)';
                    setTimeout(() => banner.remove(), 300);
                }

                document.getElementById('cookieAccept')?.addEventListener('click', () => dismissBanner(true));
                document.getElementById('cookieDecline')?.addEventListener('click', () => dismissBanner(false));
            })();

            (function initImgFallbacks() {
                $$('img').forEach(img => {
                    img.addEventListener('error', () => {
                    img.style.display = 'none';
                    const placeholder = img.nextElementSibling;
                    if (placeholder?.classList.contains('category-img-placeholder') ||
                        placeholder?.classList.contains('product-img-placeholder') ||
                        placeholder?.classList.contains('about-img-placeholder') ||
                        placeholder?.classList.contains('insta-placeholder')) {
                        placeholder.style.display = 'flex';
                    }
                    });
                });
                })();

                (function syncHeaderTop() {
                const bar    = $('#announcementBar');
                const header = $('#siteHeader');
                if (!bar || !header) return;

                function update() {
                    const annH = bar.classList.contains('hidden') ? 0 : bar.offsetHeight;
                    header.style.top = `${annH}px`;
                }

                new MutationObserver(update).observe(bar, { attributes: true, attributeFilter: ['class'] });
                window.addEventListener('resize', update, { passive: true });
                update();
                })();

                document.addEventListener('DOMContentLoaded', () => {
                // Add any additional init code here if needed.
                console.log('%cNoire Lifestyle 🖤', 'font-family: Georgia, serif; font-size:20px; color: #C9A96E;');
                console.log('%cPowered by craft, worn with purpose.', 'font-size: 12px; color: #888;');
                });