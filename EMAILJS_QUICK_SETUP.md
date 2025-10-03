# Quick EmailJS Setup for Automatic Email Sending

## Why emails aren't being sent automatically

The current EmailJS configuration uses placeholder values:
- Service ID: `service_tabuloo` (placeholder)
- Template ID: `template_restaurant_registration` (placeholder)  
- Public Key: `your_public_key_here` (placeholder)

This means emails are not actually being sent to `tablooofficial1@gmail.com`.

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up with your Google account (recommended since you want to send to Gmail)
3. Verify your email

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail"
4. Connect your Gmail account (the one you want to send emails from)
5. **Important**: Note down the Service ID (e.g., `service_abc123xyz`)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use these exact settings:

**Template Settings:**
- **Template Name**: `Restaurant Registration`
- **Template ID**: `template_restaurant_registration`

**Template Content:**
```
Subject: New Restaurant Registration Request - {{restaurant_name}}

Hello Admin,

A new restaurant registration request has been submitted through Tabuloo.

Restaurant Details:
• Name: {{restaurant_name}}
• Type: {{restaurant_type}}
• Address: {{restaurant_address}}
• Food Capacity: {{food_capacity}}
• Crowd Capacity: {{crowd_capacity}}
• Operating Hours: {{operating_hours}}
• Images: {{images_list}}

Owner Contact:
• Email: {{owner_email}}
• Phone: {{owner_phone}}

Action Required:
1. Verify the restaurant and owner's details
2. Create owner credentials (username & password)
3. Send credentials to owner email above

Please respond within 24-48 hours.

Thank you,
Tabuloo Registration System
```

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `user_abc123xyz`)

### Step 5: Update Configuration
Update the values in `src/services/emailService.ts`:

```typescript
// Replace these placeholder values with your actual EmailJS credentials:
const EMAILJS_SERVICE_ID = 'your_actual_service_id_here';        // e.g., 'service_abc123xyz'
const EMAILJS_TEMPLATE_ID = 'template_restaurant_registration'; // Keep this as is
const EMAILJS_PUBLIC_KEY = 'your_actual_public_key_here';       // e.g., 'user_abc123xyz'
```

### Step 6: Test
1. Save the changes
2. Try registering a restaurant
3. Check `tablooofficial1@gmail.com` inbox for the email

## Alternative: Use a Different Email Service

If you prefer not to use EmailJS, you can also use:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (pay-per-use)

## Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify the email service is connected properly
- Check EmailJS dashboard for delivery status

**Still not working?**
- Double-check all credentials are correct
- Make sure template variables match exactly
- Check browser console for error messages
