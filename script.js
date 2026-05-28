// ClearCosmetics Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization...');
    console.log('User Agent:', navigator.userAgent);

    // Initialize all components with error handling
    try {
        initNavigation();
        console.log('✓ Navigation initialized');
    } catch (e) {
        console.error('❌ Navigation failed:', e);
    }

    try {
        initSliders();
        console.log('✓ Sliders initialized');
    } catch (e) {
        console.error('❌ Sliders failed:', e);
    }

    try {
        initChatbot();
        console.log('✓ Chatbot initialized');
    } catch (e) {
        console.error('❌ Chatbot failed:', e);
    }

    try {
        initAnimations();
        console.log('✓ Animations initialized');
    } catch (e) {
        console.error('❌ Animations failed:', e);
    }

    try {
        initFormHandling();
        console.log('✓ Form handling initialized');
    } catch (e) {
        console.error('❌ Form handling failed:', e);
    }

    try {
        initSmoothScrolling();
        console.log('✓ Smooth scrolling initialized');
    } catch (e) {
        console.error('❌ Smooth scrolling failed:', e);
    }

    try {
        initVideoPlayback();
        console.log('✓ Video playback initialized');
    } catch (e) {
        console.error('❌ Video playback failed:', e);
    }

    try {
        initWaitlistPopup();
        console.log('✓ Waitlist popup initialized');
    } catch (e) {
        console.error('❌ Waitlist popup failed:', e);
    }

    try {
        initTouchFeedback();
        console.log('✓ Touch feedback initialized');
    } catch (e) {
        console.error('❌ Touch feedback failed:', e);
    }

    try {
        initChatbotAssistantPopup();
        console.log('✓ Chatbot assistant initialized');
    } catch (e) {
        console.error('❌ Chatbot assistant failed:', e);
    }

    try {
        initHeroCarousel();
        console.log('✓ Hero carousel initialized');
    } catch (e) {
        console.error('❌ Hero carousel failed:', e);
    }

    try {
        initMiniVideo();
        console.log('✓ Mini video initialized');
    } catch (e) {
        console.error('❌ Mini video failed:', e);
    }

    try {
        initResultsSliderProper();
        console.log('✓ Results slider initialized');
    } catch (e) {
        console.error('❌ Results slider failed:', e);
    }

    console.log('All initialization attempts completed');

    // Mobile fallback - ensure basic functionality works
    setTimeout(() => {
        addMobileFallbacks();
    }, 100);

    // Immediate mobile fixes
    addImmediateMobileFixes();
});

