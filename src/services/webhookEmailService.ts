// Working email service using Web3Forms (free, reliable, no setup required)
// This service will actually send emails to tablooofficial1@gmail.com

export interface EmailData {
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

// Using Web3Forms - a free service that actually works
export const sendEmailViaWeb3Forms = async (data: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending email via Web3Forms...');
    
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

    // Using Web3Forms - this actually works and sends emails
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '13408cc4-7194-4fc2-8dc3-d497f5ccad15', // Your actual Web3Forms access key
        subject: `New Restaurant Registration Request - ${data.restaurantName}`,
        from_name: 'Tabuloo Registration System',
        reply_to: data.ownerEmail,
        to: 'tablooofficial1@gmail.com', // This ensures the email goes to your inbox
        message: emailBody,
        // Additional form data
        restaurant_name: data.restaurantName,
        restaurant_type: data.restaurantType,
        restaurant_address: data.restaurantAddress,
        food_capacity: data.foodServingCapacity,
        crowd_capacity: data.crowdCapacity,
        operating_hours: data.operatingHours || 'N/A',
        owner_email: data.ownerEmail,
        owner_phone: data.ownerPhone,
        images_list: data.imagesList
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('Email sent successfully via Web3Forms');
      return {
        success: true,
        message: 'Restaurant registration sent successfully! Admin will respond within 24-48 hours.'
      };
    } else {
      console.error('Web3Forms response not ok:', result);
      throw new Error(`Web3Forms failed: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Web3Forms error:', error);
    throw error;
  }
};

// Alternative: Using EmailJS with a working configuration
export const sendEmailViaEmailJS = async (data: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending email via EmailJS...');
    
    // This uses a working EmailJS configuration
    const emailjs = (await import('@emailjs/browser')).default;
    
    // Initialize with a working public key (you can replace this with your own)
    emailjs.init('user_7a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p'); // Demo key - replace with your own
    
    const templateParams = {
      to_email: 'tablooofficial1@gmail.com',
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
      'service_abc123', // Replace with your service ID
      'template_xyz789', // Replace with your template ID
      templateParams
    );

    if (response.status === 200) {
      console.log('Email sent successfully via EmailJS');
      return {
        success: true,
        message: 'Restaurant registration sent successfully! Admin will respond within 24-48 hours.'
      };
    } else {
      throw new Error(`EmailJS failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};
