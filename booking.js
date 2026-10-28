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

        // Check if user is returning from successful Cal.com booking
        checkBookingReturn();
    }

    function checkBookingReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('booking') === 'success') {
            showBookingSuccessConfirmation();
        }
    }

    function showBookingSuccessConfirmation() {
        // Hide all booking steps
        document.querySelectorAll('.booking-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        // Show success message
        const successHtml = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #4caf50; margin-bottom: 24px;"></i>
                <h2 style="color: #222; margin-bottom: 16px;">🎉 Booking Confirmed!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 24px;">Your appointment and payment have been confirmed.</p>
                <p style="color: #666; margin-bottom: 32px;">You'll receive a confirmation email shortly with your appointment details.</p>

                <div style="background: #f5f5f5; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
                    <h4 style="margin: 0 0 16px 0; color: #222;">Next Steps:</h4>
                    <ul style="text-align: left; color: #666; line-height: 1.6;">
                        <li>Check your email for appointment confirmation</li>
                        <li>Save the appointment to your calendar</li>
                        <li>Prepare for your visit (bring ID)</li>
                        <li>Your deposit has been paid and will be deducted from the final cost</li>
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

        document.title = 'Booking Confirmed - ClearCosmetics';
    }

    function setDefaultClinic() {
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

        container.innerHTML = `
            <button type="button" class="appointment-card" data-type="consultation">
                <div class="appointment-card-radio"></div>
                <div class="appointment-card-header">
                    <div class="appointment-card-icon"><i class="fas fa-comments"></i></div>
                    <div class="appointment-card-content">
                        <h4 class="appointment-card-title">Free Consultation</h4>
                        <p class="appointment-card-description">Meet with Roxzi to discuss your aesthetic goals, explore treatment options, and receive a personalised plan tailored specifically to your unique facial features and desired outcomes.</p>
                        <div class="appointment-card-price">Complimentary · 20 minutes</div>
                    </div>
                </div>
            </button>
            <button type="button" class="appointment-card" data-type="treatment">
                <div class="appointment-card-radio"></div>
                <div class="appointment-card-header">
                    <div class="appointment-card-icon"><i class="fas fa-syringe"></i></div>
                    <div class="appointment-card-content">
                        <h4 class="appointment-card-title">Single Treatment</h4>
                        <p class="appointment-card-description">Book one specific treatment such as dermal fillers, anti-wrinkle injections, or skin boosters — perfect for maintenance appointments or targeted enhancements to achieve your desired look.</p>
                        <div class="appointment-card-price">From €150 · 20–30 minutes</div>
                    </div>
                </div>
            </button>
            <button type="button" class="appointment-card" data-type="multiple">
                <div class="appointment-card-radio"></div>
                <div class="appointment-card-header">
                    <div class="appointment-card-icon"><i class="fas fa-sparkles"></i></div>
                    <div class="appointment-card-content">
                        <h4 class="appointment-card-title">Multiple Treatments</h4>
                        <p class="appointment-card-description">Combine multiple treatments in a single comprehensive session to address various areas and achieve balanced, harmonious results across your entire face while receiving better overall value.</p>
                        <div class="appointment-card-price">From €375 · 40–60 minutes</div>
                    </div>
                </div>
            </button>
        `;

        const treatmentGroup = document.getElementById('treatment-select-group');
        if (treatmentGroup) {
            treatmentGroup.style.display = 'none';
        }
    }

    function renderTreatmentDropdown() {
        const container = document.getElementById('treatment-list');
        if (!container) return;

        // Categorize treatments
        const categories = {
            'Dermal Fillers': [],
            'Botox': [],
            'Skin Boosters': [],
            'Polynucleotides': [],
            'Fat Dissolving': [],
            'Package Deals': []
        };

        BOOKING_CONFIG.treatments.forEach(function (treatment) {
            if (treatment.includes('Polynucleotides')) {
                categories['Polynucleotides'].push(treatment);
            } else if (treatment.includes('Lip Enhancement') || treatment.includes('Smile Line') ||
                treatment.includes('Marionnette') || treatment.includes('Nasolabial') ||
                treatment.includes('Under-Eye') || treatment.includes('Five Point') ||
                treatment.includes('Non-Surgical Rhinoplasty') || treatment.includes('Dermal Filler Dissolving')) {
                categories['Dermal Fillers'].push(treatment);
            } else if (treatment.includes('Botox') || treatment.includes('Nostril') ||
                      treatment.includes('Bunny') || treatment.includes('Jowls') ||
                      treatment.includes('Lip Flip') || treatment.includes('Neck Botox') ||
                      treatment.includes('Trap') || treatment.includes('Buttock') ||
                      treatment.includes('Masseter') || treatment.includes('Hyperhydrosis')) {
                categories['Botox'].push(treatment);
            } else if (treatment.includes('Fat Dissolving')) {
                categories['Fat Dissolving'].push(treatment);
            } else if (treatment.includes('Profhilo') || treatment.includes('Seventy') ||
                      treatment.includes('B12') || treatment.includes('Lumi')) {
                categories['Skin Boosters'].push(treatment);
            } else if (treatment.includes('Package') || treatment.includes('ml Dermal Filler')) {
                categories['Package Deals'].push(treatment);
            }
        });

        let html = '<div class="treatment-categories">';

        Object.keys(categories).forEach(function (categoryName) {
            const treatments = categories[categoryName];
            if (treatments.length === 0) return;

            html += '<div class="treatment-category">';
            html += '<h4 class="treatment-category-title">' + categoryName + '</h4>';
            html += '<div class="treatment-grid">';

            treatments.forEach(function (treatment) {
                html += (
                    '<div class="treatment-option" data-treatment="' + treatment + '">' +
                        '<div class="treatment-option-checkbox"></div>' +
                        '<div class="treatment-option-label">' + treatment + '</div>' +
                    '</div>'
                );
            });

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
    }

    function renderPolicies() {
        const list = document.getElementById('booking-policies');
        if (!list) return;

        list.innerHTML = BOOKING_CONFIG.policies.map(function (policy) {
            return '<li><i class="fas fa-check-circle"></i><span>' + policy + '</span></li>';
        }).join('');
    }

    function bindEvents() {
        document.getElementById('appointment-type-cards').addEventListener('click', function (e) {
            const card = e.target.closest('[data-type]');
            if (!card) return;
            selectAppointmentType(card.dataset.type);
        });

        const treatmentList = document.getElementById('treatment-list');

        if (treatmentList) {
            treatmentList.addEventListener('click', function (e) {
                const treatmentOption = e.target.closest('.treatment-option');
                if (!treatmentOption) return;

                const treatment = treatmentOption.dataset.treatment;
                if (!treatment) return;

                const isSelected = state.selectedTreatments.includes(treatment);
                if (isSelected) {
                    state.selectedTreatments = state.selectedTreatments.filter(t => t !== treatment);
                    treatmentOption.classList.remove('selected');
                } else {
                    if (state.appointmentType === 'treatment') {
                        state.selectedTreatments = [treatment];
                        document.querySelectorAll('.treatment-option').forEach(opt => opt.classList.remove('selected'));
                        treatmentOption.classList.add('selected');
                    } else {
                        state.selectedTreatments.push(treatment);
                        treatmentOption.classList.add('selected');
                    }
                }

                updateSelectedTreatments();
                e.stopPropagation();
            });
        }

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
                showToast('Single treatment appointments can only have one treatment.');
                return;
            }
            goToStep(2);
            loadCalcom();
        });

        document.getElementById('btn-step-2-back').addEventListener('click', function () {
            goToStep(1);
        });

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

        const treatmentGroup = document.getElementById('treatment-select-group');
        if (treatmentGroup) {
            treatmentGroup.style.display = (typeId === 'treatment' || typeId === 'multiple') ? 'block' : 'none';
        }

        updateSummary();
    }

    function updateSelectedTreatments() {
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
        document.querySelectorAll('.booking-step-indicator').forEach(function (el) {
            const stepNum = parseInt(el.dataset.step, 10);
            el.classList.toggle('active', stepNum === state.step);
            el.classList.toggle('completed', stepNum < state.step);
        });

        document.querySelectorAll('.booking-panel').forEach(function (el) {
            const isActive = parseInt(el.dataset.step, 10) === state.step;
            el.classList.toggle('active', isActive);
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

        updatePaymentSummary();
    }

    function updatePaymentSummary() {
        if (!state.appointmentType) return;

        const pricing = calculatePricing();

        document.getElementById('total-price').textContent = `€${pricing.totalPrice}`;
        document.getElementById('deposit-amount').textContent = `€${pricing.deposit}`;
        document.getElementById('remaining-amount').textContent = `€${pricing.remaining}`;

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

        let totalPrice = 0;
        const flatDeposit = 50;

        if (state.selectedTreatments.length === 0) {
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

    function setSummaryValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function getCalcomUrl() {
        if (!state.appointmentType) return null;

        const urls = BOOKING_CONFIG.calcom.dublin;
        if (!urls) return null;

        let url = urls[state.appointmentType];
        if (!url || url.includes('YOUR_CALENDLY_USERNAME')) return null;

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

        // Add selected treatments as notes to Cal.com
        let calcomUrl = url;
        if (state.selectedTreatments.length > 0) {
            const treatmentsText = state.selectedTreatments.join(', ');
            const separator = calcomUrl.includes('?') ? '&' : '?';
            calcomUrl += `${separator}name=&guests=&notes=${encodeURIComponent('Selected treatments: ' + treatmentsText)}`;
        }

        // Render Cal.com iframe - let it handle payment with its own Stripe integration
        embed.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-calendar-check" style="color: #4caf50; font-size: 1.5rem; margin-right: 8px;"></i>
                <h3 style="color: #333; margin-bottom: 8px;">Select Your Date & Time</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Complete your booking through Cal.com</p>
                ${state.selectedTreatments.length > 0 ? `<p style="color: #2196f3; font-size: 0.9rem; margin-top: 8px;"><strong>Selected:</strong> ${state.selectedTreatments.join(', ')}</p>` : ''}
            </div>
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
                <p style="margin: 0; color: #1565c0; font-size: 0.95rem;">
                    <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                    <strong>Cal.com will collect your deposit payment during checkout.</strong> Your booking will be confirmed once payment is complete.
                </p>
            </div>
            <div style="width: 100%; height: 700px; border: 2px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <iframe src="${calcomUrl}" style="width: 100%; height: 100%; border: none;" allow="payment"></iframe>
            </div>
        `;

        // Listen for Cal.com booking completion (no payment interception!)
        window.addEventListener('message', function(event) {
            if (event.origin.includes('cal.com')) {
                console.log('Cal.com message:', event.data);

                // Only show success when Cal.com confirms the booking is complete
                if (event.data.type === 'bookingSuccessful' ||
                    (event.data.payload && event.data.payload.type === 'bookingSuccessful')) {
                    console.log('✅ Cal.com booking + payment completed!');
                    showBookingSuccess();
                }
            }
        });
    }

    function showBookingSuccess() {
        const confirmationBanner = document.getElementById('booking-confirmation');
        if (confirmationBanner) {
            confirmationBanner.classList.add('visible');
            confirmationBanner.style.display = 'block';
            confirmationBanner.scrollIntoView({ behavior: 'smooth' });
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
