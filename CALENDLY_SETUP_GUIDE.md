# Calendly Setup Guide for ClearCosmetics

This guide will help you connect your Calendly account to your booking page so customers can book appointments directly.

## Step 1: Create Your Calendly Account

1. Go to [calendly.com](https://calendly.com) and sign up
2. Choose a username (this will be in your booking links)
3. Complete your profile setup

## Step 2: Create Event Types for Each Clinic

You need to create 4 event types total:

### For Dublin Clinic:
1. **Dublin Consultation** (20 minutes)
   - Name: "Free Consultation - Dublin"
   - Duration: 20 minutes
   - Location: PrestigeLash Academy, 337 S Circular Rd, Saint James, Dublin 8

2. **Dublin Treatment** (60 minutes)
   - Name: "Treatment Appointment - Dublin"
   - Duration: 60 minutes
   - Location: PrestigeLash Academy, 337 S Circular Rd, Saint James, Dublin 8

### For Marbella Clinic:
3. **Marbella Consultation** (20 minutes)
   - Name: "Free Consultation - Marbella"
   - Duration: 20 minutes
   - Location: Casas Sevilla 2, Av. Playas del Duque, Local 7, Nueva Andalucía, 29660 Marbella

4. **Marbella Treatment** (60 minutes)
   - Name: "Treatment Appointment - Marbella"
   - Duration: 60 minutes
   - Location: Casas Sevilla 2, Av. Playas del Duque, Local 7, Nueva Andalucía, 29660 Marbella

## Step 3: Set Your Availability

**IMPORTANT**: Set your availability to match your clinic days only:

### Dublin Clinic Days (2026):
- June 14-15
- July 12-13
- August 9-10
- September 6-7

### Marbella Clinic Days (2026):
- June 21-22
- July 19-20
- August 16-17
- September 13-14

**Hours**: 10:00 AM - 6:00 PM for all clinic days

### How to set specific dates:
1. In each event type, go to "When can people book this event?"
2. Select "Date specific hours"
3. Add each clinic day individually
4. Set hours to 10:00 AM - 6:00 PM

## Step 4: Update booking-config.js

1. Open `booking-config.js` in your website folder
2. Replace `YOUR_CALENDLY_USERNAME` with your actual Calendly username
3. Update the URLs with your actual Calendly links:

```javascript
calendly: {
    username: 'your-actual-username',
    dublin: {
        consultation: 'https://calendly.com/your-username/dublin-consultation',
        treatment: 'https://calendly.com/your-username/dublin-treatment'
    },
    marbella: {
        consultation: 'https://calendly.com/your-username/marbella-consultation',
        treatment: 'https://calendly.com/your-username/marbella-treatment'
    }
}
```

## Step 5: Add Custom Questions (Optional)

In each Calendly event, you can add these custom questions:
1. "What treatment are you interested in?" (Multiple choice)
2. "Have you visited ClearCosmetics before?" (Yes/No)
3. "Any specific concerns or questions?" (Text)

## Step 6: Set Up Notifications

1. Go to Calendly Settings > Notifications
2. Enable email notifications for new bookings
3. Consider SMS notifications for last-minute cancellations

## Step 7: Test Your Setup

1. Save your changes to `booking-config.js`
2. Open your booking page
3. Try booking a test appointment
4. Verify that the calendar shows your clinic days only

## Monthly Maintenance

**Every month**, you'll need to:
1. Update the `upcomingDates` in `booking-config.js` with next month's clinic days
2. Update your Calendly availability to include new clinic days

## Troubleshooting

### Calendar doesn't show:
- Check that your Calendly username is correct in `booking-config.js`
- Make sure your event URLs are correct and public
- Verify you've set availability for the dates

### Wrong dates showing:
- Update your Calendly availability to match your clinic days
- Check that `upcomingDates` in config matches your Calendly dates

### Customers can't book:
- Ensure your event types are set to "Public"
- Check that you have available time slots
- Verify your booking window allows advance booking

## Support

If you need help:
- WhatsApp: +353 83 162 2444
- Email: Clearcosmeticss@gmail.com