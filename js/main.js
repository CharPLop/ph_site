// ═══ PSICHE HOLOS — MAIN.JS ═══

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
function toggleNav() {
  var nav = document.getElementById('nav');
  nav.classList.toggle('nav-open');
  document.querySelector('.hamburger').classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('nav-open') ? 'hidden' : '';
}
function closeNav() {
  document.getElementById('nav').classList.remove('nav-open');
  document.querySelector('.hamburger').classList.remove('active');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function observeReveals() {
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
observeReveals();

// ── FAQ ──
function toggleFaq(btn) {
  const a = btn.nextElementSibling;
  const open = btn.classList.toggle('open');
  a.classList.toggle('open', open);
}

// ── COOKIES ──
setTimeout(() => {
  if (!localStorage.getItem('cookies_accepted')) {
    document.getElementById('cookieBanner').classList.add('show');
  }
}, 2000);
function acceptCookies() {
  localStorage.setItem('cookies_accepted', 'true');
  document.getElementById('cookieBanner').classList.remove('show');
}

// ── FORM ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(form);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', body: data
    }).then(r => r.json()).then(d => {
      if (d.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    }).catch(() => {
      alert('Errore nell\'invio. Prova con WhatsApp o email.');
    });
  });
}

// ── STUDIO CAROUSEL ──
function initStudioCarousel() {
  const root = document.getElementById('studioCarousel');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.studio-slide'));
  if (!slides.length) return;
  const interval = Number(root.getAttribute('data-interval')) || 4500;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0, timer = null;

  const dotsWrap = root.querySelector('.studio-dots');
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'studio-dot' + (i === 0 ? ' is-active' : '');
    b.setAttribute('aria-label', "Vai all'immagine " + (i + 1));
    b.addEventListener('click', () => { show(i); restart(); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }
  const next = () => show(current + 1);
  const prev = () => show(current - 1);
  const start = () => { if (!reduce && !timer) timer = setInterval(next, interval); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const restart = () => { stop(); start(); };

  const nextBtn = root.querySelector('.studio-next');
  const prevBtn = root.querySelector('.studio-prev');
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  start();
}
initStudioCarousel();
