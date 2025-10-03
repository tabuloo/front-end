# Formspree Setup Instructions

## What I've Done
I've integrated Formspree into your email service as a backup to EmailJS. This will automatically send emails to `tablooofficial1@gmail.com` when restaurant registrations are submitted.

## Setup Steps (2 minutes)

### Step 1: Create Formspree Account
1. Go to [formspree.io](https://formspree.io/)
2. Sign up with your Google account
3. Verify your email

### Step 2: Create New Form
1. Click "New Form"
2. Give it a name: "Tabuloo Restaurant Registration"
3. Set the recipient email to: `tablooofficial1@gmail.com`
4. Click "Create Form"

### Step 3: Get Form Endpoint
1. After creating the form, you'll see a form endpoint URL like: `https://formspree.io/f/xrgjbgqd`
2. Copy this URL

### Step 4: Update Configuration
1. Open `src/services/emailService.ts`
2. Find this line:
   ```typescript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrgjbgqd'; // Replace with your Formspree form ID
   ```
3. Replace `xrgjbgqd` with your actual form ID

### Step 5: Test
1. Save the changes
2. Try submitting a restaurant registration
3. Check `tablooofficial1@gmail.com` inbox

## What Happens Now

When someone submits a restaurant registration:

1. **First**: System tries Formspree (automatic email to you)
2. **If Formspree fails**: System tries EmailJS (if configured)
3. **If both fail**: System shows modal with email content to copy/paste

## Benefits

✅ **Automatic emails** - No manual action required  
✅ **Goes directly to your inbox** - `tablooofficial1@gmail.com`  
✅ **Professional formatting** - Clean, organized email content  
✅ **Free tier** - 50 submissions per month  
✅ **Easy setup** - Just create a form and get the URL  

## Email Content

The emails will contain:
- Restaurant name, type, address
- Food and crowd capacity
- Operating hours
- Owner contact details (email, phone)
- Images list
- Professional formatting

## Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify the form endpoint URL is correct
- Check Formspree dashboard for delivery status

**Still not working?**
- Make sure the form is set to send emails to `tablooofficial1@gmail.com`
- Check browser console for any error messages
- Verify the form ID in the code matches your Formspree form

## Alternative: Use Your Own Formspree Form

If you prefer to create your own form:
1. Create a new form at formspree.io
2. Set recipient to `tablooofficial1@gmail.com`
3. Update the `FORMSPREE_ENDPOINT` in the code with your form URL
4. The system will automatically use your form

The current integration is ready to work as soon as you create the Formspree form!
