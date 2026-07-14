/* ========================================
   SCARTO Winery — Landing Page Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------
       HEADER — Scroll behaviour
       ---------------------------------------- */
    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 60) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ----------------------------------------
       MOBILE MENU — Toggle + close on link
       ---------------------------------------- */
    const burger = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    function openMenu() {
        burger.classList.add('is-active');
        mobileMenu.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        burger.classList.remove('is-active');
        mobileMenu.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('is-active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ----------------------------------------
       SMOOTH SCROLL — Anchor links
       ---------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerH = header ? header.offsetHeight : 0;
            const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        });
    });

    /* ----------------------------------------
       SCROLL ANIMATIONS — Intersection Observer
       ---------------------------------------- */
    const animEls = document.querySelectorAll('.anim-fade, .anim-up');

    if ('IntersectionObserver' in window) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    animObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        animEls.forEach(el => animObserver.observe(el));
    } else {
        // Fallback: show everything
        animEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ----------------------------------------
       CONTACT FORM → WhatsApp
       ---------------------------------------- */
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('name').value.trim();
            const phoneVal = document.getElementById('phone').value.trim();
            const interestVal = document.getElementById('interest').value;
            const messageVal = document.getElementById('message').value.trim();

            const interestMap = {
                'consulta':    'Consulta general',
                'degustacion': 'Reservar degustación del sábado',
                'regalo':      'Busco un vino para regalar',
                'evento':      'Evento privado / cerramiento',
                'otro':        'Otro'
            };

            let text = 'Hola! Soy ' + nameVal + '.';

            if (interestVal && interestMap[interestVal]) {
                text += ' Mi consulta es sobre: ' + interestMap[interestVal] + '.';
            }

            if (messageVal) {
                text += ' ' + messageVal;
            }

            text += ' (Mi teléfono: ' + phoneVal + ')';

            const waNumber = '5491164870541';
            const waURL = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text);

            window.open(waURL, '_blank', 'noopener');
        });
    }

    /* ----------------------------------------
       ACTIVE NAV LINK — Highlight on scroll
       ---------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    if (sections.length && navLinks.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('is-active-link');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('is-active-link');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -40% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }
});