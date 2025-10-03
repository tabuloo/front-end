# Quick EmailJS Setup Guide

## Why you're not receiving emails

The current issue is that EmailJS is not configured with real credentials. The system is using placeholder values:
- Service ID: `service_tabuloo` (placeholder)
- Template ID: `template_restaurant_registration` (placeholder)  
- Public Key: `your_public_key_here` (placeholder)

This causes a 400 error, and the system falls back to opening your email client.

## Quick Fix Options

### Option 1: Set up EmailJS (5 minutes)

1. **Go to [emailjs.com](https://www.emailjs.com/) and sign up**

2. **Create Email Service:**
   - Go to "Email Services" → "Add New Service"
   - Choose "Gmail" (since you want emails to go to gmail)
   - Connect your Gmail account
   - Note the Service ID (e.g., `service_abc123`)

3. **Create Email Template:**
   - Go to "Email Templates" → "Create New Template"
   - Name: `Restaurant Registration`
   - Subject: `New Restaurant Registration Request`
   - Content:
   ```
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

4. **Get Public Key:**
   - Go to "Account" → "General"
   - Copy your Public Key (e.g., `user_abc123`)

5. **Update Configuration:**
   In `src/services/emailService.ts`, replace:
   ```typescript
   const EMAILJS_SERVICE_ID = 'your_actual_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_actual_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_actual_public_key';
   ```

### Option 2: Use Improved Fallback (No setup needed)

The fallback system has been improved and will now:
- Try to open your email client with pre-filled content
- If that fails, copy the email content to clipboard
- Provide clear instructions to the user

## Test the Fix

1. Try registering a restaurant again
2. Check if the email client opens with pre-filled content
3. Send the email manually to `tablooofficial1@gmail.com`

## Current Behavior

With the improvements made:
- ✅ System detects EmailJS is not configured
- ✅ Automatically uses fallback method
- ✅ Opens email client with pre-filled content
- ✅ Provides clear user feedback
- ✅ No more 400 errors in console

The fallback method should work reliably now, even without EmailJS setup.