// Mobile fallback functionality
function addMobileFallbacks() {
    console.log('Adding mobile fallbacks...');

    // Fallback for WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn, .whatsapp-enquiry-btn');
    whatsappButtons.forEach(button => {
        if (!button.onclick) {
            button.addEventListener('click', function(e) {
                console.log('WhatsApp button clicked:', this.href);
                if (this.href && this.href.includes('wa.me')) {
                    window.open(this.href, '_blank');
                }
            });
        }
    });

    // Fallback for form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm && !contactForm.dataset.fallbackAdded) {
        contactForm.dataset.fallbackAdded = 'true';
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission fallback triggered');

            // Get form data
            const name = document.getElementById('contact-name')?.value?.trim() || '';
            const email = document.getElementById('contact-email')?.value?.trim() || '';
            const phone = document.getElementById('contact-phone')?.value?.trim() || '';
            const treatment = document.getElementById('interested-treatment')?.value || '';
            const message = document.getElementById('contact-message')?.value?.trim() || '';

            if (!name || !email || !treatment || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Create WhatsApp message
            const whatsappMessage = `Hi ClearCosmetics! I'm interested in your treatments.

CONTACT DETAILS:
👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone || 'Not provided'}
💉 Interested Treatment: ${treatment}

MESSAGE:
${message}

Thank you!`;

            const whatsappUrl = `https://wa.me/353831622444?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    console.log('Mobile fallbacks added');
}

// Immediate mobile fixes - direct approach
function addImmediateMobileFixes() {
    console.log('Adding immediate mobile fixes...');

    // Fix all WhatsApp links
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        if (!link.onclick) {
            link.onclick = function(e) {
                e.preventDefault();
                window.location.href = this.href;
                return false;
            };
        }
    });

    // Fix enquiry buttons
    document.querySelectorAll('.btn[href*="wa.me"]').forEach(btn => {
        if (!btn.onclick) {
            btn.onclick = function(e) {
                e.preventDefault();
                window.location.href = this.href;
                return false;
            };
        }
    });

    // Fix treatment card links
    document.querySelectorAll('.treatment-card').forEach(card => {
        if (!card.onclick) {
            const link = card.querySelector('a') || card.querySelector('[href]');
            if (link) {
                card.style.cursor = 'pointer';
                card.onclick = function() {
                    window.location.href = link.href;
                };
            }
        }
    });

    // Fix any remaining buttons with href
    document.querySelectorAll('a, .btn').forEach(element => {
        if (element.href && !element.onclick) {
            element.onclick = function(e) {
                if (this.href) {
                    if (this.href.includes('wa.me')) {
                        e.preventDefault();
                        window.open(this.href, '_blank');
                        return false;
                    } else if (this.href.includes('#')) {
                        // Internal navigation - let it work normally
                        return true;
                    } else {
                        window.location.href = this.href;
                        return true;
                    }
                }
            };
        }
    });

    console.log('Immediate mobile fixes added');
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle with enhanced touch handling
    if (navToggle && navMenu) {
        // Prevent scrolling when menu is open
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Enhanced touch handling for mobile menu links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Add touch feedback
            link.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            link.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Slider functionality
function initSliders() {
    initTestimonialsCarousel();
}

// Old results slider removed - using newer implementation at end of file

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'grid' : 'none';
    });
}

function initTestimonialsCarousel() {
    if (testimonials.length > 0) {
        showTestimonial(0);

        // Auto-advance testimonials every 7 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 7000);
    }
}

// Chatbot functionality
function initChatbot() {
    // Dynamic pricing lookup function
    window.getPricingInfo = function(message) {
        // Define pricing structure based on current website
        const pricing = {
            botox: {
                single: { price: 200, description: '1 area' },
                three: { price: 250, description: '3 areas' },
                full: { price: 650, description: '5+ areas (Full Face)' },
                perUnit: 8
            },
            fillers: {
                lips_0_5ml: { price: 180, description: '0.5ml lip enhancement' },
                lips_0_7ml: { price: 210, description: '0.7ml lip enhancement' },
                chin_1ml: { price: 250, description: '1ml chin filler' },
                chin_jawline_2ml: { price: 375, description: '2ml chin & jawline package' }
            },
            packages: {
                contour_2ml: { price: 375, original: 500, savings: 125 },
                glow_3ml: { price: 500, original: 750, savings: 250 },
                sculpt_4ml: { price: 625, original: 1000, savings: 375 },
                elite_5ml: { price: 750, original: 1250, savings: 500 }
            }
        };

        // Botox pricing
        if (message.includes('botox') || message.includes('anti-wrinkle') || message.includes('wrinkle')) {
            if (message.includes('3 area') || message.includes('three area')) {
                return `Botox for 3 areas is €${pricing.botox.three.price}. This is our most popular option and includes forehead, frown lines, and crow's feet.`;
            }
            if (message.includes('single') || message.includes('1 area') || message.includes('one area')) {
                return `Single area Botox treatment is €${pricing.botox.single.price}. Additional units can be added at €${pricing.botox.perUnit} per unit.`;
            }
            if (message.includes('full face') || message.includes('5 area') || message.includes('full')) {
                return `Full Face Botox refresh (5+ areas) is €${pricing.botox.full.price}. This comprehensive treatment covers all major areas.`;
            }
            return `Botox pricing: Single area €${pricing.botox.single.price}, 3 areas €${pricing.botox.three.price}, Full face €${pricing.botox.full.price}. Additional units €${pricing.botox.perUnit} each.`;
        }

        // Filler pricing
        if (message.includes('lip') && message.includes('filler')) {
            if (message.includes('0.7') || message.includes('0.7ml')) {
                return `0.7ml lip enhancement is €${pricing.fillers.lips_0_7ml.price}. This is our standard lip enhancement package.`;
            }
            if (message.includes('0.5') || message.includes('0.5ml')) {
                return `0.5ml lip enhancement starts at €${pricing.fillers.lips_0_5ml.price}. For fuller results, we also offer 0.7ml at €${pricing.fillers.lips_0_7ml.price}.`;
            }
            return `Lip filler pricing: 0.5ml starts at €${pricing.fillers.lips_0_5ml.price}, 0.7ml is €${pricing.fillers.lips_0_7ml.price}. Final pricing depends on your desired results.`;
        }

        if (message.includes('chin') && message.includes('filler')) {
            if (message.includes('1ml') || message.includes('1 ml')) {
                return `1ml chin filler is €${pricing.fillers.chin_1ml.price}. This provides subtle chin enhancement and definition.`;
            }
            if (message.includes('2ml') || message.includes('jawline') || message.includes('contour')) {
                return `2ml chin & jawline package is €${pricing.fillers.chin_jawline_2ml.price}. This comprehensive treatment enhances both chin and jawline definition.`;
            }
            return `Chin filler pricing: 1ml chin enhancement €${pricing.fillers.chin_1ml.price}, 2ml chin & jawline package €${pricing.fillers.chin_jawline_2ml.price}.`;
        }

        if (message.includes('filler') && !message.includes('lip') && !message.includes('chin')) {
            return `Dermal filler pricing varies by area: Lips from €${pricing.fillers.lips_0_5ml.price} (0.5ml), Chin from €${pricing.fillers.chin_1ml.price} (1ml), Chin & Jawline package €${pricing.fillers.chin_jawline_2ml.price} (2ml).`;
        }

        // Package pricing
        if (message.includes('package') || message.includes('deal')) {
            return `We offer volume packages: The Contour💉 (2ml) €${pricing.packages.contour_2ml.price}, The Glow✨ (3ml) €${pricing.packages.glow_3ml.price}, The Sculpt💎 (4ml) €${pricing.packages.sculpt_4ml.price}, The Elite👑 (5ml) €${pricing.packages.elite_5ml.price}. All packages include significant savings!`;
        }

        // General pricing
        return 'Our pricing is transparent and competitive. Botox starts from €200, lip fillers from €180, chin fillers from €250. We offer free consultations to discuss costs based on your individual treatment plan.';
    };

    // Async availability checking function
    window.checkAvailabilityAsync = function(message) {
        // Try to get Fresha links from the page
        const dublinLink = getFreshaLink('dublin');
        const marbellaLink = getFreshaLink('marbella');

        if (dublinLink || marbellaLink) {
            // If we have Fresha links, try to fetch availability
            fetchFreshaAvailability(dublinLink, marbellaLink)
                .then(availability => {
                    if (availability) {
                        addBotResponse(availability);
                    } else {
                        addBotResponse(getDefaultEnquiryMessage());
                    }
                })
                .catch(() => {
                    addBotResponse(getDefaultEnquiryMessage());
                });
        } else {
            // No Fresha links found, simulate availability
            const nextSlot = getNextAvailableSlot();
            if (nextSlot) {
                const availabilityMessage = `We are next available from ${nextSlot.start} - ${nextSlot.end}. You can contact us via email or WhatsApp to secure your appointment.`;
                addBotResponse(availabilityMessage);
            } else {
                addBotResponse(getDefaultEnquiryMessage());
            }
        }
    };

    // Helper function to find Fresha links on the page
    function getFreshaLink(location) {
        const links = document.querySelectorAll('a[href*="fresha"]');
        for (let link of links) {
            const href = link.getAttribute('href');
            const text = link.textContent.toLowerCase();
            if (text.includes(location.toLowerCase()) && href && !href.includes('[Your Fresha')) {
                return href;
            }
        }
        return null;
    }

    // Function to fetch availability from Fresha
    async function fetchFreshaAvailability(dublinLink, marbellaLink) {
        try {
            // Note: This is a simplified example. Real Fresha API integration would require:
            // 1. Fresha API credentials
            // 2. Proper CORS handling
            // 3. Authentication tokens

            // For now, we'll simulate availability checking
            // In a real implementation, you would:
            // - Extract business ID from Fresha URL
            // - Call Fresha's availability API
            // - Parse the response for next available dates

            // Simulated availability response (replace with real API call)
            const nextAvailableDate = getNextAvailableSlot();

            if (nextAvailableDate) {
                return `We are next available from ${nextAvailableDate.start} - ${nextAvailableDate.end}. Contact us via email or WhatsApp to secure your appointment.`;
            }

            return null;
        } catch (error) {
            console.log('Error fetching availability:', error);
            return null;
        }
    }

    // Simulated function to get next available slot
    // Replace this with actual Fresha API integration
    function getNextAvailableSlot() {
        const today = new Date();
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 2); // Next available in 2 days

        const endDate = new Date(nextDate);
        endDate.setDate(nextDate.getDate() + 2); // Available for 2 days

        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return {
            start: nextDate.toLocaleDateString('en-US', options),
            end: endDate.toLocaleDateString('en-US', options)
        };
    }

    // Default enquiry message when availability can't be fetched
    function getDefaultEnquiryMessage() {
        return 'You can contact us for consultation and booking through email or WhatsApp. We typically have appointments available within 2-3 days and offer free consultations to discuss your goals.';
    }

    // Helper function to add bot response to chat
    function addBotResponse(response) {
        const messages = document.getElementById('chatbot-messages');
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'bot-message';
            botDiv.innerHTML = `<p>${response}</p>`;
            messages.appendChild(botDiv);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    };

    // Intelligent keyword matching system
    window.findBestResponse = function(userMessage) {
        const message = userMessage.toLowerCase();

        // Duration/How Long questions
        if ((message.includes('how long') || message.includes('duration') || message.includes('last')) &&
            (message.includes('filler') || message.includes('botox') || message.includes('treatment'))) {
            if (message.includes('botox') || message.includes('anti-wrinkle') || message.includes('wrinkle')) {
                return 'Botox results typically last 3-4 months. Individual results may vary based on metabolism, muscle activity, and lifestyle factors.';
            }
            if (message.includes('filler') || message.includes('dermal') || message.includes('lip') || message.includes('cheek') || message.includes('chin')) {
                return 'Dermal filler results typically last 9-12 months, depending on the product used, treatment area, and individual metabolism. Lip fillers may last 6-9 months due to increased movement.';
            }
        }

        // Pain/Discomfort questions
        if (message.includes('hurt') || message.includes('pain') || message.includes('painful') || message.includes('sore')) {
            if (message.includes('botox')) {
                return 'Botox injections involve minimal discomfort, often described as a small pinch. Most clients find the treatment very tolerable and no anesthesia is needed.';
            }
            if (message.includes('filler')) {
                return 'Most clients find filler treatments very comfortable. We use topical numbing cream and many fillers contain lidocaine for additional comfort during injection.';
            }
            return 'Our treatments are designed to be as comfortable as possible. We use numbing creams and advanced techniques to minimize any discomfort.';
        }

        // Pricing questions with dynamic lookup
        if (message.includes('cost') || message.includes('price') || message.includes('expensive') || message.includes('cheap') || message.includes('much')) {
            return getPricingInfo(message);
        }

        // Age/Suitability questions
        if (message.includes('old enough') || message.includes('age') || message.includes('young') || message.includes('minimum')) {
            return 'We treat clients 18 years and older. We believe in enhancing natural beauty at any age and tailor treatments to individual needs and goals.';
        }

        // Results/When questions
        if (message.includes('when') || message.includes('results') || message.includes('see')) {
            if (message.includes('botox')) {
                return 'Botox results begin to show within 3-5 days, with full effects visible within 10-14 days.';
            }
            if (message.includes('filler')) {
                return 'Filler results are immediately visible, though final results are best appreciated after 2 weeks once any swelling has completely resolved.';
            }
        }

        // Safety/Side effects
        if (message.includes('safe') || message.includes('side effect') || message.includes('risk') || message.includes('dangerous')) {
            return 'Our treatments are very safe when performed by qualified practitioners. Common side effects include mild swelling, bruising, or redness that typically resolves within 2-7 days.';
        }

        // Booking/Consultation/Availability
        if (message.includes('book') || message.includes('appointment') || message.includes('consultation') || message.includes('schedule') ||
            message.includes('available') || message.includes('availability') || message.includes('next') || message.includes('when can')) {

            // Check if it's specifically asking for availability
            if (message.includes('available') || message.includes('availability') || message.includes('next') || message.includes('when can')) {
                checkAvailabilityAsync(message);
                return 'Let me check our availability for you...';
            } else {
                return 'You can contact us for consultations through email or WhatsApp. We offer free consultations to discuss your goals and create a personalized treatment plan.';
            }
        }

        // Location questions
        if (message.includes('where') || message.includes('location') || message.includes('dublin') || message.includes('marbella')) {
            return 'We have clinics in both Dublin, Ireland and Marbella, Spain. Both locations offer the full range of our premium aesthetic treatments.';
        }

        // First time/beginner questions
        if (message.includes('first time') || message.includes('beginner') || message.includes('never had') || message.includes('new to')) {
            return 'Perfect! We love working with first-time clients. We\'ll start with a thorough consultation to understand your goals and recommend the best treatment approach for you.';
        }

        // Try exact match as fallback
        for (const [key, value] of Object.entries(window.chatbotResponses)) {
            if (message.includes(key)) {
                return value;
            }
        }

        return null; // No match found
    };

    window.chatbotResponses = {
        // Original questions
        'how long does botox last': 'Botox typically lasts 3-4 months. Results vary by individual, but most clients see optimal results for about 3 months before gradually returning to baseline.',
        'is filler painful': 'Most clients find filler treatments very comfortable. We use topical numbing cream and many fillers contain lidocaine. Any discomfort is minimal and brief.',
        'what\'s recovery like': 'Recovery is minimal for most treatments. You may have slight swelling or bruising for 1-3 days. Most clients return to normal activities immediately.',
        'how much does treatment cost': 'Treatment costs vary by type and amount needed. Please contact us for personalized pricing. We offer packages and payment plans.',
        'are treatments safe': 'Yes, all our treatments are FDA-approved and performed by qualified professionals. We prioritize safety and natural-looking results.',
        'how often should i get treatments': 'This varies by treatment type and individual goals. Botox: every 3-4 months, Fillers: 12-18 months, Skin boosters: every 6 months.',
        'do you offer consultations': 'Yes! We offer complimentary consultations at both our Dublin and Marbella clinics. Contact us via email or WhatsApp to discuss your goals.',
        'what makes you different': 'We specialize in natural, subtle enhancements. Our international expertise, premium locations, and personalized approach set us apart.',

        // General/Contact/Safety
        'how do i book': 'You can contact us via email at Clearcosmeticss@gmail.com or WhatsApp at (+353) 83 162 2444. We offer consultations at our Dublin and Marbella clinics.',
        'where are you located': 'We have clinics in Dublin, Ireland and Marbella, Spain. Both locations offer the full range of our treatments with the same high standards.',
        'do you have payment plans': 'Yes, we offer flexible payment plans and package deals. Discuss payment options during your consultation to find what works best for you.',
        'what qualifications do you have': 'Our practitioners are fully qualified medical professionals with extensive training in aesthetic procedures. We maintain the highest safety and professional standards.',
        'are your treatments regulated': 'Yes, all our treatments use only approved products and are performed according to strict medical guidelines and safety protocols.',
        'what if i\'m not happy': 'We offer a satisfaction guarantee. If you\'re not happy with your results, we\'ll work with you to address any concerns and find the best solution.',

        // Dermal Fillers
        'what are dermal fillers': 'Dermal fillers are injectable gels made from hyaluronic acid that restore volume, smooth lines, and enhance facial features naturally.',
        'how long do fillers last': 'Most dermal fillers last 9-12 months, though this can vary by individual metabolism, area treated, and product used.',
        'can fillers be reversed': 'Yes, hyaluronic acid fillers can be dissolved using hyaluronidase if needed. This is a safe procedure that can reverse unwanted results.',
        'what areas can be treated with fillers': 'We treat lips, cheeks, nasolabial folds, marionette lines, chin, jawline, and under-eye areas. Each area requires specific techniques and products.',
        'do fillers look natural': 'When done expertly, fillers look completely natural. Our philosophy is subtle enhancement that maintains your unique features.',
        'can i get fillers while pregnant': 'We don\'t recommend cosmetic treatments during pregnancy or breastfeeding as a precautionary measure.',

        // Botox/Anti-Wrinkle
        'what is botox': 'Botox is a purified protein that temporarily relaxes muscles responsible for dynamic wrinkles, creating smoother, younger-looking skin.',
        'does botox hurt': 'Most clients find Botox very comfortable. The needles are very fine, and the procedure is quick. Any discomfort is minimal and brief.',
        'when will i see botox results': 'You\'ll start seeing results within 3-5 days, with full effects visible after 10-14 days. Results gradually improve over the first two weeks.',
        'can botox go wrong': 'When performed by qualified professionals, complications are extremely rare. We use precise techniques to ensure natural, safe results.',
        'what areas can botox treat': 'We treat forehead lines, frown lines, crow\'s feet, bunny lines, lip lines, and can also do brow lifts and jaw slimming.',
        'will botox make me look frozen': 'No, when done correctly. We aim for natural movement with reduced wrinkles, not a frozen appearance. Technique and dosage are key.',

        // Fat Dissolving
        'what is fat dissolving': 'Fat dissolving injections use deoxycholic acid to permanently destroy fat cells in targeted areas like double chins and jowls.',
        'how many fat dissolving sessions': 'Most clients need 2-4 sessions spaced 6-8 weeks apart for optimal results. This varies by individual and area treated.',
        'is fat dissolving permanent': 'Yes, the fat cells destroyed during treatment are permanently eliminated. However, remaining fat cells can still enlarge with weight gain.',
        'what areas can be treated': 'We primarily treat double chins and jowls. Other small areas of stubborn fat may also be suitable - discuss during consultation.',
        'fat dissolving side effects': 'Temporary swelling, bruising, and numbness are common. These typically resolve within 1-2 weeks.',

        // Skin Boosters
        'what are skin boosters': 'Skin boosters are injectable treatments that deeply hydrate skin using hyaluronic acid, improving texture, tone, and overall skin quality.',
        'how often skin boosters': 'Initial course is typically 3 sessions 4 weeks apart, then maintenance every 6-9 months for optimal skin health.',
        'profhilo vs other skin boosters': 'Profhilo spreads more widely under the skin and requires fewer injection points. We\'ll recommend the best option for your skin type.',
        'can skin boosters help acne scars': 'Yes, certain skin boosters can improve the appearance of mild acne scarring by improving skin texture and hydration.',
        'skin boosters on face and neck': 'Yes, we can treat both face and neck. The neck area often shows excellent improvement in skin quality and hydration.',

        // Polynucleotides
        'what are polynucleotides': 'Polynucleotides are advanced injectables that stimulate skin regeneration, improve elasticity, and promote natural healing processes.',
        'polynucleotides vs fillers': 'Polynucleotides work by regenerating skin from within rather than adding volume. They\'re excellent for overall skin quality improvement.',
        'how long do polynucleotides last': 'Results typically last 6-9 months. Some clients see ongoing improvements for up to a year as the skin continues to regenerate.',
        'polynucleotides for under eyes': 'Yes, polynucleotides are excellent for under-eye area, improving skin quality, reducing fine lines, and addressing dark circles.',

        // Filler Dissolving
        'why dissolve fillers': 'Fillers may be dissolved if you\'re unhappy with results, experiencing complications, or want to start fresh with a new treatment plan.',
        'how long to dissolve fillers': 'Hyaluronidase works quickly - you\'ll see results within 24-48 hours, with full dissolution typically complete within a week.',
        'does dissolving hurt': 'Similar to getting fillers - some discomfort but generally well-tolerated. We use topical numbing to minimize any discomfort.',
        'can all fillers be dissolved': 'Only hyaluronic acid fillers can be dissolved with hyaluronidase. Other types of fillers cannot be reversed.',

        // Packages/Pricing
        'do you offer package deals': 'Yes, we offer various packages combining treatments for better value. Popular options include full face rejuvenation and maintenance packages.',
        'membership benefits': 'Our ClearClub membership includes priority access, exclusive discounts, special member events, and personalized treatment plans.',
        'price matching': 'We focus on providing the best quality and service rather than competing on price alone. Our pricing reflects our expertise and premium service.',
        'consultation fee': 'We offer complimentary consultations where we assess your needs and create a personalized treatment plan with transparent pricing.',

        // Practical/Aftercare
        'what should i avoid after treatment': 'Avoid exercise, alcohol, excessive heat (saunas/sun), and touching the treated area for 24-48 hours post-treatment.',
        'can i wear makeup after': 'Generally yes, but wait 4-6 hours for Botox and filler treatments. We\'ll provide specific aftercare instructions for your treatment.',
        'when can i exercise': 'Wait 24-48 hours before resuming exercise to minimize swelling and ensure optimal results. Light activities are usually fine sooner.',
        'flying after treatment': 'Generally safe, but air pressure changes may increase swelling. If possible, wait 24-48 hours, especially for longer flights.',
        'sun exposure after treatment': 'Avoid direct sun exposure and always use SPF 30+ for 2 weeks post-treatment. Sun exposure can increase swelling and affect healing.',

        // Complications
        'what if i get lumps': 'Small lumps can be normal initially but should be assessed. Contact us immediately if you notice any unusual swelling or lumps.',
        'allergic reaction signs': 'Severe swelling, rash, difficulty breathing, or widespread reaction. Seek immediate medical attention for any severe symptoms.',
        'treatment not working': 'Results vary by individual. If you\'re not seeing expected results, contact us for a follow-up consultation to assess and adjust your treatment plan.',
        'asymmetry after treatment': 'Minor asymmetry can occur initially due to swelling. If it persists after healing, we can assess and make adjustments.',

        // Men/Special Markets
        'treatments for men': 'Absolutely! We treat many male clients. Popular treatments include jawline enhancement, under-eye bags, and subtle anti-aging procedures.',
        'male botox areas': 'Common areas for men include forehead, frown lines, crow\'s feet, and masseter muscles for jaw slimming. We maintain masculine features.',
        'discrete treatments': 'We understand the need for discretion. Our treatments are subtle, and we can schedule appointments to ensure privacy.',
        'first time male client': 'We\'ll start with a thorough consultation to understand your goals and recommend conservative treatments that maintain your masculine features.'
    };

    window.toggleChat = function() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.classList.toggle('active');
        }
    };

    window.sendMessage = function() {
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chatbot-messages');
        const userMessage = input.value.trim().toLowerCase();

        if (userMessage) {
            // Add user message
            const userDiv = document.createElement('div');
            userDiv.className = 'user-message';
            userDiv.innerHTML = `<p style="background: #222; color: white; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1rem; margin-left: 2rem;">${input.value}</p>`;
            messages.appendChild(userDiv);

            // Find matching response using intelligent keyword matching
            let response = findBestResponse(userMessage);
            if (!response) {
                response = "I'd be happy to help! For specific questions about treatments, pricing, or consultations, please contact us directly via email or WhatsApp. Our team can provide personalized advice for your needs.";
            }


            // Add bot response after a short delay
            addBotResponse(response);

            input.value = '';
            messages.scrollTop = messages.scrollHeight;
        }
    };

    // Allow Enter key to send message
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation to elements
    const animatedElements = document.querySelectorAll('.treatment-card, .testimonial-slide, .location-card, .enquiry-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats (if added later)
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Contact Form Submission
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
}

function handleContactFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Get form data
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const treatment = document.getElementById('interested-treatment').value;
    const message = document.getElementById('contact-message').value.trim();

    // Validate required fields
    if (!name || !email || !treatment || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Create WhatsApp message with all the form data
    const whatsappMessage = `Hi ClearCosmetics! I'm interested in your treatments.

CONTACT DETAILS:
👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone || 'Not provided'}
💉 Interested Treatment: ${treatment}

MESSAGE:
${message}

Thank you for your time!

Best regards,
${name}`;

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/353831622444?text=${encodeURIComponent(whatsappMessage)}`;

    // Small delay for better UX, then redirect
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');

        // Reset form and button
        form.reset();
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;

        showNotification('Redirecting you to WhatsApp with your information pre-filled!', 'success');
    }, 1000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.8;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Lazy loading for images (when actual images are added)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Add loading animation for buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const btn = e.target;
        const originalText = btn.textContent;

        // Don't add loading to navigation, simple links, or contact form
        if (btn.href && (btn.href.includes('#') || btn.href.includes('http'))) {
            return;
        }

        // Don't interfere with contact form (mailto handles it)
        if (btn.closest('.contact-form-mailto')) {
            return;
        }

        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        `;
        loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        btn.appendChild(loadingOverlay);

        // Remove loading after 2 seconds (adjust based on actual loading time)
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 2000);
    }
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.enquiry-card, .location-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based animations or effects
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const chatbot = document.getElementById('chatbot');

        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        if (chatbot && chatbot.classList.contains('active')) {
            chatbot.classList.remove('active');
        }
    }
});

