import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_tabuloo'; // You'll need to create this in EmailJS
const EMAILJS_TEMPLATE_ID = 'template_restaurant_registration'; // You'll need to create this in EmailJS
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // You'll get this from EmailJS

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

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

export const sendRestaurantRegistrationEmail = async (data: RestaurantRegistrationEmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending restaurant registration email via EmailJS...');
    
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
    return {
      success: false,
      message: `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Fallback email service using a simple approach
export const sendEmailFallback = async (data: RestaurantRegistrationEmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a simple email body
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

Please verify and respond with credentials.

Thank you.
    `.trim();

    // Use a simple mailto as fallback
    const subject = encodeURIComponent('New Restaurant Registration Request');
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:${data.toEmail}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoUrl, '_blank');
    
    return {
      success: true,
      message: 'Email client opened. Please send the email to complete the process.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to open email client'
    };
  }
};
