/* ============================================
   SCARTO Winery — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    const scrollThreshold = 100;

    const handleHeaderScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ============================================
    // MOBILE MENU
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on element position within viewport
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    animatedElements.forEach((el, index) => {
        // Add staggered delay for elements in the same section
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll('[data-animate]');
        const siblingIndex = Array.from(siblings).indexOf(el);
        el.dataset.delay = siblingIndex * 100;
        scrollObserver.observe(el);
    });

    // ============================================
    // WINE CATEGORY FILTER
    // ============================================
    const categoryBtns = document.querySelectorAll('.wines__category-btn');
    const wineCards = document.querySelectorAll('.wine-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            wineCards.forEach(card => {
                if (category === 'todos' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeIn animation keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // CONTACT FORM -> WHATSAPP
    // ============================================
    const contactForm = document.getElementById('contactForm');

    const interestLabels = {
        'consulta-general': 'Consulta general',
        'asesoramiento-vinos': 'Asesoramiento para elegir vino',
        'cata': 'Reservar cata',
        'regalo': 'Armar un regalo',
        'picada': 'Picada para llevar',
        'otro': 'Otro'
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const interest = document.getElementById('interest').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !phone) {
            // Simple validation feedback
            if (!name) document.getElementById('name').focus();
            else if (!phone) document.getElementById('phone').focus();
            return;
        }

        // Build WhatsApp message
        let whatsappMessage = `Hola SCARTO Winery, soy ${name}.`;
        
        if (interest && interestLabels[interest]) {
            whatsappMessage += ` Mi consulta es sobre: ${interestLabels[interest]}.`;
        }
        
        if (message) {
            whatsappMessage += ` ${message}`;
        }

        whatsappMessage += ` Mi teléfono de contacto es ${phone}.`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/5491164870541?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener');

        // Reset form
        contactForm.reset();
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================================
    // PARALLAX EFFECT ON HERO
    // ============================================
    const heroBg = document.querySelector('.hero__bg-img');

    const handleParallax = () => {
        if (window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
        }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ============================================
    // GALLERY ITEM HOVER EFFECT
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery__item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            galleryItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.7';
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            galleryItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });

    // ============================================
    // WHATSAPP FLOAT TOOLTIP CLOSE ON MOBILE
    // ============================================
    const whatsappFloat = document.getElementById('whatsappFloat');

    if (window.innerWidth <= 768) {
        const tooltip = whatsappFloat.querySelector('.whatsapp-float__tooltip');
        if (tooltip) {
            // Show tooltip briefly on mobile
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                tooltip.style.transform = 'translateX(0)';
                
                setTimeout(() => {
                    tooltip.style.opacity = '';
                    tooltip.style.visibility = '';
                    tooltip.style.transform = '';
                }, 3000);
            }, 2000);
        }
    }

    // ============================================
    // COUNTER ANIMATION FOR RATING
    // ============================================
    const ratingNumber = document.querySelector('.testimonials__rating-number');
    let hasAnimated = false;

    const animateCounter = (element, target) => {
        if (hasAnimated) return;
        hasAnimated = true;

        const duration = 1500;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(1);
        }, 16);
    };

    const ratingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(ratingNumber, 4.7);
                ratingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (ratingNumber) {
        ratingObserver.observe(ratingNumber);
    }

    // ============================================
    // TYPING EFFECT ON HERO (OPTIONAL ENHANCEMENT)
    // ============================================
    const heroTitleLine2 = document.querySelector('.hero__title-line2');
    
    if (heroTitleLine2) {
        const originalText = heroTitleLine2.textContent;
        heroTitleLine2.style.opacity = '0';
        
        setTimeout(() => {
            heroTitleLine2.style.opacity = '1';
        }, 1000);
    }

    // ============================================
    // PRELOAD CRITICAL IMAGES
    // ============================================
    const preloadImage = (src) => {
        const img = new Image();
        img.src = src;
    };

    // Preload hero background
    const heroImg = document.querySelector('.hero__bg-img');
    if (heroImg) {
        preloadImage(heroImg.src);
    }

    // ============================================
    // SCROLL PROGRESS INDICATOR (OPTIONAL)
    // ============================================
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--gold) 0%, var(--bordeaux) 100%);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
    };

    createScrollProgress();

    // ============================================
    // PERFORMANCE: DEBOUNCE SCROLL EVENTS
    // ============================================
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Apply debounce to heavy scroll handlers if needed
    // (Already using passive: true for better performance)

    console.log('🍷 SCARTO Winery - Landing Page Loaded Successfully');
});