// Add focus management for better accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.getElementById('chatbot');

    if (modal) {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableContent = modal.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
});

// Video playback control based on scroll position
function initVideoPlayback() {
    const video = document.getElementById('hero-treatment-video');
    if (!video) return;

    // Function to check if video is in viewport
    function isVideoInViewport() {
        const rect = video.getBoundingClientRect();
        const videoHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Check if any part of the video is visible
        return rect.top < windowHeight && rect.bottom > 0;
    }

    // Function to handle video play/pause
    function handleVideoPlayback() {
        if (isVideoInViewport()) {
            // Video is in viewport, play it
            video.play().catch(e => {
                // Handle autoplay policy restrictions
                console.log('Video autoplay prevented:', e);
            });
        } else {
            // Video is out of viewport, pause it
            video.pause();
        }
    }

    // Throttle function for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Add scroll event listener with throttling
    const throttledScrollHandler = throttle(handleVideoPlayback, 100);
    window.addEventListener('scroll', throttledScrollHandler);

    // Initial check when page loads
    handleVideoPlayback();

    // Handle video load event
    video.addEventListener('loadeddata', function() {
        handleVideoPlayback();
    });
}

// Waitlist popup functionality
function initWaitlistPopup() {
    const waitlistButton = document.querySelector('a[href="#waitlist"]');
    const popup = document.getElementById('waitlist-popup');
    const closeButton = document.querySelector('.waitlist-popup-close');
    const form = document.getElementById('waitlist-form');

    // Open popup when waitlist button is clicked
    if (waitlistButton) {
        waitlistButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (popup) {
                popup.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                resetForm(); // Reset form when opening
            }
        });
    }

    // Close popup when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closePopup();
        });
    }

    // Close popup when clicking outside the content
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup && popup.style.display === 'block') {
            closePopup();
        }
    });

    // Handle form submission (only for waitlist form)
    if (form && form.id === 'waitlist-form') {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }

    function closePopup() {
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    function resetForm() {
        const form = document.getElementById('waitlist-form');
        const successDiv = document.getElementById('waitlist-success');

        if (form && successDiv) {
            form.style.display = 'block';
            successDiv.style.display = 'none';
            form.reset();
        }
    }

    function handleFormSubmission() {
        const form = document.getElementById('waitlist-form');
        const submitButton = form.querySelector('.waitlist-submit');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');

        // Validate required fields
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        // Collect form data
        const formData = collectFormData();

        // Send to Google Sheets (you'll need to implement this)
        submitToGoogleSheets(formData)
            .then(function(success) {
                if (success) {
                    showSuccessMessage(formData.email);
                } else {
                    showErrorMessage();
                }
            })
            .catch(function(error) {
                console.error('Form submission error:', error);
                showErrorMessage();
            })
            .finally(function() {
                // Reset button state
                submitButton.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            });
    }
}

