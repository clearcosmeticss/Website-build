/**
 * CLEARCOSMETICS - PREMIUM INTERACTIONS
 * Smooth, polished, expensive-feeling
 */

(function() {
    'use strict';

    // Mobile Menu
    const navToggle = document.getElementById('nav-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');

    function openMenu() {
        menuOverlay.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus trap: focus the close button
        setTimeout(() => {
            menuClose.focus();
        }, 100);

        // Trap focus within menu
        trapFocus(menuOverlay);
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to toggle button
        navToggle.focus();
    }

    // Focus trap helper
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (menuOverlay.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // Hide/Show Nav on Scroll
    const nav = document.getElementById('main-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMenu();

                const offsetTop = target.offsetTop - 72;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Floating Button Pulse
    const floatingBook = document.getElementById('floating-book');
    if (floatingBook) {
        setInterval(() => {
            floatingBook.style.animation = 'none';
            setTimeout(() => {
                floatingBook.style.animation = '';
            }, 10);
        }, 15000);
    }

    // Touch Feedback
    document.querySelectorAll('.btn, .treatment-card, .result-card').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.opacity = '0.85';
        }, { passive: true });

        el.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, { passive: true });

        el.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        }, { passive: true });
    });

    // Prevent Double-Tap Zoom (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    console.log('✨ ClearCosmetics Premium loaded');

})();
