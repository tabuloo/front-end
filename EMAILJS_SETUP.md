# EmailJS Setup Guide for Tabuloo

## Overview
This guide will help you set up EmailJS to automatically send restaurant registration emails to `tablooofficial1@gmail.com`.

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

### Template Settings:
- **Template Name**: `Restaurant Registration`
- **Template ID**: `template_restaurant_registration`

### Template Content:
```
Subject: New Restaurant Registration Request

Hello Admin,

A new restaurant registration request has been submitted.

Restaurant Details:
- Name: {{restaurant_name}}
- Type: {{restaurant_type}}
- Address: {{restaurant_address}}
- Food Capacity: {{food_capacity}}
- Crowd Capacity: {{crowd_capacity}}
- Operating Hours: {{operating_hours}}
- Images: {{images_list}}

Owner Contact:
- Email: {{owner_email}}
- Phone: {{owner_phone}}

Please verify and respond with credentials within 24-48 hours.

Thank you,
Tabuloo Registration System
```

## Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `user_xxxxxxxxxxxxx`)

## Step 5: Update Configuration
Update the following in `src/services/emailService.ts`:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'template_restaurant_registration';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

## Step 6: Test Configuration
1. Save the changes
2. Test the restaurant registration form
3. Check if emails are received at `tablooofficial1@gmail.com`

## Troubleshooting
- **Email not received**: Check spam folder
- **Service not working**: Verify service ID and template ID
- **Authentication error**: Check public key
- **Template error**: Verify template variables match the code

## Fallback
If EmailJS fails, the system will automatically fall back to opening the user's email client with a pre-filled message.

## Support
For EmailJS issues, check their [documentation](https://www.emailjs.com/docs/) or contact their support.
