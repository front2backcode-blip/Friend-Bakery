/* =====================================================
   FRIEND BAKERY — script.js
   Pure JavaScript, no libraries
   ===================================================== */

const WA_NUMBER = '923063585556';

/* ---- WhatsApp Order Functions ---- */

/**
 * Generic WhatsApp order — called directly from offer buttons
 */
function orderOnWhatsApp(productName, qty, price) {
  const msg = `Hi Friend Bakery! 🎉\n\nI'd like to place an order:\n\n` +
    `🛍️ *Product:* ${productName}\n` +
    `🔢 *Quantity:* ${qty}\n` +
    (price ? `💰 *Price:* Rs. ${price.toLocaleString()}\n` : '') +
    `\nPlease confirm availability. Thank you! 😊`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/**
 * Read quantity from the sibling qty-wrap of the clicked button,
 * then open WhatsApp with pre-filled message.
 */
function orderProduct(btn, productName) {
  const footer = btn.closest('.product-footer');
  const qtyEl  = footer ? footer.querySelector('.qty-val') : null;
  const qty    = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

  const msg = `Hi Friend Bakery! 🎉\n\nI'd like to place an order:\n\n` +
    `🛍️ *Product:* ${productName}\n` +
    `🔢 *Quantity:* ${qty}\n\n` +
    `Please confirm availability. Thank you! 😊`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ---- Quantity +/- ---- */
function changeQty(btn, delta) {
  const wrap = btn.closest('.qty-wrap');
  const valEl = wrap.querySelector('.qty-val');
  let current = parseInt(valEl.textContent, 10);
  current = Math.max(1, current + delta);
  valEl.textContent = current;
}

/* ---- Product Modal ---- */
let modalProductName = '';

function openModal(title, imgSrc, desc, orderName) {
  const overlay  = document.getElementById('modalOverlay');
  const img      = document.getElementById('modalImg');
  const titleEl  = document.getElementById('modalTitle');
  const descEl   = document.getElementById('modalDesc');
  const orderBtn = document.getElementById('modalOrderBtn');

  img.src        = imgSrc;
  img.alt        = title;
  titleEl.textContent = title;
  descEl.textContent  = desc;
  modalProductName    = orderName || title;

  orderBtn.onclick = () => {
    const qtyEl = overlay.querySelector('.qty-val');
    const qty   = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    const msg   = `Hi Friend Bakery! 🎉\n\nI'd like to order:\n\n` +
      `🛍️ *Product:* ${modalProductName}\n` +
      `🔢 *Quantity:* ${qty}\n\nThank you! 😊`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* Close modal on overlay click */
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* Close modal on Escape */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- Mobile hamburger ---- */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → ✕
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

/* Close nav on link click */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ---- Product filter tabs ---- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        // Re-trigger fade-in animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add('visible'), 30);
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ---- Scroll animations (Intersection Observer) ---- */
function initAnimations() {
  // Add animation classes to elements
  const animateSelectors = [
    { selector: '.product-card',    cls: 'fade-in' },
    { selector: '.offer-card',      cls: 'fade-in' },
    { selector: '.testi-card',      cls: 'fade-in' },
    { selector: '.blog-card',       cls: 'fade-in' },
    { selector: '.extra-card',      cls: 'fade-in' },
    { selector: '.cat-item',        cls: 'fade-in' },
    { selector: '.about-img',       cls: 'fade-in-left' },
    { selector: '.about-text',      cls: 'fade-in-right' },
    { selector: '.section-head',    cls: 'fade-in' },
    { selector: '.contact-info',    cls: 'fade-in-left' },
    { selector: '.contact-map',     cls: 'fade-in-right' },
  ];

  animateSelectors.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

/* ---- Smooth active nav link highlight on scroll ---- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active-link'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

/* ---- "Back to top" on logo click ---- */
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', (e) => {
    if (logo.getAttribute('href') === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

/* ---- Lazy image loading ---- */
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native lazy supported

  const imgs = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

/* ---- Stagger animation delay for grids ---- */
function applyStaggerDelay() {
  const grids = [
    '.products-grid .product-card',
    '.offers-grid .offer-card',
    '.cat-grid .cat-item',
    '.testi-grid .testi-card',
    '.blog-grid .blog-card',
  ];
  grids.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });
}

/* ---- Active nav link style (add to CSS via JS class) ---- */
(function injectActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = '.nav-links a.active-link{color:var(--pink-dark)!important;background:var(--pink-light)!important}';
  document.head.appendChild(style);
})();

/* ---- Floating WA tooltip ---- */
function initFloatWaTooltip() {
  const btn = document.querySelector('.float-wa');
  const tip = document.createElement('span');
  tip.textContent = 'Order Now!';
  tip.style.cssText = `
    position:absolute;right:70px;top:50%;transform:translateY(-50%);
    background:#1e1b1e;color:#fff;font-size:.75rem;font-weight:600;
    padding:6px 12px;border-radius:50px;white-space:nowrap;pointer-events:none;
    opacity:0;transition:opacity .25s ease;font-family:'Poppins',sans-serif;
  `;
  btn.style.position = 'fixed'; // already fixed but ensure it
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:999;display:flex;align-items:center;';
  btn.parentNode.insertBefore(wrapper, btn);
  wrapper.appendChild(tip);
  wrapper.appendChild(btn);
  btn.style.position = 'relative';
  btn.style.bottom   = '';
  btn.style.right    = '';

  btn.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
  btn.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
}

/* ---- Init all ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initScrollSpy();
  initLazyImages();
  applyStaggerDelay();
  initFloatWaTooltip();

  // Show a small welcome toast after 2 seconds
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white" style="flex-shrink:0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span>WhatsApp ordering is live! Tap any product to order 🎉</span>
    `;
    toast.style.cssText = `
      position:fixed;bottom:100px;right:24px;z-index:1500;
      background:#128C7E;color:#fff;
      display:flex;align-items:center;gap:10px;
      padding:14px 20px;border-radius:50px;
      font-family:'Poppins',sans-serif;font-size:.82rem;font-weight:500;
      box-shadow:0 4px 20px rgba(0,0,0,.2);
      animation:slideInToast .4s ease forwards;
      max-width:320px;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes slideInToast{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.style.transition = 'opacity .4s ease, transform .4s ease';
      toast.style.opacity    = '0';
      toast.style.transform  = 'translateX(110%)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }, 2000);
});
