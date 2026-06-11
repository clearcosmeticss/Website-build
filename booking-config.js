/**
 * ClearCosmetics Booking Configuration
 * Update this file when you add new clinic dates or change Calendly links.
 */
const BOOKING_CONFIG = {
    brand: {
        primaryColor: '222222',
        backgroundColor: 'f5e6e0',
        textColor: '222222'
    },

    // Cal.com integration for booking system
    calcom: {
        username: 'clearcosmetics',

        // Dublin clinic - Cal.com appointment types
        dublin: {
            consultation: 'https://cal.com/clearcosmetics/consultation',
            treatment: 'https://cal.com/clearcosmetics/single-treatment',
            multiple: 'https://cal.com/clearcosmetics/multiple-treatments'
        }
    },

    // How far ahead clients can book
    schedulingWindowDays: 90,

    clinics: {
        dublin: {
            id: 'dublin',
            name: 'Dublin Clinic',
            flag: '🇮🇪',
            address: 'PrestigeLash Academy, 337 S Circular Rd, Saint James, Dublin 8, D08 WP49',
            phone: '(+353) 83 162 2444',
            email: 'Clearcosmeticss@gmail.com',
            // Update these dates each quarter (2–3 clinic days per month)
            upcomingDates: [
                '2026-07-10',
                '2026-07-11'
            ],
            hours: '10:00 AM – 6:00 PM',
            note: 'Clinic days are limited — book early to secure your preferred time.'
        },
        marbella: {
            id: 'marbella',
            name: 'Marbella Clinic',
            flag: '🇪🇸',
            address: 'Casas Sevilla 2, Av. Playas del Duque, Local 7, Nueva Andalucía, 29660 Marbella',
            phone: '(+353) 83 162 2444',
            email: 'Clearcosmeticss@gmail.com',
            upcomingDates: [
                // Currently no scheduled dates - check Cal.com for updates
            ],
            hours: '10:00 AM – 6:00 PM',
            note: 'Clinic days are limited — book early to secure your preferred time.'
        }
    },

    appointmentTypes: [
        {
            id: 'consultation',
            title: 'Free Consultation',
            duration: '20 minutes',
            description: 'Discuss your goals, ask questions, and get a personalised treatment plan.',
            icon: 'fa-comments'
        },
        {
            id: 'treatment',
            title: 'Single Treatment',
            duration: '20 minutes',
            description: 'Book one specific treatment. Perfect for touch-ups or single procedures.',
            icon: 'fa-syringe'
        },
        {
            id: 'multiple',
            title: 'Multiple Treatments',
            duration: '40–60 minutes',
            description: 'Combine multiple treatments in one session for the best results and value.',
            icon: 'fa-magic'
        }
    ],

    treatments: [
        // DERMAL FILLERS
        'Lip Enhancement - 0.5ml',
        'Lip Enhancement - 0.7ml',
        'Lip Enhancement - 1ml',
        'Smile Line (1ml)',
        'Marionnette Lines (1ml)',
        'Nasolabial Folds (1ml)',
        'Under-Eye (Teartrough)',
        'Five Point Face Lift',
        'Non-Surgical Rhinoplasty',
        'Dermal Filler Dissolving',

        // BOTOX
        'Botox - One Area',
        'Botox - Two Areas',
        'Botox - Three Areas',
        'Botox - Four Areas',
        'Nostril Flare',
        'Bunny Lines',
        'Jowls / Jawline',
        'Lip Flip',
        'Neck Botox (Barbie Tox)',
        'Trap Botox',
        'Buttock Lift',
        'Masseter',
        'Hyperhydrosis (Under Arms)',

        // FAT DISSOLVING
        'Fat Dissolving - Small Area (Cheeks/Chin/Jaw)',
        'Fat Dissolving - Large Area (Legs/Stomach/Back)',
        'Fat Dissolving - Large + Small Area',
        'Fat Dissolving - Two Sessions Small Area',
        'Fat Dissolving - Three Sessions Large Area',

        // SKIN BOOSTERS
        'Profhilo',
        'Seventy Hyal',
        'B12 Booster',
        'Lumi Eye',

        // POLYNUCLEOTIDES
        'Polynucleotides - Under-Eyes',
        'Polynucleotides - Whole Face',
        'Polynucleotides - Neck Area',
        'Polynucleotides - Three Sessions Under-Eyes',
        'Polynucleotides - Three Sessions Whole Face',
        'Polynucleotides - Three Sessions Neck Area',

        // PACKAGE DEALS
        '2ml Contour Package',
        '3ml Dermal Filler',
        '4ml Dermal Filler',
        '5ml Dermal Filler',

        // Consultation
        'Not Sure — Need Consultation'
    ],

    policies: [
        'Clinics run 2–3 days per month at each location.',
        'Appointments open up to 3 months in advance.',
        'Please arrive 5 minutes early with a valid photo ID.',
        'Cancellations within 48 hours may incur a fee.',
        'New clients: we recommend booking a free consultation first.'
    ],

    // Treatment pricing and deposits
    pricing: {
        consultation: {
            price: 0,
            deposit: 0,
            currency: 'EUR'
        },
        treatment: {
            // DERMAL FILLERS
            'Lip Enhancement - 0.5ml': { price: 180, deposit: 50 },
            'Lip Enhancement - 0.7ml': { price: 210, deposit: 50 },
            'Lip Enhancement - 1ml': { price: 250, deposit: 60 },
            'Smile Line (1ml)': { price: 250, deposit: 60 },
            'Marionnette Lines (1ml)': { price: 250, deposit: 60 },
            'Nasolabial Folds (1ml)': { price: 250, deposit: 60 },
            'Under-Eye (Teartrough)': { price: 350, deposit: 90 },
            'Five Point Face Lift': { price: 650, deposit: 160 },
            'Non-Surgical Rhinoplasty': { price: 300, deposit: 75 },
            'Dermal Filler Dissolving': { price: 220, deposit: 55 },

            // BOTOX
            'Botox - One Area': { price: 150, deposit: 40 },
            'Botox - Two Areas': { price: 200, deposit: 50 },
            'Botox - Three Areas': { price: 250, deposit: 60 },
            'Botox - Four Areas': { price: 300, deposit: 75 },
            'Nostril Flare': { price: 100, deposit: 25 },
            'Bunny Lines': { price: 150, deposit: 40 },
            'Jowls / Jawline': { price: 200, deposit: 50 },
            'Lip Flip': { price: 150, deposit: 40 },
            'Neck Botox (Barbie Tox)': { price: 250, deposit: 60 },
            'Trap Botox': { price: 350, deposit: 90 },
            'Buttock Lift': { price: 350, deposit: 90 },
            'Masseter': { price: 250, deposit: 60 },
            'Hyperhydrosis (Under Arms)': { price: 380, deposit: 95 },

            // FAT DISSOLVING
            'Fat Dissolving - Small Area (Cheeks/Chin/Jaw)': { price: 200, deposit: 50 },
            'Fat Dissolving - Large Area (Legs/Stomach/Back)': { price: 380, deposit: 95 },
            'Fat Dissolving - Large + Small Area': { price: 420, deposit: 105 },
            'Fat Dissolving - Two Sessions Small Area': { price: 300, deposit: 75 },
            'Fat Dissolving - Three Sessions Large Area': { price: 700, deposit: 175 },

            // SKIN BOOSTERS
            'Profhilo': { price: 250, deposit: 60 },
            'Seventy Hyal': { price: 250, deposit: 60 },
            'B12 Booster': { price: 40, deposit: 15 },
            'Lumi Eye': { price: 160, deposit: 40 },

            // POLYNUCLEOTIDES
            'Polynucleotides - Under-Eyes': { price: 250, deposit: 60 },
            'Polynucleotides - Whole Face': { price: 300, deposit: 75 },
            'Polynucleotides - Neck Area': { price: 300, deposit: 75 },
            'Polynucleotides - Three Sessions Under-Eyes': { price: 650, deposit: 160 },
            'Polynucleotides - Three Sessions Whole Face': { price: 800, deposit: 200 },
            'Polynucleotides - Three Sessions Neck Area': { price: 800, deposit: 200 },

            // PACKAGE DEALS
            '2ml Contour Package': { price: 375, deposit: 95 },
            '3ml Dermal Filler': { price: 500, deposit: 125 },
            '4ml Dermal Filler': { price: 625, deposit: 155 },
            '5ml Dermal Filler': { price: 750, deposit: 185 },

            // Consultation
            'Not Sure — Need Consultation': { price: 0, deposit: 0 }
        },
        currency: 'EUR',
        defaultTreatmentPrice: 300,
        defaultTreatmentDeposit: 75
    },

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BOOKING_CONFIG;
}
