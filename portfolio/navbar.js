// Hamburger toggle
const navToggler = document.querySelector('.nav-toggler');
const nav = document.querySelector('.nav');

navToggler.addEventListener('click', () => {
    navToggler.classList.toggle('active');
    nav.classList.toggle('open');

    if (nav.classList.contains('open')) {
        nav.style.maxHeight = nav.scrollHeight + 'px';
    } else {
        nav.removeAttribute('style');
    }
});

// Close nav when a link is clicked (mobile)
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggler.classList.remove('active');
        nav.classList.remove('open');
        nav.removeAttribute('style');
    });
});

// Active link highlight on scroll
const sections = document.querySelectorAll('section, [id]');
const navLinks = document.querySelectorAll('.nav ul li a');

function highlightNav() {
    let scrollY = window.scrollY;
    let found = false;

    navLinks.forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target || found) return;

        const top = target.offsetTop - 90;
        const bottom = top + target.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            link.classList.add('active');
            found = true;
        }
    });
}

// Glassmorphism header on scroll
const header = document.querySelector('.header');
function handleHeaderScroll() {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', () => {
    highlightNav();
    handleHeaderScroll();
}, { passive: true });

highlightNav();
handleHeaderScroll();