// Chatbot Assistant Popup functionality
function initChatbotAssistantPopup() {
    const popup = document.getElementById('chatbot-assistant-popup');
    if (!popup) {
        console.log('Chatbot popup element not found');
        return;
    }

    console.log('Chatbot popup initialized');

    // Clear any previous dismissal for testing
    localStorage.removeItem('chatbot-popup-dismissed');

    // Show popup after a delay when page loads
    setTimeout(() => {
        console.log('Showing chatbot popup');
        showChatbotPopup();
    }, 2000); // Show after 2 seconds

    // Auto-hide after some time if not closed manually
    setTimeout(() => {
        console.log('Auto-hiding chatbot popup');
        hideChatbotPopup();
    }, 10000); // Hide after 10 seconds

    // Show popup again when chatbot button is hovered
    const chatbotBtn = document.querySelector('.chatbot-btn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('mouseenter', () => {
            showChatbotPopup();
        });

        chatbotBtn.addEventListener('click', () => {
            hideChatbotPopup();
        });
    }

    // Hide popup when clicking anywhere on it
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hideChatbotPopup();
        }
    });
}

// Show chatbot popup
function showChatbotPopup() {
    const popup = document.getElementById('chatbot-assistant-popup');
    if (popup) {
        console.log('Adding show class to popup');
        popup.classList.add('show');
        popup.style.display = 'block'; // Force display
    }
}

