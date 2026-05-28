# EmailJS Setup Guide - Easiest Email Solution

EmailJS lets you send emails directly from your website without any backend server!

## 🎯 Benefits:
- ✅ No Google Apps Script needed
- ✅ No server required
- ✅ 200 free emails per month
- ✅ 5-minute setup
- ✅ More reliable than Apps Script

## 📝 Setup Steps:

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up"
3. Create a free account

### Step 2: Connect Your Gmail
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail**
4. Click **Connect Account** and authorize EmailJS
5. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Subject:** `New Contact from {{from_name}}`

**Content:**
```
New contact form submission from ClearCosmetics website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
Submitted: {{submitted_date}}
Reply to: {{from_email}}
```

4. **Save the template** and copy the **Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Update Your Website
I'll update your website code with the EmailJS integration using your IDs.

## 📊 Free Tier Limits:
- 200 emails per month
- All basic features included
- No credit card required

## 🔧 Alternative: Formspree (Even Simpler)
If you prefer an even simpler solution:
1. Go to [Formspree.io](https://formspree.io/)
2. Just change your form action to: `action="https://formspree.io/f/YOUR_FORM_ID"`
3. 50 free submissions/month

---

**Which option would you prefer?**
- **EmailJS** (200 free emails, more customizable)
- **Formspree** (50 free emails, super simple)
- **Keep Google Apps Script** (unlimited but more complex)