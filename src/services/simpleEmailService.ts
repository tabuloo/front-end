// Alternative email service using Formspree (free and easy)
// This is a backup solution if EmailJS setup is too complex

export interface SimpleEmailData {
  restaurantName: string;
  restaurantType: string;
  restaurantAddress: string;
  foodServingCapacity: number;
  crowdCapacity: number;
  operatingHours: string;
  ownerEmail: string;
  ownerPhone: string;
  imagesList: string;
}

// Using Formspree as a simple email service
// You can also use EmailJS, SendGrid, or any other email service
export const sendSimpleEmail = async (data: SimpleEmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Method 1: Using Formspree (free, no setup required)
    const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree form ID
    
    const emailBody = `
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

    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'tablooofficial1@gmail.com',
        subject: 'New Restaurant Registration Request',
        message: emailBody,
        restaurant_name: data.restaurantName,
        owner_email: data.ownerEmail,
        owner_phone: data.ownerPhone
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email sent successfully to admin!'
      };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Simple email service error:', error);
    return {
      success: false,
      message: 'Failed to send email automatically'
    };
  }
};

// Method 2: Using a webhook service like Zapier or Make.com
export const sendViaWebhook = async (data: SimpleEmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // You can set up a Zapier webhook that sends emails
    // This is useful if you want to integrate with other services
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your webhook URL
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'restaurant_registration',
        data: {
          restaurantName: data.restaurantName,
          restaurantType: data.restaurantType,
          restaurantAddress: data.restaurantAddress,
          foodServingCapacity: data.foodServingCapacity,
          crowdCapacity: data.crowdCapacity,
          operatingHours: data.operatingHours,
          ownerEmail: data.ownerEmail,
          ownerPhone: data.ownerPhone,
          imagesList: data.imagesList,
          recipient: 'tablooofficial1@gmail.com'
        }
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Restaurant registration sent successfully!'
      };
    } else {
      throw new Error('Webhook failed');
    }
  } catch (error) {
    console.error('Webhook email error:', error);
    return {
      success: false,
      message: 'Failed to send registration via webhook'
    };
  }
};
