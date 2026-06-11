(function () {
    'use strict';

    const state = {
        step: 1,
        appointmentType: null,
        selectedTreatments: [],
        selectedDate: null,
        selectedTime: null,
        clientDetails: {
            name: '',
            email: '',
            phone: '',
            notes: ''
        }
    };

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        renderAppointmentTypes();
        renderTreatmentDropdown();
        renderPolicies();
        bindEvents();
        updateUI();
        setDefaultClinic();

        // No longer using Cal.com iframe - using custom calendar

        // Check if user is returning from successful payment
        checkPaymentReturn();
    }


    function checkPaymentReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            showPaymentSuccessConfirmation();
        }
    }

    function showPaymentSuccessConfirmation() {
        // Notify Service Worker that payment is completed
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'PAYMENT_COMPLETED'
            });
        }

        // Hide all booking steps
        document.querySelectorAll('.booking-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        // Show success message
        const successHtml = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #4caf50; margin-bottom: 24px;"></i>
                <h2 style="color: #222; margin-bottom: 16px;">🎉 Booking Confirmed!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 24px;">Your deposit payment has been processed successfully.</p>
                <p style="color: #666; margin-bottom: 32px;">You'll receive a confirmation email shortly with your appointment details.</p>

                <div style="background: #f5f5f5; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
                    <h4 style="margin: 0 0 16px 0; color: #222;">Next Steps:</h4>
                    <ul style="text-align: left; color: #666; line-height: 1.6;">
                        <li>Check your email for appointment confirmation</li>
                        <li>Save the appointment to your calendar</li>
                        <li>Prepare for your visit (bring ID)</li>
                        <li>Your deposit will be deducted from the final cost</li>
                    </ul>
                </div>

                <a href="book.html" style="background: #2196f3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                    Book Another Appointment
                </a>
            </div>
        `;

        const bookingMain = document.querySelector('.booking-main');
        if (bookingMain) {
            bookingMain.innerHTML = successHtml;
        }

        // Update page title
        document.title = 'Booking Confirmed - ClearCosmetics';
    }

    function setDefaultClinic() {
        // Set Dublin as default clinic for sidebar display
        setSummaryValue('summary-clinic', 'Dublin Clinic');
    }

    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            navMenu.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    function renderAppointmentTypes() {
        const container = document.getElementById('appointment-type-cards');
        if (!container) {
            console.error('appointment-type-cards container not found!');
            return;
        }

        console.log('Rendering appointment types into container:', container);

        // Test with simple content first
        container.innerHTML = `
            <button type="button" class="appointment-type-card" data-type="consultation">
                <div class="appointment-type-icon"><i class="fas fa-comments"></i></div>
                <div>
                    <h4>Free Consultation</h4>
                    <div class="duration">20 minutes</div>
                    <p>Discuss your goals, ask questions, and get a personalised treatment plan.</p>
                </div>
            </button>
            <button type="button" class="appointment-type-card" data-type="treatment">
                <div class="appointment-type-icon"><i class="fas fa-syringe"></i></div>
                <div>
                    <h4>Single Treatment</h4>
                    <div class="duration">20 minutes</div>
                    <p>Book one specific treatment. Perfect for touch-ups or single procedures.</p>
                </div>
            </button>
            <button type="button" class="appointment-type-card" data-type="multiple">
                <div class="appointment-type-icon"><i class="fas fa-magic"></i></div>
                <div>
                    <h4>Multiple Treatments</h4>
                    <div class="duration">40–60 minutes</div>
                    <p>Combine multiple treatments in one session for the best results and value.</p>
                </div>
            </button>
        `;

        // Hide treatment selection initially
        const treatmentGroup = document.getElementById('treatment-select-group');
        if (treatmentGroup) {
            treatmentGroup.style.display = 'none';
            console.log('Treatment selection hidden');
        }
    }

    function renderTreatmentDropdown() {
        const list = document.getElementById('treatment-list');
        if (!list) return;

        let currentCategory = '';
        let html = '';

        BOOKING_CONFIG.treatments.forEach(function (treatment, index) {
            // Determine category based on treatment name
            let category = '';
            if (treatment.includes('Polynucleotides')) {
                category = 'Polynucleotides';
            } else if (treatment.includes('Lip Enhancement') || treatment.includes('Smile Line') ||
                treatment.includes('Marionnette') || treatment.includes('Nasolabial') ||
                treatment.includes('Under-Eye') || treatment.includes('Five Point') ||
                treatment.includes('Non-Surgical Rhinoplasty') || treatment.includes('Dermal Filler Dissolving')) {
                category = 'Dermal Fillers';
            } else if (treatment.includes('Botox') || treatment.includes('Nostril') ||
                      treatment.includes('Bunny') || treatment.includes('Jowls') ||
                      treatment.includes('Lip Flip') || treatment.includes('Neck Botox') ||
                      treatment.includes('Trap') || treatment.includes('Buttock') ||
                      treatment.includes('Masseter') || treatment.includes('Hyperhydrosis')) {
                category = 'Botox';
            } else if (treatment.includes('Fat Dissolving')) {
                category = 'Fat Dissolving';
            } else if (treatment.includes('Profhilo') || treatment.includes('Seventy') ||
                      treatment.includes('B12') || treatment.includes('Lumi')) {
                category = 'Skin Boosters';
            } else if (treatment.includes('Package') || treatment.includes('ml Dermal Filler')) {
                category = 'Package Deals';
            } else {
                category = 'Consultation';
            }

            // Add category header if it's a new category
            if (category !== currentCategory) {
                if (currentCategory !== '') {
                    html += '<div style="height: 8px;"></div>'; // Spacer
                }
                html += '<div class="treatment-category">' + category + '</div>';
                currentCategory = category;
            }

            // Get pricing
            const pricing = BOOKING_CONFIG.pricing.treatment[treatment];
            const priceText = pricing ? '€' + pricing.price : '';

            html += (
                '<div class="treatment-option" data-treatment="' + treatment + '">' +
                    '<span class="treatment-name">' + treatment + '</span>' +
                    (priceText ? '<span class="treatment-price">' + priceText + '</span>' : '') +
                '</div>'
            );
        });

        list.innerHTML = html;
    }

    function renderPolicies() {
        const list = document.getElementById('booking-policies');
        if (!list) return;

        list.innerHTML = BOOKING_CONFIG.policies.map(function (policy) {
            return '<li><i class="fas fa-check-circle"></i><span>' + policy + '</span></li>';
        }).join('');
    }

    function bindEvents() {
        // Appointment type selection
        document.getElementById('appointment-type-cards').addEventListener('click', function (e) {
            const card = e.target.closest('[data-type]');
            if (!card) return;
            selectAppointmentType(card.dataset.type);
        });

        // Treatment dropdown
        const dropdown = document.getElementById('treatment-dropdown');
        const dropdownHeader = document.querySelector('.dropdown-header');
        const dropdownList = document.getElementById('treatment-list');

        if (dropdownHeader) {
            dropdownHeader.addEventListener('click', function () {
                dropdown.classList.toggle('open');
                dropdownList.classList.toggle('show');
                this.classList.toggle('active');
            });
        }

        if (dropdownList) {
            dropdownList.addEventListener('click', function (e) {
                const treatmentOption = e.target.closest('.treatment-option');
                if (!treatmentOption) return;

                const treatment = treatmentOption.dataset.treatment;
                if (!treatment) return;

                // Toggle selection
                const isSelected = state.selectedTreatments.includes(treatment);
                if (isSelected) {
                    // Remove treatment
                    state.selectedTreatments = state.selectedTreatments.filter(t => t !== treatment);
                    treatmentOption.classList.remove('selected');
                } else {
                    // Add treatment
                    if (state.appointmentType === 'treatment') {
                        // Single treatment: clear all selections first, then add new one
                        state.selectedTreatments = [treatment];
                        // Remove selected class from all options
                        document.querySelectorAll('.treatment-option').forEach(opt => opt.classList.remove('selected'));
                        // Add selected class to current option
                        treatmentOption.classList.add('selected');
                    } else {
                        // Multiple treatments: add to list
                        state.selectedTreatments.push(treatment);
                        treatmentOption.classList.add('selected');
                    }
                }

                updateSelectedTreatments();
                e.stopPropagation();
            });
        }

        // Step navigation
        document.getElementById('btn-step-1-next').addEventListener('click', function () {
            if (!state.appointmentType) {
                showToast('Please select an appointment type.');
                return;
            }
            if ((state.appointmentType === 'treatment' || state.appointmentType === 'multiple') && state.selectedTreatments.length === 0) {
                showToast('Please select at least one treatment.');
                return;
            }
            if (state.appointmentType === 'treatment' && state.selectedTreatments.length > 1) {
                showToast('Single treatment appointments can only have one treatment. Please select "Multiple Treatments" for multiple procedures.');
                return;
            }
            goToStep(2);
            loadCalcom();
        });

        document.getElementById('btn-step-2-back').addEventListener('click', function () {
            goToStep(1);
        });

        // Payment proceed button
        const paymentButton = document.getElementById('btn-proceed-to-payment');
        if (paymentButton) {
            paymentButton.addEventListener('click', function () {
                showConfirmation();
            });
        }


        document.getElementById('btn-step-3-back').addEventListener('click', function () {
            goToStep(2);
        });

        // Payment button
        const paymentCompleteButton = document.getElementById('btn-complete-booking');
        if (paymentCompleteButton) {
            paymentCompleteButton.addEventListener('click', function () {
                handlePayment();
            });
        }

        // No more Cal.com message listeners needed - using custom calendar

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            const dropdown = document.getElementById('treatment-dropdown');
            const dropdownList = document.getElementById('treatment-list');
            const dropdownHeader = document.querySelector('.dropdown-header');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                if (dropdownList) dropdownList.classList.remove('show');
                if (dropdownHeader) dropdownHeader.classList.remove('active');
            }
        });
    }

    function selectAppointmentType(typeId) {
        state.appointmentType = typeId;
        document.querySelectorAll('[data-type]').forEach(function (el) {
            el.classList.toggle('selected', el.dataset.type === typeId);
        });

        // Show/hide treatment selection based on appointment type
        const treatmentGroup = document.getElementById('treatment-select-group');
        if (treatmentGroup) {
            treatmentGroup.style.display = (typeId === 'treatment' || typeId === 'multiple') ? 'block' : 'none';
        }

        updateSummary();
    }

    function updateSelectedTreatments() {
        // Update dropdown header text
        const headerText = document.getElementById('selected-treatments-text');
        if (headerText) {
            if (state.selectedTreatments.length === 0) {
                headerText.textContent = 'Choose your treatment(s)';
            } else if (state.selectedTreatments.length === 1) {
                headerText.textContent = state.selectedTreatments[0];
            } else {
                headerText.textContent = state.selectedTreatments.length + ' treatments selected';
            }
        }

        // Update selected treatments display
        const display = document.getElementById('selected-treatments-display');
        if (display) {
            if (state.selectedTreatments.length > 0) {
                const html = '<h5>Selected Treatments:</h5>' +
                    state.selectedTreatments.map(treatment => {
                        const pricing = BOOKING_CONFIG.pricing.treatment[treatment];
                        const priceText = pricing ? ' - €' + pricing.price : '';
                        return '<span class="selected-treatment-tag">' + treatment + priceText + '</span>';
                    }).join('');
                display.innerHTML = html;
                display.classList.add('show');
            } else {
                display.classList.remove('show');
            }
        }

        updateSummary();
    }

    function goToStep(step) {
        state.step = step;
        updateUI();
    }

    function updateUI() {
        console.log('updateUI called, current step:', state.step);

        document.querySelectorAll('.booking-step-indicator').forEach(function (el) {
            const stepNum = parseInt(el.dataset.step, 10);
            el.classList.toggle('active', stepNum === state.step);
            el.classList.toggle('completed', stepNum < state.step);
        });

        document.querySelectorAll('.booking-panel').forEach(function (el) {
            const isActive = parseInt(el.dataset.step, 10) === state.step;
            el.classList.toggle('active', isActive);
            console.log('Panel step', el.dataset.step, 'is active:', isActive);
        });

        if (state.appointmentType) {
            document.querySelectorAll('[data-type="' + state.appointmentType + '"]').forEach(function (el) {
                el.classList.add('selected');
            });
        }

        updateSummary();
    }

    function updateSummary() {
        const type = state.appointmentType
            ? BOOKING_CONFIG.appointmentTypes.find(function (t) { return t.id === state.appointmentType; })
            : null;

        setSummaryValue('summary-type', type ? type.title : '—');
        setSummaryValue('summary-treatment', state.selectedTreatments.length > 0 ? state.selectedTreatments.join(', ') : '—');

        // Update payment summary
        updatePaymentSummary();
    }

    function updatePaymentSummary() {
        if (!state.appointmentType) return;

        const pricing = calculatePricing();

        document.getElementById('total-price').textContent = `€${pricing.totalPrice}`;
        document.getElementById('deposit-amount').textContent = `€${pricing.deposit}`;
        document.getElementById('remaining-amount').textContent = `€${pricing.remaining}`;
        document.getElementById('payment-button-text').textContent = pricing.needsPayment ? `Pay Deposit €${pricing.deposit}` : 'Complete Booking (Free)';

        // Update sidebar summary
        if (pricing.totalPrice === 0 && state.selectedTreatments.length === 0) {
            document.getElementById('summary-price').textContent = '—';
            document.getElementById('summary-deposit').textContent = '—';
        } else {
            document.getElementById('summary-price').textContent = `€${pricing.totalPrice}`;
            document.getElementById('summary-deposit').textContent = `€${pricing.deposit}`;
        }
    }

    function calculatePricing() {
        const pricing = BOOKING_CONFIG.pricing;

        if (state.appointmentType === 'consultation') {
            return {
                totalPrice: pricing.consultation.price,
                deposit: pricing.consultation.deposit,
                remaining: pricing.consultation.price - pricing.consultation.deposit,
                needsPayment: false
            };
        }

        // For treatment appointments, calculate total based on selected treatments
        let totalPrice = 0;
        const flatDeposit = 50; // Fixed €50 deposit for all treatments

        if (state.selectedTreatments.length === 0) {
            // No pricing shown until treatments are selected
            return {
                totalPrice: 0,
                deposit: 0,
                remaining: 0,
                needsPayment: false
            };
        } else {
            state.selectedTreatments.forEach(treatment => {
                const treatmentPricing = pricing.treatment[treatment] || {
                    price: pricing.defaultTreatmentPrice,
                    deposit: pricing.defaultTreatmentDeposit
                };
                totalPrice += treatmentPricing.price;
            });
        }

        return {
            totalPrice: totalPrice,
            deposit: flatDeposit,
            remaining: totalPrice - flatDeposit,
            needsPayment: flatDeposit > 0
        };
    }

    function handlePayment() {
        const pricing = calculatePricing();

        // For free consultations, complete booking immediately
        if (!pricing.needsPayment) {
            completeBooking();
            return;
        }

        // Redirect to Stripe payment link
        const paymentLink = 'https://book.stripe.com/28o28Dg5m93v6xaaEE';
        window.location.href = paymentLink;
    }

    function completeBooking() {
        // Show success message
        const confirmationBanner = document.getElementById('booking-confirmation');
        if (confirmationBanner) {
            confirmationBanner.classList.add('visible');
            confirmationBanner.style.display = 'block';
        }

        // Scroll to confirmation
        confirmationBanner?.scrollIntoView({ behavior: 'smooth' });
    }

    function setSummaryValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function getCalcomUrl() {
        if (!state.appointmentType) return null;

        // Use Dublin clinic for Cal.com integration
        const urls = BOOKING_CONFIG.calcom.dublin;
        if (!urls) return null;

        let url = urls[state.appointmentType];
        if (!url || url.includes('YOUR_CALENDLY_USERNAME')) return null;

        // Return the clean Cal.com URL without treatment parameters
        // Cal.com doesn't accept custom treatment parameters in the URL
        return url;
    }

    function isCalcomConfigured() {
        return getCalcomUrl() !== null;
    }

    function loadCalcom() {
        const embed = document.getElementById('calcom-embed');
        const notice = document.getElementById('calcom-setup-notice');
        if (!embed) return;

        embed.innerHTML = '';

        if (!isCalcomConfigured()) {
            if (notice) notice.style.display = 'block';
            embed.innerHTML =
                '<div class="calcom-loading">' +
                    '<i class="fas fa-calendar-alt"></i>' +
                    '<p>Cal.com is not configured yet. Update <strong>booking-config.js</strong> with your Cal.com links.</p>' +
                    '<a href="https://wa.me/353831622444?text=Hi%20ClearCosmetics!%20I%27d%20like%20to%20book%20an%20appointment." class="btn btn-primary" target="_blank">Book via WhatsApp instead</a>' +
                '</div>';
            return;
        }

        if (notice) notice.style.display = 'none';

        const url = getCalcomUrl();

        // Create overlay to intercept Cal.com booking attempts
        const overlay = document.createElement('div');
        overlay.id = 'booking-intercept-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            z-index: 1000;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
        `;
        overlay.innerHTML = `
            <div style="background: white; color: black; padding: 30px; border-radius: 12px; max-width: 450px;">
                <i class="fas fa-calendar-check" style="font-size: 2rem; color: #2196f3; margin-bottom: 16px;"></i>
                <h3 style="margin: 0 0 12px 0;">Almost Done! 🎉</h3>
                <p style="margin: 0 0 8px 0;">Your appointment details have been selected.</p>
                <p style="margin: 0 0 20px 0;"><strong>Next step:</strong> Secure your booking with a deposit payment.</p>
                <button onclick="proceedToPaymentFromOverlay()" style="background: #2196f3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    Continue to Payment
                </button>
                <button onclick="hideBookingOverlay()" style="background: transparent; color: #666; border: 1px solid #ddd; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-left: 12px;">
                    Go Back
                </button>
            </div>
        `;

        embed.style.position = 'relative';
        embed.appendChild(overlay);

        // Render Cal.com dates directly to main container
        renderCalcomDatesDirectly(embed);

        // Stepped booking interface will be created by createSteppedBookingInterface function

        // Global functions for overlay buttons
        window.proceedToPaymentFromOverlay = function() {
            // Store the selected booking details
            const bookingData = {
                appointmentType: state.appointmentType,
                treatments: state.selectedTreatments,
                timestamp: Date.now(),
                returnUrl: window.location.href + '?payment=success'
            };
            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

            // Redirect to payment
            const pricing = calculatePricing();
            if (pricing.needsPayment) {
                const stripeUrl = 'https://book.stripe.com/28o28Dg5m93v6xaaEE?client_reference_id=' + encodeURIComponent(Date.now());
                window.location.href = stripeUrl;
            }
        };

        window.hideBookingOverlay = function() {
            overlay.style.display = 'none';
            paymentOverlayShown = false;
        };
    }

    function createSteppedBookingInterface(container) {
        const bookingInterface = document.createElement('div');
        bookingInterface.id = 'stepped-booking-interface';
        bookingInterface.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            border: 1px solid #e0e0e0;
            min-height: 600px;
        `;

        // Step 1: Date Selection - Clean container for Cal.com dates
        const dateSelectionStep = `
            <div id="date-selection-step" class="booking-step">
                <div class="clinic-dates-selection">
                    <!-- Cal.com dates will be rendered here by renderSteppedDates() -->
                </div>
            </div>
        `;

        // Step 2: Time Selection
        const timeSelectionStep = `
            <div id="time-selection-step" class="booking-step" style="display: none;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <button onclick="goBackToDateSelection()" style="background: transparent; border: 2px solid #ddd; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 16px;">
                        <i class="fas fa-arrow-left"></i> Back to Date Selection
                    </button>
                    <h3 style="color: #333; margin-bottom: 8px;">
                        <i class="fas fa-clock"></i> Available Times
                    </h3>
                    <p id="selected-date-display" style="color: #666; margin: 0;"></p>
                </div>

                <div class="time-slots-selection">
                    <div class="time-slots" id="stepped-time-slots" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;"></div>
                </div>
            </div>
        `;

        bookingInterface.innerHTML = dateSelectionStep + timeSelectionStep;
        container.appendChild(bookingInterface);

        // Render the date selection
        renderSteppedDates();
    }

    function renderSteppedDates() {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        // Skip the date cards completely and go directly to Cal.com embed
        console.log('🎯 renderSteppedDates called, going directly to Cal.com...');

        const appointmentType = state.appointmentType;
        let calcomUrl = '';

        if (appointmentType === 'consultation') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        } else if (appointmentType === 'treatment') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
        } else if (appointmentType === 'multiple') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
        } else {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        // Add selected treatments to the URL so they appear in Cal.com booking
        if (state.selectedTreatments.length > 0) {
            const treatmentsText = state.selectedTreatments.join(', ');
            const separator = calcomUrl.includes('?') ? '&' : '?';
            calcomUrl += `${separator}note=${encodeURIComponent('Treatments: ' + treatmentsText)}`;
        }

        console.log('Direct Cal.com URL with treatments:', calcomUrl);

        // Render Cal.com iframe directly
        datesContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-calendar-check" style="color: #4caf50; font-size: 1.5rem; margin-right: 8px;"></i>
                <h3 style="color: #333; margin-bottom: 8px;">Select Your Date & Time</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Book directly through Cal.com</p>
                ${state.selectedTreatments.length > 0 ? `<p style="color: #2196f3; font-size: 0.9rem; margin-top: 8px;"><strong>Selected:</strong> ${state.selectedTreatments.join(', ')}</p>` : ''}
            </div>
            <div style="width: 100%; height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <iframe src="${calcomUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;

        // Listen for Cal.com booking completion
        window.addEventListener('message', function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('Cal.com message:', event.data);

                if (event.data.type === 'booking-completed' ||
                    event.data.type === 'bookingSuccessful' ||
                    (event.data.payload && event.data.payload.type === 'bookingSuccessful')) {

                    console.log('✅ Cal.com booking completed! Now showing payment step...');

                    // Calculate pricing to check if payment is needed
                    const pricing = calculatePricing();
                    if (pricing.needsPayment) {
                        // Show payment overlay for deposit
                        showPaymentOverlay();
                    } else {
                        // Free consultation - show success
                        showBookingSuccess();
                    }
                }
            }
        });
    }

    function fetchCalcomAvailableDates() {
        const appointmentType = state.appointmentType;
        let calcomUrl = '';

        switch(appointmentType) {
            case 'consultation':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
                break;
            case 'treatment':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
                break;
            case 'multiple':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
                break;
            default:
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        console.log('Fetching Cal.com available dates from:', calcomUrl);

        // Create hidden iframe to load Cal.com calendar
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.style.cssText = 'position: absolute; left: -9999px; width: 800px; height: 600px; opacity: 0; pointer-events: none;';
        hiddenIframe.src = calcomUrl;
        document.body.appendChild(hiddenIframe);

        // Listen for Cal.com to send availability data
        const messageHandler = function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('Cal.com availability message:', event.data);

                // Look for availability data
                if (event.data && event.data.type === 'availabilityLoaded') {
                    console.log('Cal.com availability loaded, full data:', event.data);

                    // Try different data structures
                    let dataToProcess = event.data.data || event.data.payload || event.data;
                    console.log('Processing data:', dataToProcess);

                    extractAvailabilityDates(dataToProcess, hiddenIframe);
                    window.removeEventListener('message', messageHandler);
                    return;
                }

                // Also look for month/date data
                if (event.data && (
                    event.data.type === 'monthChanged' ||
                    event.data.type === 'dateSelected' ||
                    event.data.availableDates ||
                    event.data.availability
                )) {
                    console.log('Cal.com date data received:', event.data);
                    extractAvailabilityDates(event.data, hiddenIframe);
                    window.removeEventListener('message', messageHandler);
                    return;
                }
            }
        };

        window.addEventListener('message', messageHandler);

        // Timeout: Show error if Cal.com doesn't load within 15 seconds
        setTimeout(() => {
            console.log('Cal.com availability timeout');
            window.removeEventListener('message', messageHandler);
            showCalcomError();
            if (hiddenIframe.parentNode) {
                hiddenIframe.remove();
            }
        }, 15000);

        // Also try to extract dates after iframe loads
        hiddenIframe.onload = function() {
            setTimeout(() => {
                console.log('Cal.com iframe loaded, attempting to extract dates via DOM...');
                extractDatesFromCalcomIframe(hiddenIframe);
            }, 3000);
        };
    }

    function extractAvailabilityDates(data, iframe) {
        console.log('🔍 NEW VERSION: Extracting availability from data:', data);

        let availableDates = [];

        // Try many different ways to extract dates from Cal.com data
        if (data) {
            // Direct arrays
            if (Array.isArray(data.availableDates)) {
                availableDates = data.availableDates;
            } else if (Array.isArray(data.availability)) {
                availableDates = data.availability.map(slot =>
                    slot.date || slot.start || slot.startTime || slot.time
                ).filter(Boolean);
            } else if (Array.isArray(data.slots)) {
                availableDates = data.slots.map(slot =>
                    slot.date || slot.start || slot.startTime || slot.time
                ).filter(Boolean);
            } else if (Array.isArray(data.dates)) {
                availableDates = data.dates;
            }

            // Nested objects
            if (availableDates.length === 0 && data.calendar) {
                if (Array.isArray(data.calendar.availableDates)) {
                    availableDates = data.calendar.availableDates;
                } else if (Array.isArray(data.calendar.slots)) {
                    availableDates = data.calendar.slots.map(slot => slot.date).filter(Boolean);
                }
            }

            // Check for month data
            if (availableDates.length === 0 && data.month) {
                const monthData = data.month;
                Object.keys(monthData).forEach(key => {
                    if (Array.isArray(monthData[key])) {
                        monthData[key].forEach(item => {
                            if (item.date) availableDates.push(item.date);
                            if (item.start) availableDates.push(item.start.split('T')[0]);
                        });
                    }
                });
            }

            // Generate dates from current month if we have any indication of availability
            if (availableDates.length === 0) {
                console.log('No specific dates found, generating current month dates as fallback...');
                availableDates = generateCurrentMonthDates();
            }
        }

        // Filter and format dates
        const uniqueDates = [...new Set(availableDates)].filter(date => {
            if (!date) return false;
            try {
                const dateObj = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dateObj.setHours(0, 0, 0, 0);
                return dateObj >= today && !isNaN(dateObj.getTime());
            } catch (e) {
                return false;
            }
        }).sort();

        console.log('Extracted unique dates:', uniqueDates);

        if (uniqueDates.length > 0) {
            renderCalcomDates(uniqueDates);
        } else {
            console.log('No valid dates found, showing error...');
            showCalcomError();
        }

        if (iframe.parentNode) {
            iframe.remove();
        }
    }

    function generateCurrentMonthDates() {
        // Use clinic dates from config instead of generating all possible dates
        const clinicDates = BOOKING_CONFIG.clinics.dublin.upcomingDates;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out past dates
        const validDates = clinicDates.filter(dateStr => {
            if (!dateStr || dateStr.trim().startsWith('//')) return false; // Skip commented dates
            try {
                const date = new Date(dateStr);
                return date >= today;
            } catch (e) {
                return false;
            }
        });

        console.log('Using configured clinic dates as fallback:', validDates);
        return validDates;
    }

    function extractDatesFromCalcomIframe(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // Try to find available date elements in Cal.com
            const dateElements = iframeDoc.querySelectorAll(
                '[data-testid*="day"]:not([disabled]), ' +
                '.calendar-day:not(.disabled), ' +
                '[aria-disabled="false"][role="gridcell"], ' +
                'button[aria-label*="available"]'
            );

            console.log('Found Cal.com date elements:', dateElements.length);

            if (dateElements.length > 0) {
                const availableDates = [];
                dateElements.forEach(el => {
                    const dateStr = extractDateFromDOMElement(el);
                    if (dateStr) availableDates.push(dateStr);
                });

                const uniqueDates = [...new Set(availableDates)];
                console.log('Extracted dates from DOM:', uniqueDates);

                if (uniqueDates.length > 0) {
                    renderCalcomDates(uniqueDates);
                    if (iframe.parentNode) {
                        iframe.remove();
                    }
                    return;
                }
            }
        } catch (e) {
            console.log('Cannot access Cal.com iframe DOM due to CORS:', e);
        }

        // No fallback - show error instead
        console.log('Failed to extract dates from Cal.com');
        showCalcomError();
        if (iframe.parentNode) {
            iframe.remove();
        }
    }

    function extractDateFromDOMElement(element) {
        // Try to extract date from element attributes and content
        const dataDate = element.getAttribute('data-date');
        const ariaLabel = element.getAttribute('aria-label');
        const textContent = element.textContent?.trim();

        if (dataDate && /\d{4}-\d{2}-\d{2}/.test(dataDate)) {
            return dataDate;
        }

        if (ariaLabel) {
            const dateMatch = ariaLabel.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) return dateMatch[1];

            // Try to parse natural language dates
            const dateWords = ariaLabel.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i);
            if (dateWords) {
                const monthName = dateWords[1];
                const day = parseInt(dateWords[2]);
                const year = parseInt(dateWords[3]);
                const monthIndex = new Date(Date.parse(`${monthName} 1, 2000`)).getMonth();
                const date = new Date(year, monthIndex, day);
                return date.toISOString().split('T')[0];
            }
        }

        return null;
    }

    function renderCalcomDates(dates) {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        // Skip the date cards and go directly to Cal.com embed
        const appointmentType = state.appointmentType;
        let calcomUrl = '';

        if (appointmentType === 'consultation') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        } else if (appointmentType === 'treatment') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
        } else if (appointmentType === 'multiple') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
        } else {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        console.log('Direct Cal.com URL:', calcomUrl);

        // Render Cal.com iframe directly
        datesContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-calendar-check" style="color: #4caf50; font-size: 1.5rem; margin-right: 8px;"></i>
                <h3 style="color: #333; margin-bottom: 8px;">Select Your Date & Time</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Pick from available slots</p>
            </div>
            <div style="width: 100%; height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <iframe src="${calcomUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;

        // Listen for Cal.com booking completion
        window.addEventListener('message', function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('Cal.com message:', event.data);

                if (event.data.type === 'booking-completed' ||
                    event.data.type === 'bookingSuccessful' ||
                    (event.data.payload && event.data.payload.type === 'bookingSuccessful')) {

                    console.log('✅ Cal.com booking completed! Now showing payment step...');

                    // Calculate pricing to check if payment is needed
                    const pricing = calculatePricing();
                    if (pricing.needsPayment) {
                        // Show payment overlay for deposit
                        showPaymentOverlay();
                    } else {
                        // Free consultation - show success
                        showBookingSuccess();
                    }
                }
            }
        });
    }

    function showBookingSuccess() {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (datesContainer) {
            datesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #d4edda; border: 2px solid #c3e6cb; border-radius: 12px; margin: 0 auto; max-width: 600px;">
                    <i class="fas fa-check-circle" style="color: #155724; font-size: 4rem; margin-bottom: 20px;"></i>
                    <h3 style="color: #155724; margin-bottom: 12px;">Booking Confirmed!</h3>
                    <p style="color: #155724; margin-bottom: 0; font-size: 1.1rem;">You'll receive a confirmation email shortly. We can't wait to see you!</p>
                </div>
            `;
        }

        // Show the confirmation banner
        const confirmationBanner = document.getElementById('booking-confirmation');
        if (confirmationBanner) {
            confirmationBanner.style.display = 'block';
        }
    }

    function showCalcomError() {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        datesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 12px; margin: 0 auto; max-width: 600px;">
                <i class="fas fa-exclamation-triangle" style="color: #856404; font-size: 3rem; margin-bottom: 16px;"></i>
                <h3 style="color: #856404; margin-bottom: 12px;">Unable to Load Cal.com Availability</h3>
                <p style="color: #856404; margin-bottom: 20px; line-height: 1.5;">
                    We're having trouble connecting to Cal.com to show available dates.
                    Please book directly through one of these options:
                </p>
                <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
                    <a href="https://cal.com/clearcosmetics/consultation" target="_blank" style="
                        background: #2196f3;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196f3'">
                        <i class="fas fa-comments"></i> Book Free Consultation
                    </a>
                    <a href="https://cal.com/clearcosmetics/single-treatment" target="_blank" style="
                        background: #2196f3;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196f3'">
                        <i class="fas fa-syringe"></i> Book Single Treatment
                    </a>
                    <a href="https://cal.com/clearcosmetics/multiple-treatments" target="_blank" style="
                        background: #2196f3;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196f3'">
                        <i class="fas fa-magic"></i> Book Multiple Treatments
                    </a>
                    <a href="https://wa.me/353831622444?text=Hi%20ClearCosmetics!%20I%20need%20help%20booking%20an%20appointment." target="_blank" style="
                        background: #25d366;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#20b358'" onmouseout="this.style.background='#25d366'">
                        <i class="fab fa-whatsapp"></i> WhatsApp Us
                    </a>
                </div>
            </div>
        `;
    }


    function fetchCalcomAvailability() {
        const appointmentType = state.appointmentType;
        let calcomUrl = '';

        switch(appointmentType) {
            case 'consultation':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
                break;
            case 'treatment':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
                break;
            case 'multiple':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
                break;
            default:
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        // Create hidden iframe to load Cal.com and extract availability
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;';
        hiddenIframe.src = calcomUrl;
        document.body.appendChild(hiddenIframe);

        // Listen for Cal.com to load and extract dates
        hiddenIframe.onload = function() {
            setTimeout(() => {
                extractCalcomDates(hiddenIframe);
            }, 3000); // Wait for Cal.com to fully load
        };

        // Fallback: Use config dates if Cal.com doesn't load within 10 seconds
        setTimeout(() => {
            if (document.querySelector('.clinic-dates-selection .fa-spinner')) {
                console.log('Cal.com loading timeout, using fallback dates');
                renderFallbackDates();
                if (hiddenIframe.parentNode) {
                    hiddenIframe.parentNode.removeChild(hiddenIframe);
                }
            }
        }, 10000);
    }

    function extractCalcomDates(iframe) {
        try {
            // Try to access Cal.com calendar data
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const calendarElements = iframeDoc.querySelectorAll('[data-testid*="day"], .calendar-day, [aria-label*="available"]');

            if (calendarElements.length > 0) {
                console.log('Found Cal.com calendar elements:', calendarElements.length);
                // Extract available dates from Cal.com
                const availableDates = [];
                calendarElements.forEach(el => {
                    // Extract date info from Cal.com elements
                    const dateInfo = extractDateFromElement(el);
                    if (dateInfo) {
                        availableDates.push(dateInfo);
                    }
                });

                if (availableDates.length > 0) {
                    renderExtractedDates(availableDates);
                    iframe.remove();
                    return;
                }
            }
        } catch (e) {
            console.log('Cannot access Cal.com iframe due to CORS:', e);
        }

        // If extraction fails, use fallback
        renderFallbackDates();
        iframe.remove();
    }

    function extractDateFromElement(element) {
        // Try to extract date from various Cal.com element patterns
        const ariaLabel = element.getAttribute('aria-label');
        const dataTestId = element.getAttribute('data-testid');
        const textContent = element.textContent;

        // Look for date patterns in the element
        // This is a simplified extraction - Cal.com structure may vary
        if (ariaLabel && ariaLabel.includes('available')) {
            // Extract date from aria-label
            const dateMatch = ariaLabel.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                return dateMatch[1];
            }
        }

        return null;
    }

    function renderExtractedDates(availableDates) {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        const today = new Date();
        const validDates = availableDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= today;
        });

        renderDatesGrid(validDates, 'Real-time availability from Cal.com');
    }

    function renderFallbackDates() {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        const clinicDates = BOOKING_CONFIG.clinics.dublin.upcomingDates;
        const today = new Date();
        const validDates = clinicDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= today;
        });

        renderDatesGrid(validDates, 'Scheduled clinic days');
    }

    function renderDatesGrid(dates, subtitle) {
        const datesContainer = document.querySelector('.clinic-dates-selection');
        if (!datesContainer) return;

        datesContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="color: #666; font-size: 0.9rem; margin: 0;">
                    <i class="fas fa-calendar-check" style="color: #4caf50; margin-right: 8px;"></i>
                    ${subtitle}
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; max-width: 800px; margin: 0 auto;">
                ${dates.map(dateStr => {
                    const date = new Date(dateStr);
                    const dayName = date.toLocaleDateString('en', { weekday: 'long' });
                    const dayNum = date.getDate();
                    const month = date.toLocaleDateString('en', { month: 'long' });
                    const year = date.getFullYear();

                    return `
                        <div class="stepped-date-card" data-date="${dateStr}" style="
                            background: white;
                            border: 2px solid #e0e0e0;
                            border-radius: 12px;
                            padding: 20px;
                            text-align: center;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        " onclick="selectSteppedDate('${dateStr}')">
                            <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">${dayName}</div>
                            <div style="font-size: 2rem; font-weight: 600; color: #333; margin-bottom: 4px;">${dayNum}</div>
                            <div style="font-size: 1rem; color: #333; margin-bottom: 12px;">${month} ${year}</div>
                            <div style="font-size: 0.8rem; color: #2196f3; font-weight: 500;">
                                <i class="fas fa-clock"></i> Available Times
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Add hover effects via CSS
        const style = document.createElement('style');
        style.textContent = `
            .stepped-date-card:hover {
                transform: translateY(-2px);
                border-color: #2196f3 !important;
                box-shadow: 0 4px 16px rgba(33, 150, 243, 0.2) !important;
            }
        `;
        if (!document.querySelector('#stepped-date-styles')) {
            style.id = 'stepped-date-styles';
            document.head.appendChild(style);
        }
    }

    function selectSteppedDate(dateStr) {
        console.log('selectSteppedDate called with:', dateStr);

        const selectedDate = new Date(dateStr);
        const formattedDate = selectedDate.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        console.log('Formatted date:', formattedDate);

        // Hide date selection and show time selection
        const dateStep = document.getElementById('date-selection-step');
        const timeStep = document.getElementById('time-selection-step');

        console.log('Date step element:', dateStep);
        console.log('Time step element:', timeStep);

        if (dateStep && timeStep) {
            dateStep.style.display = 'none';
            timeStep.style.display = 'block';
            console.log('Switched to time selection step');
        } else {
            console.error('Could not find step elements');
        }

        // Update the selected date display
        const dateDisplay = document.getElementById('selected-date-display');
        if (dateDisplay) {
            dateDisplay.textContent = formattedDate;
            console.log('Updated date display');
        }

        // Render time slots for the selected date
        console.log('Calling renderSteppedTimes...');
        renderSteppedTimes(dateStr);
    }

    function renderSteppedTimes(dateStr) {
        const timeSlotsContainer = document.getElementById('stepped-time-slots');
        if (!timeSlotsContainer) return;

        // Clear the time slots grid and replace with Cal.com iframe
        const timeSelectionStep = document.getElementById('time-selection-step');
        if (!timeSelectionStep) return;

        // Update the date display
        const selectedDate = new Date(dateStr);
        const formattedDate = selectedDate.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        timeSelectionStep.innerHTML = `
            <div style="text-align: center; margin-bottom: 32px;">
                <button onclick="goBackToDateSelection()" style="background: transparent; border: 2px solid #ddd; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 16px;">
                    <i class="fas fa-arrow-left"></i> Back to Date Selection
                </button>
                <h3 style="color: #333; margin-bottom: 8px;">
                    <i class="fas fa-clock"></i> Select Your Time
                </h3>
                <p style="color: #666; margin: 0;">${formattedDate}</p>
            </div>

            <div style="background: #f8f9fa; border: 2px solid #2196f3; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
                <i class="fas fa-info-circle" style="color: #1976d2; margin-right: 8px;"></i>
                <strong style="color: #1976d2;">Choose your time below → Payment required before booking confirmation</strong>
            </div>

            <div id="calcom-time-embed" style="width: 100%; height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;"></div>
        `;

        // Load Cal.com iframe for this specific date and appointment type
        loadCalcomForDateTime(dateStr);
    }

    function loadCalcomForDateTime(dateStr) {
        console.log('loadCalcomForDateTime called with date:', dateStr);
        const appointmentType = state.appointmentType;
        console.log('Appointment type:', appointmentType);

        let calcomUrl = '';

        switch(appointmentType) {
            case 'consultation':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
                break;
            case 'treatment':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
                break;
            case 'multiple':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
                break;
            default:
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        console.log('Cal.com URL:', calcomUrl);

        // Add date parameter to focus on the selected date
        const calcomUrlWithDate = calcomUrl + `?date=${dateStr}`;
        console.log('Cal.com URL with date:', calcomUrlWithDate);

        // Create Cal.com iframe
        const embedContainer = document.getElementById('calcom-time-embed');
        if (!embedContainer) {
            console.error('Cal.com embed container not found');
            return;
        }

        console.log('Creating Cal.com iframe...');
        const iframe = document.createElement('iframe');
        iframe.src = calcomUrlWithDate;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        iframe.allow = 'microphone; camera; payment; geolocation';

        // Add loading indicator
        embedContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; border-radius: 8px;">
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #2196f3; margin-bottom: 12px;"></i>
                    <p style="color: #666; margin: 0;">Loading Cal.com availability...</p>
                </div>
            </div>
        `;

        // Load iframe after short delay to show loading state
        setTimeout(() => {
            embedContainer.innerHTML = '';
            embedContainer.appendChild(iframe);
            console.log('Cal.com iframe added to DOM');
        }, 500);

        // Listen for Cal.com booking attempts
        setupCalcomMessageInterception(iframe, dateStr);
    }

    function setupCalcomMessageInterception(iframe, dateStr) {
        // Store the selected date for payment flow
        state.selectedDate = dateStr;

        // Listen for messages from Cal.com iframe
        const messageHandler = function(event) {
            console.log('Cal.com message received:', event);

            // Check if this is a booking confirmation attempt
            if (event.origin.includes('cal.com')) {
                const data = event.data;

                // Detect booking attempt patterns
                if (data && (
                    data.type === 'booking' ||
                    data.type === 'booking_confirmed' ||
                    data.type === 'eventTypeSelected' ||
                    (data.action && data.action.includes('book')) ||
                    (data.url && data.url.includes('book'))
                )) {
                    console.log('Cal.com booking attempt detected, showing payment overlay');

                    // Prevent the booking and show payment overlay
                    event.preventDefault?.();
                    event.stopPropagation?.();

                    // Extract time if available
                    let selectedTime = '';
                    if (data.time) selectedTime = data.time;
                    if (data.startTime) selectedTime = data.startTime;
                    if (data.slot) selectedTime = data.slot;

                    // Show payment overlay immediately
                    showPaymentOverlayForBooking(dateStr, selectedTime);

                    return false;
                }
            }
        };

        window.addEventListener('message', messageHandler);

        // Store handler for cleanup
        iframe.messageHandler = messageHandler;
    }

    function showPaymentOverlayForBooking(dateStr, timeStr) {
        // Store the selected appointment details
        const bookingData = {
            appointmentType: state.appointmentType,
            treatments: state.selectedTreatments,
            selectedDate: dateStr,
            selectedTime: timeStr,
            timestamp: Date.now(),
            returnUrl: window.location.href + '?payment=success'
        };
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

        // Show the payment overlay
        showPaymentOverlay();
    }

    function fetchCalcomTimesForDate(dateStr) {
        const appointmentType = state.appointmentType;
        let calcomUrl = '';

        switch(appointmentType) {
            case 'consultation':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
                break;
            case 'treatment':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
                break;
            case 'multiple':
                calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
                break;
            default:
                calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        // Add date parameter to Cal.com URL
        const calcomUrlWithDate = calcomUrl + `?date=${dateStr}`;

        // Create hidden iframe to load Cal.com for specific date
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;';
        hiddenIframe.src = calcomUrlWithDate;
        document.body.appendChild(hiddenIframe);

        // Listen for Cal.com to load and extract times
        hiddenIframe.onload = function() {
            setTimeout(() => {
                extractCalcomTimes(hiddenIframe, dateStr);
            }, 4000); // Wait longer for time slots to load
        };

        // Fallback: Use default times if Cal.com doesn't load within 15 seconds
        setTimeout(() => {
            if (document.querySelector('#stepped-time-slots .fa-spinner')) {
                console.log('Cal.com time loading timeout, using fallback times');
                renderFallbackTimes(dateStr);
                if (hiddenIframe.parentNode) {
                    hiddenIframe.parentNode.removeChild(hiddenIframe);
                }
            }
        }, 15000);
    }

    function extractCalcomTimes(iframe, dateStr) {
        try {
            // Try to access Cal.com time slot data
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const timeElements = iframeDoc.querySelectorAll('[data-testid*="time"], .time-slot, button[aria-label*=":"]');

            if (timeElements.length > 0) {
                console.log('Found Cal.com time elements:', timeElements.length);
                // Extract available times from Cal.com
                const availableTimes = [];
                timeElements.forEach(el => {
                    const timeInfo = extractTimeFromElement(el);
                    if (timeInfo) {
                        availableTimes.push(timeInfo);
                    }
                });

                if (availableTimes.length > 0) {
                    renderExtractedTimes(availableTimes, dateStr);
                    iframe.remove();
                    return;
                }
            }
        } catch (e) {
            console.log('Cannot access Cal.com iframe due to CORS:', e);
        }

        // If extraction fails, use fallback
        renderFallbackTimes(dateStr);
        iframe.remove();
    }

    function extractTimeFromElement(element) {
        // Try to extract time from various Cal.com element patterns
        const ariaLabel = element.getAttribute('aria-label');
        const textContent = element.textContent;

        // Look for time patterns (HH:MM format)
        const timePattern = /(\d{1,2}:\d{2})/;

        if (ariaLabel) {
            const match = ariaLabel.match(timePattern);
            if (match) return match[1];
        }

        if (textContent) {
            const match = textContent.match(timePattern);
            if (match) return match[1];
        }

        return null;
    }

    function renderExtractedTimes(availableTimes, dateStr) {
        const timeSlotsContainer = document.getElementById('stepped-time-slots');
        if (!timeSlotsContainer) return;

        renderTimesGrid(availableTimes, dateStr, 'Real-time availability from Cal.com');
    }

    function renderFallbackTimes(dateStr) {
        const timeSlotsContainer = document.getElementById('stepped-time-slots');
        if (!timeSlotsContainer) return;

        // Generate default time slots from 10:00 AM to 6:00 PM, excluding 2:20-3:20 PM break
        const timeSlots = [];
        const startHour = 10;
        const endHour = 18;
        const breakStart = 14.33; // 2:20 PM
        const breakEnd = 15.33;   // 3:20 PM

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 20) {
                const timeDecimal = hour + (minutes / 60);

                // Skip break time
                if (timeDecimal >= breakStart && timeDecimal < breakEnd) continue;

                const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                timeSlots.push(timeString);
            }
        }

        renderTimesGrid(timeSlots, dateStr, 'Standard clinic hours');
    }

    function renderTimesGrid(times, dateStr, subtitle) {
        const timeSlotsContainer = document.getElementById('stepped-time-slots');
        if (!timeSlotsContainer) return;

        timeSlotsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 20px;">
                <p style="color: #666; font-size: 0.9rem; margin: 0;">
                    <i class="fas fa-clock" style="color: #4caf50; margin-right: 8px;"></i>
                    ${subtitle}
                </p>
            </div>
            ${times.map(time => {
                const [hour, minute] = time.split(':');
                const date = new Date();
                date.setHours(parseInt(hour), parseInt(minute));
                const displayTime = date.toLocaleTimeString('en', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                return `
                    <div class="stepped-time-slot" data-time="${time}" data-date="${dateStr}" style="
                        background: white;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 16px 20px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-weight: 500;
                        color: #333;
                    " onclick="selectSteppedTime('${dateStr}', '${time}')">
                        <i class="fas fa-clock" style="margin-right: 8px; color: #2196f3;"></i>
                        ${displayTime}
                    </div>
                `;
            }).join('')}
        `;

        // Add hover effects for time slots
        const timeStyle = document.createElement('style');
        timeStyle.textContent = `
            .stepped-time-slot:hover {
                background: #f3f7ff !important;
                border-color: #2196f3 !important;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
            }
        `;
        if (!document.querySelector('#stepped-time-styles')) {
            timeStyle.id = 'stepped-time-styles';
            document.head.appendChild(timeStyle);
        }
    }

    function selectSteppedTime(dateStr, timeStr) {
        // Store the selected appointment details
        const bookingData = {
            appointmentType: state.appointmentType,
            treatments: state.selectedTreatments,
            selectedDate: dateStr,
            selectedTime: timeStr,
            timestamp: Date.now(),
            returnUrl: window.location.href + '?payment=success'
        };
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

        // Trigger payment overlay immediately
        showPaymentOverlay();
    }

    function showPaymentOverlay() {
        // Create payment overlay that covers the entire screen
        const overlay = document.createElement('div');
        overlay.id = 'stepped-payment-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const pricing = calculatePricing();
        const overlayContent = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
                <div style="margin-bottom: 24px;">
                    <i class="fas fa-credit-card" style="font-size: 3rem; color: #2196f3; margin-bottom: 16px;"></i>
                    <h3 style="color: #333; margin-bottom: 8px;">Secure Your Appointment</h3>
                    <p style="color: #666; margin: 0;">Pay your deposit to confirm your booking</p>
                </div>

                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Total Treatment Cost:</span>
                        <strong>€${pricing.totalPrice}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #2196f3;">
                        <span>Deposit Required:</span>
                        <strong>€${pricing.deposit}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #666;">
                        <span>Pay at Appointment:</span>
                        <span>€${pricing.remaining}</span>
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 16px;">
                        <i class="fas fa-shield-alt" style="color: #4caf50; margin-right: 8px;"></i>
                        Your payment is secure and encrypted
                    </p>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="hidePaymentOverlay()" style="
                        flex: 1;
                        background: #f5f5f5;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        padding: 12px 20px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="proceedToStripePayment()" style="
                        flex: 2;
                        background: #2196f3;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 20px;
                        color: white;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Pay Deposit €${pricing.deposit} <i class="fas fa-credit-card"></i>
                    </button>
                </div>
            </div>
        `;

        overlay.innerHTML = overlayContent;
        document.body.appendChild(overlay);
    }

    function hidePaymentOverlay() {
        const overlay = document.getElementById('stepped-payment-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function proceedToStripePayment() {
        const pricing = calculatePricing();
        const stripeUrl = 'https://book.stripe.com/28o28Dg5m93v6xaaEE?client_reference_id=' + encodeURIComponent(Date.now());
        window.location.href = stripeUrl;
    }

    function goBackToDateSelection() {
        document.getElementById('time-selection-step').style.display = 'none';
        document.getElementById('date-selection-step').style.display = 'block';
    }

    // Make functions globally accessible
    window.selectSteppedDate = selectSteppedDate;
    window.showPaymentOverlay = showPaymentOverlay;
    window.showPaymentOverlayForBooking = showPaymentOverlayForBooking;
    window.hidePaymentOverlay = hidePaymentOverlay;
    window.proceedToStripePayment = proceedToStripePayment;
    window.goBackToDateSelection = goBackToDateSelection;

    function renderCalcomDatesDirectly(container) {
        console.log('🚀 Going directly to Cal.com - no date cards!');

        // Get appointment type to determine correct Cal.com URL
        const appointmentType = state.appointmentType || 'consultation';
        let calcomUrl = '';

        if (appointmentType === 'consultation') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        } else if (appointmentType === 'treatment') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
        } else if (appointmentType === 'multiple') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
        } else {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        // Add selected treatments to the URL so they appear in Cal.com booking
        if (state.selectedTreatments.length > 0) {
            const treatmentsText = state.selectedTreatments.join(', ');
            const separator = calcomUrl.includes('?') ? '&' : '?';
            calcomUrl += `${separator}note=${encodeURIComponent('Treatments: ' + treatmentsText)}`;
        }

        console.log('Direct Cal.com URL with treatments:', calcomUrl);

        // Clear container and render Cal.com iframe directly
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-calendar-check" style="color: #4caf50; font-size: 1.5rem; margin-right: 8px;"></i>
                <h3 style="color: #333; margin-bottom: 8px;">Select Your Date & Time</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Book directly through Cal.com</p>
                ${state.selectedTreatments.length > 0 ? `<p style="color: #2196f3; font-size: 0.9rem; margin-top: 8px;"><strong>Selected:</strong> ${state.selectedTreatments.join(', ')}</p>` : ''}
            </div>
            <div style="width: 100%; height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <iframe src="${calcomUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;

        // Listen for Cal.com booking completion
        window.addEventListener('message', function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('Cal.com message:', event.data);

                if (event.data.type === 'booking-completed' ||
                    event.data.type === 'bookingSuccessful' ||
                    (event.data.payload && event.data.payload.type === 'bookingSuccessful')) {

                    console.log('✅ Cal.com booking completed! Now showing payment step...');

                    // Calculate pricing to check if payment is needed
                    const pricing = calculatePricing();
                    if (pricing.needsPayment) {
                        // Show payment overlay for deposit
                        showPaymentOverlay();
                    } else {
                        // Free consultation - show success
                        showBookingSuccess();
                    }
                }
            }
        });
    }

    function renderCalcomDatesDirectToContainer(dates, container) {
        // This function is no longer used - replaced with direct Cal.com embed
        console.log('renderCalcomDatesDirectToContainer called but redirecting to direct Cal.com...');

        // Get appointment type to determine correct Cal.com URL
        const appointmentType = state.appointmentType || 'consultation';
        let calcomUrl = '';

        if (appointmentType === 'consultation') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        } else if (appointmentType === 'treatment') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
        } else if (appointmentType === 'multiple') {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
        } else {
            calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
        }

        // Add selected treatments to the URL so they appear in Cal.com booking
        if (state.selectedTreatments.length > 0) {
            const treatmentsText = state.selectedTreatments.join(', ');
            const separator = calcomUrl.includes('?') ? '&' : '?';
            calcomUrl += `${separator}note=${encodeURIComponent('Treatments: ' + treatmentsText)}`;
        }

        // Render Cal.com iframe directly instead of date cards
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-calendar-check" style="color: #4caf50; font-size: 1.5rem; margin-right: 8px;"></i>
                <h3 style="color: #333; margin-bottom: 8px;">Select Your Date & Time</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Book directly through Cal.com</p>
                ${state.selectedTreatments.length > 0 ? `<p style="color: #2196f3; font-size: 0.9rem; margin-top: 8px;"><strong>Selected:</strong> ${state.selectedTreatments.join(', ')}</p>` : ''}
            </div>
            <div style="width: 100%; height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <iframe src="${calcomUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;
    }

    function loadCalcomForSelectedDate(dateStr, container) {
        console.log('🚀 Loading Cal.com for selected date:', dateStr);

        // Clear container and show Cal.com loading
        container.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #2196f3; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 12px;">Loading Available Times</h3>
                <p style="color: #666;">Connecting to Cal.com for ${new Date(dateStr).toLocaleDateString('en', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })}...</p>
            </div>
        `;

        // Load Cal.com iframe for the selected date
        setTimeout(() => {
            const appointmentType = state.appointmentType;
            let calcomUrl = '';

            switch(appointmentType) {
                case 'consultation':
                    calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
                    break;
                case 'treatment':
                    calcomUrl = BOOKING_CONFIG.calcom.dublin.treatment;
                    break;
                case 'multiple':
                    calcomUrl = BOOKING_CONFIG.calcom.dublin.multiple;
                    break;
                default:
                    calcomUrl = BOOKING_CONFIG.calcom.dublin.consultation;
            }

            const calcomUrlWithDate = calcomUrl + `?date=${dateStr}`;

            container.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <button onclick="goBackToCalcomDates()" style="background: #f5f5f5; border: 2px solid #ddd; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Date Selection
                    </button>
                    <h3 style="color: #333;">Select Your Time</h3>
                    <p style="color: #666;">${new Date(dateStr).toLocaleDateString('en', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>
                <iframe src="${calcomUrlWithDate}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
            `;

            // Set up payment interception for this Cal.com iframe
            setupCalcomPaymentInterception(dateStr);
        }, 1000);
    }

    function setupCalcomPaymentInterception(dateStr) {
        // Store the selected date
        state.selectedDate = dateStr;

        // Listen for Cal.com booking attempts and show payment overlay
        const messageHandler = function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('🚀 Cal.com message received for payment interception:', event);

                // Show payment overlay for any Cal.com interaction
                if (event.data && (
                    event.data.type === 'booking' ||
                    event.data.type === 'eventTypeSelected' ||
                    (event.data.action && event.data.action.includes('book'))
                )) {
                    console.log('🚀 Showing payment overlay for booking attempt');
                    showPaymentOverlayForBooking(dateStr, event.data.time || '');
                }
            }
        };

        window.addEventListener('message', messageHandler);
    }

    // Global function for back button
    window.goBackToCalcomDates = function() {
        const container = document.getElementById('calcom-embed');
        if (container) {
            renderCalcomDatesDirectly(container);
        }
    };

    function renderCustomAvailability() {
        const datesContainer = document.getElementById('custom-clinic-dates');
        if (!datesContainer) return;

        // Use dates from config
        const clinicDates = BOOKING_CONFIG.clinics.dublin.upcomingDates;

        datesContainer.innerHTML = clinicDates.map(dateStr => {
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });

            return `
                <div class="clinic-date-card" onclick="selectCustomDate('${dateStr}')" style="
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <div class="date-day" style="font-size: 0.9rem; color: #666; margin-bottom: 4px;">${dayName}</div>
                    <div class="date-number" style="font-size: 1.5rem; font-weight: 600; color: #333; margin-bottom: 4px;">${dayNum}</div>
                    <div class="date-month" style="font-size: 0.9rem; color: #666;">${monthName}</div>
                </div>
            `;
        }).join('');
    }

    window.selectCustomDate = function(dateStr) {
        // Remove selection from other dates
        document.querySelectorAll('.clinic-date-card').forEach(card => {
            card.style.borderColor = '#e0e0e0';
            card.style.background = 'white';
        });

        // Highlight selected date
        event.target.closest('.clinic-date-card').style.borderColor = '#2196f3';
        event.target.closest('.clinic-date-card').style.background = '#f3f9ff';

        // Show time slots
        showTimeSlots(dateStr);
    };

    function showTimeSlots(dateStr) {
        const timeSlotsSection = document.getElementById('time-slots-section');
        const timeSlotsContainer = document.getElementById('custom-time-slots');

        if (!timeSlotsSection || !timeSlotsContainer) return;

        // Generate time slots (10 AM to 6 PM, avoiding lunch break 2:20-3:20)
        const timeSlots = [
            '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
            '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'
        ];

        timeSlotsContainer.innerHTML = timeSlots.map(time => `
            <div class="time-slot" onclick="selectCustomTime('${dateStr}', '${time}')" style="
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            ">
                ${time}
            </div>
        `).join('');

        timeSlotsSection.style.display = 'block';
    }

    window.selectCustomTime = function(dateStr, time) {
        // Remove selection from other time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.style.borderColor = '#ddd';
            slot.style.background = 'white';
            slot.style.color = '#333';
        });

        // Highlight selected time
        event.target.style.borderColor = '#2196f3';
        event.target.style.background = '#2196f3';
        event.target.style.color = 'white';

        // Store selection
        state.selectedDate = dateStr;
        state.selectedTime = time;

        // Show booking form
        document.getElementById('booking-form-section').style.display = 'block';
    };

    window.proceedToBookingPayment = function() {
        // Validate form
        const firstName = document.getElementById('booking-first-name').value;
        const lastName = document.getElementById('booking-last-name').value;
        const email = document.getElementById('booking-email').value;

        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields');
            return;
        }

        if (!state.selectedDate || !state.selectedTime) {
            alert('Please select a date and time');
            return;
        }

        // Store booking details
        const bookingData = {
            appointmentType: state.appointmentType,
            treatments: state.selectedTreatments,
            date: state.selectedDate,
            time: state.selectedTime,
            clientDetails: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: document.getElementById('booking-phone').value
            },
            timestamp: Date.now()
        };

        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

        // Redirect to payment
        const pricing = calculatePricing();
        if (pricing.needsPayment) {
            const stripeUrl = 'https://book.stripe.com/28o28Dg5m93v6xaaEE?client_reference_id=' + encodeURIComponent(Date.now());
            window.location.href = stripeUrl;
        }
    };

    function showBookingInterceptOverlay() {
        const overlay = document.getElementById('booking-intercept-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    function loadCustomCalendar() {
        const embed = document.getElementById('calcom-embed');
        if (!embed) return;

        // Get clinic dates from config
        const clinicData = BOOKING_CONFIG.clinics.dublin;
        if (!clinicData || !clinicData.upcomingDates) return;

        const today = new Date();
        const availableDates = clinicData.upcomingDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= today;
        });

        embed.innerHTML = `
            <div class="custom-calendar-container">
                <div class="calendar-header">
                    <h3>Select your appointment time</h3>
                    <p>Choose from available clinic days</p>
                </div>
                <div class="calendar-notice">
                    <i class="fas fa-info-circle"></i>
                    <span>Payment required to confirm appointment</span>
                </div>
                <div class="clinic-dates-selection">
                    <h4>Available Dates</h4>
                    <div class="clinic-dates" id="custom-clinic-dates">
                        ${availableDates.map(dateStr => {
                            const date = new Date(dateStr);
                            const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
                            const dayMonth = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                            return `
                                <div class="clinic-date-card" data-date="${dateStr}">
                                    <div class="date-day">${dayName}</div>
                                    <div class="date-number">${dayMonth}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="time-slots-selection" id="custom-time-slots" style="display:none;">
                    <h4>Available Times</h4>
                    <div class="time-slots" id="custom-time-grid"></div>
                </div>
                <div class="booking-form-section" id="custom-booking-form" style="display:none;">
                    <h4>Your Details</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="custom-name">Full Name *</label>
                            <input type="text" id="custom-name" required>
                        </div>
                        <div class="form-group">
                            <label for="custom-email">Email Address *</label>
                            <input type="email" id="custom-email" required>
                        </div>
                        <div class="form-group">
                            <label for="custom-phone">Phone Number *</label>
                            <input type="tel" id="custom-phone" required>
                        </div>
                        <div class="form-group full-width">
                            <label for="custom-notes">Additional Notes (Optional)</label>
                            <textarea id="custom-notes" rows="3" placeholder="Any specific requests or medical conditions..."></textarea>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" id="btn-proceed-payment" style="display:none;">
                        Complete Payment & Book Appointment <i class="fas fa-credit-card"></i>
                    </button>
                </div>
            </div>
        `;

        bindCustomCalendarEvents();
    }

    function bindCustomCalendarEvents() {
        // Date selection
        document.addEventListener('click', function(e) {
            const dateCard = e.target.closest('.clinic-date-card');
            if (dateCard) {
                selectCustomDate(dateCard.dataset.date);
            }
        });

        // Time selection
        document.addEventListener('click', function(e) {
            const timeSlot = e.target.closest('.time-slot');
            if (timeSlot) {
                selectCustomTime(timeSlot.dataset.time);
            }
        });

        // Form validation
        const form = document.getElementById('custom-booking-form');
        if (form) {
            form.addEventListener('input', validateCustomForm);
        }

        // Payment button
        const paymentBtn = document.getElementById('btn-proceed-payment');
        if (paymentBtn) {
            paymentBtn.addEventListener('click', proceedToPayment);
        }
    }

    function selectCustomDate(dateStr) {
        state.selectedDate = dateStr;

        // Update visual state
        document.querySelectorAll('.clinic-date-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.date === dateStr);
        });

        // Show time slots
        showCustomTimeSlots();
    }

    function showCustomTimeSlots() {
        const container = document.getElementById('custom-time-slots');
        const grid = document.getElementById('custom-time-grid');

        const timeSlots = [
            '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
            '12:00', '12:20', '12:40', '13:00', '13:20', '13:40',
            '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
            '16:00', '16:20', '16:40', '17:00', '17:20', '17:40'
        ];

        grid.innerHTML = timeSlots.map(time => `
            <div class="time-slot" data-time="${time}">${time}</div>
        `).join('');

        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    }

    function selectCustomTime(time) {
        state.selectedTime = time;

        // Update visual state
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.toggle('selected', slot.dataset.time === time);
        });

        // Show booking form
        const form = document.getElementById('custom-booking-form');
        if (form) {
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function validateCustomForm() {
        const name = document.getElementById('custom-name').value.trim();
        const email = document.getElementById('custom-email').value.trim();
        const phone = document.getElementById('custom-phone').value.trim();

        const isValid = name && email && phone && state.selectedDate && state.selectedTime;
        const paymentBtn = document.getElementById('btn-proceed-payment');

        if (paymentBtn) {
            paymentBtn.style.display = isValid ? 'block' : 'none';
        }

        // Store details
        state.clientDetails = {
            name: name,
            email: email,
            phone: phone,
            notes: document.getElementById('custom-notes').value.trim()
        };
    }

    function proceedToPayment() {
        // Store booking details for after payment
        localStorage.setItem('pendingBooking', JSON.stringify({
            appointmentType: state.appointmentType,
            treatments: state.selectedTreatments,
            date: state.selectedDate,
            time: state.selectedTime,
            clientDetails: state.clientDetails,
            timestamp: Date.now()
        }));

        // Redirect to payment
        const pricing = calculatePricing();
        if (pricing.needsPayment) {
            const paymentLink = 'https://book.stripe.com/28o28Dg5m93v6xaaEE';
            window.location.href = paymentLink;
        } else {
            showConfirmation();
        }
    }

    function showPaymentRedirect() {
        // This is no longer needed since we handle it in proceedToPayment
        proceedToPayment();
    }


    function showPaymentNotice() {
        // Calculate pricing to determine if payment is needed
        const pricing = calculatePricing();

        // For treatments requiring deposit, redirect to payment immediately
        if (pricing.needsPayment) {
            // Show a brief message then redirect to Stripe
            showToast('Booking complete! Redirecting to secure payment...');
            setTimeout(function() {
                const paymentLink = 'https://book.stripe.com/28o28Dg5m93v6xaaEE';
                window.location.href = paymentLink;
            }, 2000);
        } else {
            // For free consultations, show confirmation directly
            showConfirmation();
        }
    }

    function showConfirmation() {
        // Calculate pricing to determine if payment is needed
        const pricing = calculatePricing();

        // If payment is needed, redirect to Stripe
        if (pricing.needsPayment) {
            const paymentLink = 'https://book.stripe.com/28o28Dg5m93v6xaaEE';
            window.location.href = paymentLink;
        } else {
            // For free consultations, show confirmation
            const banner = document.getElementById('booking-confirmation');
            if (banner) banner.classList.add('visible');
        }
    }

    function showToast(message) {
        const existing = document.querySelector('.booking-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'booking-toast';
        toast.textContent = message;
        toast.style.cssText =
            'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);' +
            'background:#222;color:#fff;padding:12px 24px;border-radius:8px;' +
            'z-index:9999;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,0.2);';
        document.body.appendChild(toast);
        setTimeout(function () { toast.remove(); }, 3000);
    }
})();