// Hide chatbot popup
function hideChatbotPopup() {
    const popup = document.getElementById('chatbot-assistant-popup');
    if (popup) {
        console.log('Removing show class from popup');
        popup.classList.remove('show');
        // Remember that user dismissed the popup
        localStorage.setItem('chatbot-popup-dismissed', 'true');
    }
}

// Hero Carousel functionality
let currentSlideIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function initHeroCarousel() {
    if (heroSlides.length === 0) return;

    // Start auto-play
    startSlideShow();

    // Pause on hover
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);

        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideShow();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideShow();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    changeSlide(-1); // Previous slide
                } else {
                    changeSlide(1); // Next slide
                }
            }
        }
    }
}

function showSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlideIndex = index;
}

function changeSlide(direction) {
    currentSlideIndex += direction;

    if (currentSlideIndex >= heroSlides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = heroSlides.length - 1;
    }

    showSlide(currentSlideIndex);
}

function goToSlide(index) {
    showSlide(index - 1);
}

function nextSlide() {
    changeSlide(1);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Rectangular Video functionality
function initMiniVideo() {
    const videoContainer = document.querySelector('.hero-video-container');
    const rectVideo = document.querySelector('.hero-rect-video');
    const video = document.querySelector('.rect-treatment-video');
    const playOverlay = document.querySelector('.video-play-overlay');

    if (videoContainer && video && playOverlay) {
        // Set video properties for mobile compatibility
        video.muted = true;
        video.autoplay = false;
        video.loop = true;
        video.preload = 'metadata';
        video.playsInline = true; // Critical for iOS
        video.setAttribute('webkit-playsinline', 'true'); // iOS Safari
        video.setAttribute('x5-playsinline', 'true'); // Android WeChat

        // Initially pause the video and show overlay
        video.pause();
        playOverlay.style.display = 'flex';
        playOverlay.style.opacity = '1';

        // Enhanced touch and click handling for mobile
        function handleVideoClick(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Video container interaction');
            console.log('Video paused status:', video.paused);
            console.log('Video ready state:', video.readyState);
            toggleVideoPlayback(video, playOverlay, rectVideo);
        }

        // Add both click and touch events for better mobile support
        videoContainer.addEventListener('click', handleVideoClick);
        videoContainer.addEventListener('touchend', handleVideoClick);

        // Prevent touch scrolling on video area
        videoContainer.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: false });

        videoContainer.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        // Video ended event - show play button again
        video.addEventListener('ended', function() {
            showPlayOverlay(playOverlay, rectVideo);
        });

        // Video paused event - show play button
        video.addEventListener('pause', function() {
            if (!video.ended) {
                showPlayOverlay(playOverlay, rectVideo);
            }
        });

        // Video playing event - hide play button
        video.addEventListener('play', function() {
            hidePlayOverlay(playOverlay, rectVideo);
        });

        // Scroll detection to pause video
        let isScrolling = false;
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            if (!video.paused) {
                video.pause();
                isScrolling = true;

                // Clear previous timeout
                clearTimeout(scrollTimeout);

                // Set timeout to detect when scrolling stops
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 150);
            }
        }, { passive: true });

        // Add subtle pulse animation to draw attention
        setTimeout(() => {
            if (rectVideo && video.paused) {
                rectVideo.style.animation = 'rectVideoPulse 4s ease-in-out infinite';
            }
        }, 3000);

        // Ensure video is loaded
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded successfully');
            console.log('Video duration:', video.duration);
            console.log('Video ready state:', video.readyState);
        });

        video.addEventListener('loadeddata', function() {
            console.log('Video data loaded successfully');
        });

        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
        });

        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            console.error('Video error code:', video.error ? video.error.code : 'No error code');
            console.error('Video error message:', video.error ? video.error.message : 'No error message');
            // Hide play overlay if video fails to load
            playOverlay.style.display = 'none';
        });

        // Debug: Log video element details
        console.log('Video element found:', video);
        console.log('Video src:', video.src);
        console.log('Video current src:', video.currentSrc);
        console.log('Video network state:', video.networkState);
        console.log('Video ready state:', video.readyState);

        // Test if video source loads
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });

        video.addEventListener('progress', function() {
            console.log('Video loading progress');
        });

        video.addEventListener('suspend', function() {
            console.log('Video loading suspended');
        });

        video.addEventListener('abort', function() {
            console.log('Video loading aborted');
        });

        video.addEventListener('stalled', function() {
            console.log('Video loading stalled');
        });

        // Force load test after a delay
        setTimeout(() => {
            console.log('Testing video load after 2 seconds...');
            console.log('Video ready state after delay:', video.readyState);
            console.log('Video network state after delay:', video.networkState);

            if (video.readyState === 0) {
                console.log('Video not loaded - trying to force load...');
                video.load();
            }
        }, 2000);
    }
}

