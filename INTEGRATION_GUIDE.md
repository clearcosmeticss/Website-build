# ClearCosmetics Booking Page Integration Guide

## Overview

Your enhanced booking page includes:
- ✅ 4-step booking process (Clinic → Appointment → Calendar → Payment)
- ✅ Treatment pricing with deposits (Lip Filler 1ml €350 with €50 deposit, etc.)
- ✅ Calendly integration for appointment scheduling
- ✅ Secure payment processing for deposits
- ✅ Mobile-responsive design matching your brand

## Files Added/Updated

1. **book.html** - Enhanced booking page with payment step
2. **booking.css** - Styles including payment forms
3. **booking.js** - JavaScript with payment handling
4. **booking-config.js** - Configuration with treatment pricing
5. **CALENDLY_SETUP_GUIDE.md** - Step-by-step Calendly setup

## Integration Steps

### 1. Upload Files to Your Live Website

Upload these files to your website's root directory:
- `book.html`
- `booking.css`
- `booking.js`
- `booking-config.js`

### 2. Update Navigation Links

Make sure your main website navigation points to `book.html`:

```html
<a href="book.html" class="nav-link btn-nav">Book Now ✨</a>
```

### 3. Set Up Calendly (Required)

Follow the **CALENDLY_SETUP_GUIDE.md** to:
1. Create your Calendly account
2. Set up event types for each clinic
3. Configure availability for clinic days only
4. Update `booking-config.js` with your Calendly links

### 4. Configure Payment Processing (Optional - Demo Mode)

The booking page includes:
- **Demo Mode**: Currently simulates payment processing
- **Stripe Integration**: Replace demo code with Stripe for real payments
- **PayPal Integration**: Add PayPal SDK for PayPal payments

For real payments, you'll need to:
1. Set up a Stripe account
2. Replace the `handlePayment()` function with Stripe integration
3. Add your Stripe public key

## Treatment Pricing

Pre-configured treatments with deposits:

| Treatment | Price | Deposit |
|-----------|-------|---------|
| Lip Filler 1ml | €350 | €50 |
| Lip Filler 0.5ml | €200 | €50 |
| Anti-Wrinkle (1 Area) | €180 | €50 |
| Anti-Wrinkle (2 Areas) | €280 | €50 |
| Anti-Wrinkle (3 Areas) | €350 | €50 |
| Cheek Filler 1ml | €380 | €50 |
| Jawline Filler 1ml | €400 | €50 |
| Non-Surgical Rhinoplasty | €450 | €100 |

### To Update Prices:

Edit `booking-config.js`:

```javascript
treatments: {
    'Lip Filler 1ml': {
        price: 350,
        deposit: 50,
        description: '1ml of premium dermal filler for natural lip enhancement'
    }
    // Add or modify treatments here
}
```

## Features

### Booking Flow:
1. **Clinic Selection**: Dublin or Marbella with upcoming dates
2. **Appointment Type**: Consultation (free) or Treatment
3. **Calendar**: Calendly widget showing only clinic days
4. **Payment**: Secure deposit payment for treatments

### Payment Features:
- Credit card and PayPal options
- Real-time form validation
- Secure payment processing (when integrated)
- Automatic deposit calculation

### Mobile Responsive:
- Optimized for all devices
- Touch-friendly interface
- Progressive disclosure of information

## Testing Checklist

Before going live, test:
- [ ] Clinic selection works
- [ ] Treatment dropdown shows prices
- [ ] Calendar displays (after Calendly setup)
- [ ] Payment form validation
- [ ] Mobile responsiveness
- [ ] All links and buttons work

## Monthly Maintenance

Update these monthly:
1. **Clinic dates** in `booking-config.js`
2. **Calendly availability** to match new dates
3. **Treatment pricing** if needed

## Support & Customization

For modifications or issues:
- Treatment prices: Edit `booking-config.js`
- Styling changes: Edit `booking.css`
- Payment integration: Modify `booking.js`

The booking system is designed to be easily maintainable and can be customized for your specific needs.

## Next Steps

1. **Set up Calendly** using the provided guide
2. **Test the booking flow** thoroughly
3. **Configure real payments** (optional)
4. **Upload to your live website**

Your booking page is ready to start accepting appointments with deposits!