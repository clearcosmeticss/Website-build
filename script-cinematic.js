/**
 * CLEARCOSMETICS - CINEMATIC EXPERIENCE
 * Mobile-First Interactions
 */

(function() {
    'use strict';

    // ============================================
    // 1. MOBILE MENU
    // ============================================

    const navToggle = document.getElementById('nav-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');

    function openMenu() {
        menuOverlay.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
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

    // Close menu when link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // ============================================
    // 2. HIDE/SHOW NAV ON SCROLL
    // ============================================

    const nav = document.getElementById('main-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past 100px
            nav.classList.add('hidden');
        } else {
            // Scrolling up
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
    });

    // ============================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignore empty hrefs
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Close menu if open
                closeMenu();

                // Smooth scroll to target
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 4. FLOATING BOOK BUTTON PULSE
    // ============================================

    const floatingBookBtn = document.getElementById('floating-book');

    if (floatingBookBtn) {
        // Pulse every 10 seconds
        setInterval(() => {
            floatingBookBtn.classList.add('pulse');
            setTimeout(() => {
                floatingBookBtn.classList.remove('pulse');
            }, 2000);
        }, 10000);
    }

    // ============================================
    // 5. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class (add to HTML where needed)
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // 6. TREATMENT CAROUSEL SNAP INDICATORS
    // ============================================

    const treatmentsCarousel = document.querySelector('.treatments-carousel');

    if (treatmentsCarousel) {
        // Optional: Add scroll indicators or pagination
        // (Implementation depends on desired UX)
    }

    // ============================================
    // 7. TOUCH-FRIENDLY ACTIVE STATES
    // ============================================

    // Add active class on touchstart for better mobile feedback
    document.querySelectorAll('.btn, .treatment-card, .result-item').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        }, { passive: true });

        el.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, { passive: true });

        el.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        }, { passive: true });
    });

    // ============================================
    // 8. LAZY LOAD IMAGES (NATIVE + FALLBACK)
    // ============================================

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src; // Trigger loading
        });
    } else {
        // Fallback for older browsers
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ============================================
    // 9. PREVENT ZOOM ON DOUBLE-TAP (iOS)
    // ============================================

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // ============================================
    // 10. PERFORMANCE MONITORING (OPTIONAL)
    // ============================================

    if ('performance' in window && 'PerformanceObserver' in window) {
        // Log Largest Contentful Paint
        const lcp = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcp.observe({ entryTypes: ['largest-contentful-paint'] });

        // Log Cumulative Layout Shift
        let clsValue = 0;
        const cls = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        });
        cls.observe({ entryTypes: ['layout-shift'] });
    }

    // ============================================
    // 11. SERVICE WORKER (OPTIONAL - FOR PWA)
    // ============================================

    if ('serviceWorker' in navigator) {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(() => console.log('Service Worker registered'))
        //     .catch(err => console.error('Service Worker registration failed:', err));
    }

    // ============================================
    // 12. ANALYTICS (VERCEL ANALYTICS)
    // ============================================

    // Vercel Analytics is loaded via package.json dependency
    // Track custom events as needed:
    function trackEvent(name, properties) {
        if (window.va) {
            window.va('track', name, properties);
        }
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
        if (scrollPercentage > maxScrollDepth) {
            maxScrollDepth = Math.floor(scrollPercentage / 25) * 25; // Track in 25% increments
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }, { passive: true });

    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('cta_click', {
                text: btn.textContent.trim(),
                location: btn.closest('section')?.className || 'unknown'
            });
        });
    });

    console.log('🎬 ClearCosmetics Cinematic Experience loaded');

})();