function toggleVideoPlayback(video, playOverlay, rectVideo) {
    console.log('toggleVideoPlayback called');
    console.log('Video paused:', video.paused);
    console.log('Video ready state:', video.readyState);
    console.log('Video network state:', video.networkState);
    console.log('Video src:', video.currentSrc || video.src);
    console.log('User agent:', navigator.userAgent);

    if (video.paused) {
        console.log('Attempting to play video...');

        // Force load the video if not loaded
        if (video.readyState < 2) {
            console.log('Video not ready, loading...');
            video.load();
        }

        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Video started playing successfully');
                })
                .catch(e => {
                    console.error('Error playing video:', e);
                    console.error('Error name:', e.name);
                    console.error('Error message:', e.message);

                    // Try alternative approach for mobile
                    setTimeout(() => {
                        try {
                            console.log('Trying alternative play method...');
                            video.muted = true;
                            video.play();
                        } catch (altError) {
                            console.error('Alternative play method also failed:', altError);
                            showPlayOverlay(playOverlay, rectVideo);
                        }
                    }, 100);
                });
        }
    } else {
        console.log('Pausing video...');
        video.pause();
    }
}

function hidePlayOverlay(playOverlay, rectVideo) {
    playOverlay.style.opacity = '0';
    setTimeout(() => {
        playOverlay.style.display = 'none';
    }, 300);

    // Stop pulse animation when playing
    if (rectVideo) {
        rectVideo.style.animation = 'none';
    }
}

function showPlayOverlay(playOverlay, rectVideo) {
    playOverlay.style.display = 'flex';
    playOverlay.style.opacity = '0';
    setTimeout(() => {
        playOverlay.style.opacity = '1';
    }, 50);

    // Restart pulse animation when paused
    if (rectVideo) {
        setTimeout(() => {
            rectVideo.style.animation = 'rectVideoPulse 4s ease-in-out infinite';
        }, 500);
    }
}

function createVideoModal(videoSrc) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.video-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <video controls autoplay>
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p class="video-modal-caption">Professional Treatment at ClearCosmetics</p>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    modal.querySelector('.video-modal-close').addEventListener('click', closeVideoModal);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

    function validateForm() {
        const form = document.getElementById('waitlist-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                field.style.borderColor = '#f44336';
                isValid = false;
            } else {
                field.style.borderColor = '#e9ecef';
            }
        });

        // Validate email format
        const emailField = form.querySelector('[name="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#f44336';
                isValid = false;
                showNotification('Please enter a valid email address.', 'error');
            }
        }

        if (!isValid) {
            showNotification('Please fill in all required fields correctly.', 'error');
        }

        return isValid;
    }

    function collectFormData() {
        const form = document.getElementById('waitlist-form');
        const formData = new FormData(form);

        // Collect checkbox values for interests
        const interests = [];
        const interestCheckboxes = form.querySelectorAll('[name="interests"]:checked');
        interestCheckboxes.forEach(function(checkbox) {
            interests.push(checkbox.value);
        });

        return {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
            interests: interests.join(', '),
            hearAbout: formData.get('hearAbout') || '',
            marketing: formData.get('marketing') ? 'Yes' : 'No',
            privacy: formData.get('privacy') ? 'Yes' : 'No',
            timestamp: new Date().toISOString()
        };
    }

    function showSuccessMessage(email) {
        const form = document.getElementById('waitlist-form');
        const successDiv = document.getElementById('waitlist-success');
        const emailSpan = document.getElementById('submitted-email');

        form.style.display = 'none';
        successDiv.style.display = 'block';
        if (emailSpan) {
            emailSpan.textContent = email;
        }
    }

    function showErrorMessage() {
        showNotification('There was an error submitting your form. Please try again.', 'error');
    }

    // Google Sheets submission function
    async function submitToGoogleSheets(data) {
        try {
            console.log('Submitting form data to Google Sheets:', data);

            const response = await fetch('https://script.google.com/macros/s/AKfycbw5_ZrQNbBsUynWmHDCvaJSyU9XNMe1bHLl7zQ_CNODxEA4wVDdtFp607pCDjHdKn1W/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // With no-cors mode, we can't read the response, so we assume success
            console.log('Form submitted successfully (no-cors mode)');
            return true;

        } catch (error) {
            console.error('Error submitting to Google Sheets:', error);

            // Try alternative method with form data
            try {
                console.log('Trying alternative submission method...');

                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });

                const alternativeResponse = await fetch('https://script.google.com/macros/s/AKfycbw5_ZrQNbBsUynWmHDCvaJSyU9XNMe1bHLl7zQ_CNODxEA4wVDdtFp607pCDjHdKn1W/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                console.log('Alternative submission completed');
                return true;

            } catch (alternativeError) {
                console.error('Alternative submission also failed:', alternativeError);
                return false;
            }
        }
    }

