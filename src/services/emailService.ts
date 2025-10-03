import emailjs from '@emailjs/browser';
import { sendEmailViaWeb3Forms } from './webhookEmailService';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_tabuloo'; // You'll need to create this in EmailJS
const EMAILJS_TEMPLATE_ID = 'template_restaurant_registration'; // You'll need to create this in EmailJS
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // You'll get this from EmailJS

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Formspree configuration (quick and easy email service)
// const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID_HERE'; // Replace with your actual Formspree form ID

export interface RestaurantRegistrationEmailData {
  restaurantName: string;
  restaurantType: string;
  restaurantAddress: string;
  foodServingCapacity: number;
  crowdCapacity: number;
  operatingHours: string;
  ownerEmail: string;
  ownerPhone: string;
  imagesList: string;
  toEmail: string;
}

export interface EmailContent {
  subject: string;
  body: string;
  recipient: string;
}

// Send email via Formspree (simple and reliable)
export const sendViaFormspree = async (data: RestaurantRegistrationEmailData): Promise<{ success: boolean; message: string }> => {
  // Formspree endpoint not configured yet - skip to fallback
  throw new Error('Formspree not configured - using fallback method');
};

export const sendRestaurantRegistrationEmail = async (data: RestaurantRegistrationEmailData): Promise<{ success: boolean; message: string; emailContent?: EmailContent }> => {
  try {
    console.log('Attempting to send restaurant registration email...');
    
    // Try Web3Forms first (working email service)
    try {
      const web3FormsResult = await sendEmailViaWeb3Forms(data);
      if (web3FormsResult.success) {
        return web3FormsResult;
      }
    } catch (web3Error) {
      console.warn('Web3Forms failed, trying other methods:', web3Error);
    }
    
    // Try Formspree (if configured)
    try {
      const formspreeResult = await sendViaFormspree(data);
      if (formspreeResult.success) {
        return formspreeResult;
      }
    } catch (formspreeError) {
      console.warn('Formspree failed, trying other methods:', formspreeError);
    }
    
    // Check if EmailJS is properly configured
    if (EMAILJS_PUBLIC_KEY === 'your_public_key_here' || 
        EMAILJS_SERVICE_ID === 'service_tabuloo' || 
        EMAILJS_TEMPLATE_ID === 'template_restaurant_registration') {
      console.warn('EmailJS not configured. Using fallback method.');
      const fallbackResult = await sendEmailFallback(data);
      // Return fallback result with emailContent for modal
      return fallbackResult;
    }
    
    const templateParams = {
      to_email: data.toEmail,
      restaurant_name: data.restaurantName,
      restaurant_type: data.restaurantType,
      restaurant_address: data.restaurantAddress,
      food_capacity: data.foodServingCapacity,
      crowd_capacity: data.crowdCapacity,
      operating_hours: data.operatingHours || 'N/A',
      owner_email: data.ownerEmail,
      owner_phone: data.ownerPhone,
      images_list: data.imagesList,
      from_name: 'Tabuloo Registration System',
      reply_to: data.ownerEmail
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('EmailJS response:', response);
    
    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully to admin!'
      };
    } else {
      return {
        success: false,
        message: `Email failed with status: ${response.status}`
      };
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    
    // If it's a configuration error or any other error, use fallback
    if (error instanceof Error && (
      error.message.includes('Invalid service') || 
      error.message.includes('Invalid template') ||
      error.message.includes('Invalid public key') ||
      error.message.includes('Formspree failed') ||
      error.message.includes('Web3Forms failed') ||
      error.message.includes('not configured')
    )) {
      console.warn('Email service error. Using fallback method.');
      return await sendEmailFallback(data);
    }
    
    return {
      success: false,
      message: `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Generate email content for manual sending
export const generateEmailContent = (data: RestaurantRegistrationEmailData): EmailContent => {
  const subject = 'New Restaurant Registration Request';
  const body = `
New Restaurant Registration Request

Restaurant Details:
• Name: ${data.restaurantName}
• Type: ${data.restaurantType}
• Address: ${data.restaurantAddress}
• Food Capacity: ${data.foodServingCapacity}
• Crowd Capacity: ${data.crowdCapacity}
• Operating Hours: ${data.operatingHours || 'N/A'}
• Images: ${data.imagesList}

Owner Contact:
• Email: ${data.ownerEmail}
• Phone: ${data.ownerPhone}

Please verify and respond with credentials within 24-48 hours.

Thank you.
Tabuloo Registration System
  `.trim();

  return {
    subject,
    body,
    recipient: data.toEmail
  };
};

// Fallback email service using a simple approach
export const sendEmailFallback = async (data: RestaurantRegistrationEmailData): Promise<{ success: boolean; message: string; emailContent?: EmailContent }> => {
  try {
    const emailContent = generateEmailContent(data);
    
    // Copy email content to clipboard for better user experience
    const textArea = document.createElement('textarea');
    textArea.value = emailContent.body;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return {
        success: true,
        message: `Email content copied to clipboard! Please paste it in your email and send to ${emailContent.recipient} with subject: "${emailContent.subject}".`,
        emailContent
      };
    } catch (clipboardError) {
      document.body.removeChild(textArea);
      
      return {
        success: true,
        message: `Please manually send an email to ${emailContent.recipient} with subject "${emailContent.subject}".`,
        emailContent
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to prepare email content. Please manually email tablooofficial1@gmail.com with your restaurant details.'
    };
  }
};
