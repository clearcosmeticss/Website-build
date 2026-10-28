# 🧪 TESTING THE BOOKING FIX

## ⚡ QUICK TEST (2 minutes)

1. **Open booking page** in incognito/private window:
   ```
   https://your-website.com/book.html
   ```

2. **Select "Single Treatment"**
3. **Choose any treatment** (e.g., "Lip Enhancement - 1ml")
4. **Click "Continue"**
5. **Cal.com should load** showing dates/times

## ✅ WHAT YOU SHOULD SEE

### BEFORE (Broken Flow) ❌
- Cal.com loads
- Fill out form
- Click book
- **POPUP appears** asking for payment
- Redirected to standalone Stripe page
- Pay deposit
- **Cal.com doesn't know about payment**
- Receive "please pay deposit" email

### AFTER (Fixed Flow) ✅
- Cal.com loads
- Select date/time
- Fill out form
- **Cal.com shows payment section** (built-in Stripe)
- Pay deposit within Cal.com
- **Booking confirms immediately**
- Receive "booking confirmed" email
- Payment shows as "paid" in Cal.com dashboard

## 🔍 DETAILED TEST CHECKLIST

- [ ] Appointment type selection works
- [ ] Treatment dropdown shows correctly
- [ ] "Continue" button advances to Cal.com
- [ ] Cal.com iframe loads without errors
- [ ] Selected treatments appear in Cal.com notes
- [ ] Date/time selection works in Cal.com
- [ ] Customer details form appears in Cal.com
- [ ] **Payment section appears IN Cal.com** (not popup)
- [ ] Stripe payment processes successfully
- [ ] Confirmation message appears immediately
- [ ] Email confirmation arrives
- [ ] Cal.com dashboard shows booking as "paid"

## 🎯 TEST WITH REAL BOOKING

If you want to test with a real booking:

1. Use Stripe **test mode** if available
2. Or book a real appointment for yourself
3. Complete the full payment flow
4. Check your Cal.com dashboard:
   - Booking should show "Paid" status
   - Payment amount should match deposit
   - Customer details should be complete

## 🚨 IF IT DOESN'T WORK

### Issue: Cal.com doesn't show payment section

**Cause:** Stripe not connected in Cal.com settings

**Fix:**
1. Go to Cal.com dashboard
2. Settings → Payments
3. Connect Stripe account
4. Enable "Require payment" for event types

### Issue: Payment processes but booking still says "unpaid"

**Cause:** Wrong Stripe account connected

**Fix:**
1. Verify the Stripe account in Cal.com matches your payment link
2. Check webhook endpoints in Stripe dashboard
3. Ensure Cal.com has correct Stripe API keys

### Issue: Popup still appears asking for payment

**Cause:** Browser cache showing old JavaScript

**Fix:**
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache completely
3. Try in incognito/private window
4. Verify `booking.js` was uploaded correctly

## 📊 VERIFY IN CAL.COM DASHBOARD

After test booking, check:

1. **Bookings page:**
   - New booking appears
   - Status shows "Paid" ✅
   - Payment amount correct
   - Customer email correct

2. **Event Types:**
   - Payment is enabled ✅
   - Stripe is connected ✅
   - Correct deposit amount set

3. **Payments Tab:**
   - Transaction appears
   - Amount matches deposit
   - Status is "succeeded"

## 💡 DEBUGGING TIPS

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for Cal.com messages:
   ```
   ✅ Should see: "Cal.com booking + payment completed!"
   ❌ Should NOT see: "Showing payment overlay"
   ```

### Check Network Tab

1. Open DevTools → Network tab
2. Load booking page
3. Look for:
   - `cal.com` requests (should be present)
   - `book.stripe.com` redirect (should NOT happen before Cal.com completes)

### Verify File Upload

Make sure the new `booking.js` is actually on your server:

```bash
# Check file size - should be ~22KB
ls -lh booking.js

# Check last modified date - should be today
stat booking.js
```

## 🎉 SUCCESS CRITERIA

Booking system is working correctly when:

✅ Customer can complete entire booking in Cal.com  
✅ Payment is processed within Cal.com checkout  
✅ Booking shows "Paid" status immediately  
✅ Only ONE confirmation email is sent  
✅ No "please pay deposit" emails  
✅ Payment appears in Stripe dashboard  
✅ Cal.com dashboard shows complete booking details  

---

**Questions?** Check `BOOKING-FIX-SUMMARY.md` for technical details.