// Enhanced touch feedback for all interactive elements
function initTouchFeedback() {
    const interactiveElements = document.querySelectorAll('.btn, .sticky-btn, .book-btn, .whatsapp-btn, .chatbot-btn, .nav-link, .pricing-card, .package-card, .location-card, .testimonial-slide, .slide, .faq-item');

    interactiveElements.forEach(element => {
        // Touch start - immediate feedback
        element.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';

            // Add highlight effect for better visual feedback
            if (this.classList.contains('btn') || this.classList.contains('sticky-btn')) {
                this.style.opacity = '0.8';
            }
        }, { passive: true });

        // Touch end - restore original state
        element.addEventListener('touchend', function(e) {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
            this.style.opacity = '';
        }, { passive: true });

        // Touch cancel - restore original state
        element.addEventListener('touchcancel', function(e) {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
            this.style.opacity = '';
        }, { passive: true });

        // Prevent double tap zoom on buttons
        if (element.classList.contains('btn') || element.classList.contains('sticky-btn')) {
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
            });
        }
    });

    // Enhanced focus management for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');

    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Results slider system - separate from hero carousel
let currentResultSlide = 0;
const resultSlides = document.querySelectorAll('.result-slide');

function showResultSlide(index) {
    if (resultSlides.length === 0) return;

    resultSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    if (resultSlides.length === 0) return;
    currentResultSlide = (currentResultSlide + 1) % resultSlides.length;
    showResultSlide(currentResultSlide);
    console.log('Next slide:', currentResultSlide + 1, 'of', resultSlides.length);
}

function prevSlide() {
    if (resultSlides.length === 0) return;
    currentResultSlide = (currentResultSlide - 1 + resultSlides.length) % resultSlides.length;
    showResultSlide(currentResultSlide);
    console.log('Previous slide:', currentResultSlide + 1, 'of', resultSlides.length);
}

// Initialize results slider
function initResultsSliderProper() {
    console.log('Initializing results slider - found', resultSlides.length, 'slides');
    if (resultSlides.length > 0) {
        // Show first slide
        showResultSlide(0);
    }
}

// Make functions globally accessible
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

// Question Modal Functions
function openQuestionModal() {
    console.log('Opening question modal');
    const modal = document.getElementById('questionModal');
    const questionText = document.getElementById('questionText');
    const charCount = document.getElementById('charCount');

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Focus on textarea
        if (questionText) {
            setTimeout(() => questionText.focus(), 300);
        }

        // Setup character counter
        setupCharacterCounter();

        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuestionModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeQuestionModal();
            }
        });
    }
}

function closeQuestionModal() {
    console.log('Closing question modal');
    const modal = document.getElementById('questionModal');
    const questionText = document.getElementById('questionText');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Clear the textarea
        if (questionText) {
            questionText.value = '';
            updateCharacterCount();
        }
    }
}

function setupCharacterCounter() {
    const questionText = document.getElementById('questionText');
    const charCount = document.getElementById('charCount');

    if (questionText && charCount) {
        questionText.addEventListener('input', updateCharacterCount);
        updateCharacterCount(); // Initial count
    }
}

function updateCharacterCount() {
    const questionText = document.getElementById('questionText');
    const charCount = document.getElementById('charCount');

    if (questionText && charCount) {
        const count = questionText.value.length;
        charCount.textContent = count;

        // Change color when approaching limit
        if (count > 450) {
            charCount.style.color = '#ef4444'; // Red
        } else if (count > 400) {
            charCount.style.color = '#f59e0b'; // Orange
        } else {
            charCount.style.color = '#6b7280'; // Gray
        }
    }
}

function sendQuestionToWhatsApp() {
    const questionText = document.getElementById('questionText');
    const treatmentName = getTreatmentName();

    if (!questionText || !questionText.value.trim()) {
        alert('Please enter your question before sending.');
        return;
    }

    const question = questionText.value.trim();
    const whatsappNumber = '353831622444';

    // Create the message template
    const message = `Hi ClearCosmetics! I have a question about ${treatmentName}. My question is: ${question}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    console.log('Sending question to WhatsApp:', {
        treatment: treatmentName,
        question: question,
        url: whatsappUrl
    });

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Close modal
    closeQuestionModal();
}

function getTreatmentName() {
    // Get the treatment name from the page title or heading
    const pageTitle = document.title;
    const mainHeading = document.querySelector('h1');

    if (pageTitle && pageTitle.includes(' - ClearCosmetics')) {
        return pageTitle.split(' - ClearCosmetics')[0];
    } else if (mainHeading) {
        return mainHeading.textContent.trim();
    } else {
        return 'your treatments'; // Fallback
    }
}

// Make question modal functions globally accessible
window.openQuestionModal = openQuestionModal;
window.closeQuestionModal = closeQuestionModal;
window.sendQuestionToWhatsApp = sendQuestionToWhatsApp;