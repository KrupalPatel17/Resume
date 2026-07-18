const NAV_BAR = document.getElementById('navBar');
const NAV_LIST = document.getElementById('navList');
const HAMBURGER_BTN = document.getElementById('hamburgerBtn');
const NAV_LINKS = Array.from(document.querySelectorAll('.nav__list-link'));
const SERVICE_BOXES = document.querySelectorAll('.service-card__box');
const ACTIVE_LINK_CLASS = 'active';

/* -------------------------------------------------
 * Sticky navbar background on scroll
 * ------------------------------------------------- */
const handleNavBackground = () => {
    NAV_BAR.classList.toggle('is-scrolled', window.scrollY > 40);
};
handleNavBackground();
window.addEventListener('scroll', handleNavBackground, { passive: true });

/* -------------------------------------------------
 * Mobile navigation toggle
 * ------------------------------------------------- */
const closeMobileNav = () => {
    NAV_LIST.classList.remove('nav--active');
    NAV_BAR.classList.remove('nav--active');
    document.body.classList.remove('nav-open');
};
HAMBURGER_BTN.addEventListener('click', () => {
    const isOpen = NAV_LIST.classList.toggle('nav--active');
    NAV_BAR.classList.toggle('nav--active', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
});

/* -------------------------------------------------
 * Scroll-spy: highlight the active nav link
 * ------------------------------------------------- */
const SECTIONS = document.querySelectorAll('#heroHeader, #about, #skills, #services, #works, #contact');
const setActiveLink = () => {
    const navHeight = NAV_BAR.getBoundingClientRect().height;
    let currentId = SECTIONS[0].id;

    SECTIONS.forEach((section) => {
        if (window.scrollY >= section.offsetTop - navHeight - 120) {
            currentId = section.getAttribute('id');
        }
    });

    NAV_LINKS.forEach((link) => {
        link.classList.toggle(ACTIVE_LINK_CLASS, link.getAttribute('href') === '#' + currentId);
    });
};
setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive: true });

/* Close the mobile menu when a link is clicked */
NAV_LINKS.forEach((link) => {
    link.addEventListener('click', () => {
        closeMobileNav();
        link.blur();
    });
});

/* -------------------------------------------------
 * Scroll reveal animations
 * ------------------------------------------------- */
const REVEAL_ITEMS = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (index % 3) * 90 + 'ms';
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    REVEAL_ITEMS.forEach((item) => observer.observe(item));
} else {
    REVEAL_ITEMS.forEach((item) => item.classList.add('is-visible'));
}

/* -------------------------------------------------
 * Service card cursor glow
 * ------------------------------------------------- */
SERVICE_BOXES.forEach((service) => {
    const bg = service.querySelector('.service-card__bg');
    if (!bg) return;

    service.addEventListener('mousemove', (e) => {
        const rect = service.getBoundingClientRect();
        bg.style.left = (e.clientX - rect.left) + 'px';
        bg.style.top = (e.clientY - rect.top) + 'px';
    });
});

/* -------------------------------------------------
 * Count-up animation for stat numbers
 * ------------------------------------------------- */
const STAT_NUMS = document.querySelectorAll('.stat-card__num[data-count]');
const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.textContent.replace(/[0-9]/g, ''); // keep "+" or "%"
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

if ('IntersectionObserver' in window && STAT_NUMS.length) {
    const statObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    STAT_NUMS.forEach((num) => statObserver.observe(num));
}

/* -------------------------------------------------
 * Dynamic footer year
 * ------------------------------------------------- */
const YEAR_EL = document.getElementById('year');
if (YEAR_EL) {
    YEAR_EL.textContent = new Date().getFullYear();
}
