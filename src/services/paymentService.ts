// Get API base URL from environment
// Always use the backend URL directly to avoid proxy issues
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://tabuloo-backend-p95l.vercel.app';

console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
console.log('API Base URL:', API_BASE_URL);

class PaymentService {
  // Use environment variable for Razorpay key
  private razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_pM9jaMaFl7RvBv';

  private checkRazorpayLoaded(): boolean {
    return typeof (window as any).Razorpay !== 'undefined';
  }

  async createOrder(amount: number, currency: string = 'INR') {
    try {
      console.log('Creating payment order:', { 
        amount: amount, 
        amountInPaise: Math.round(amount * 100),
        currency 
      });
      
      // Ensure the URL is properly constructed
      const url = `${API_BASE_URL}/api/payment`;
      console.log('Payment URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise (70 * 100 = 7000 paise)
          currency,
          customer: 'tabuloo-customer',
          order: `order_${Date.now()}`
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Create order response:', result);
      console.log('Backend returned amount:', result.amount);
      console.log('Frontend sent amount:', Math.round(amount * 100));
      
      // Ensure the response has the expected structure
      if (result.success && result.order_id) {
        return {
          success: true,
          order_id: result.order_id,
          amount: result.amount || Math.round(amount * 100),
          currency: result.currency || currency,
          message: result.message || 'Order created successfully'
        };
      } else {
        throw new Error(result.message || 'Invalid response from backend');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      
      // If backend is not available, create a mock order for development
      if (import.meta.env.DEV) {
        console.warn('Backend not available, creating mock order for development');
        return {
          success: true,
          order_id: `mock_order_${Date.now()}`,
          amount: Math.round(amount * 100), // Razorpay expects amount in paise
          currency: currency,
          message: 'Mock order created for development'
        };
      }
      
      return {
        success: false,
        message: 'Order creation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createDirectOrder(orderData: any) {
    try {
      console.log('Creating order with backend');
      
      // Create order with backend first
      const url = `${API_BASE_URL}/api/payment`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          amount: orderData.total,
          currency: 'INR',
          customer: 'tabuloo-customer',
          order: `order_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }

      return {
        id: result.order_id,
        amount: result.amount,
        currency: result.currency
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature?: string) {
    try {
      console.log('Verifying payment with backend:', { paymentId, orderId });
      
      const url = `${API_BASE_URL}/api/payment/verify`;
      console.log('Verification URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        })
      });

      console.log('Verification response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend verification error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Verification result:', result);
      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
      
      // If backend is not available, mock verification for development
      if (import.meta.env.DEV) {
        console.warn('Backend not available, mocking payment verification for development');
        return {
          success: true,
          message: 'Mock payment verification successful for development'
        };
      }
      
      return {
        success: false,
        message: 'Payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async initializePayment(
    orderData: any,
    user: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) {
    try {
      console.log('Initializing payment for order:', orderData);
      console.log('Order total from frontend:', orderData.total);
      console.log('Order type:', orderData.type);
      
      // Check if Razorpay is loaded
      if (!this.checkRazorpayLoaded()) {
        // Try to load Razorpay script dynamically
        await this.loadRazorpayScript();
        
        // Check again after loading
        if (!this.checkRazorpayLoaded()) {
          throw new Error('Razorpay is not loaded. Please refresh the page and try again.');
        }
      }
      
      // Create payment options with backend
      const order = await this.createOrder(orderData.total);

      if (!order.success) {
        // In development mode, if backend fails, simulate payment success
        if (import.meta.env.DEV && order.message?.includes('Mock order')) {
          console.log('Development mode: Simulating payment success');
          // Simulate successful payment after 2 seconds
          setTimeout(() => {
            onSuccess({
              razorpay_payment_id: `mock_payment_${Date.now()}`,
              razorpay_order_id: order.order_id,
              razorpay_signature: `mock_signature_${Date.now()}`
            });
          }, 2000);
          return;
        }
        throw new Error(order.message || 'Failed to create payment order');
      }

      // Initialize Razorpay with backend order
      const razorpayAmount = Math.round(orderData.total * 100);
      console.log('Razorpay payment details:', {
        frontendTotal: orderData.total,
        razorpayAmount: razorpayAmount,
        currency: order.currency || 'INR',
        orderId: order.order_id
      });
      
      const options = {
        key: this.razorpayKey,
        amount: razorpayAmount, // Use frontend amount in paise
        currency: order.currency || 'INR',
        name: 'Tabuloo',
        description: 'Food Order Payment',
        order_id: order.order_id,
        handler: async (response: any) => {
          try {
            console.log('Payment successful, verifying...', response);
            // Verify payment with backend
            const verificationResult = await this.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            if (verificationResult.success) {
              onSuccess(response);
            } else {
              onError(new Error(verificationResult.message || 'Payment verification failed'));
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError(error);
          }
        },
        prefill: {
          name: user.name || 'Customer',
          email: user.email || 'customer@tabuloo.com',
          contact: orderData.customerPhone || '9999999999'
        },
        notes: {
          customer_name: user.name || 'Customer',
          customer_email: user.email || 'customer@tabuloo.com',
          customer_phone: orderData.customerPhone || '9999999999',
          delivery_address: orderData.address || 'N/A'
        },
        theme: {
          color: '#DC2626'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        onError(new Error(`Payment failed: ${response.error.description || 'Unknown error'}`));
      });
      
      rzp.on('payment.cancelled', () => {
        console.log('Payment cancelled by user');
        onError(new Error('Payment cancelled by user'));
      });
      
      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      onError(error);
    }
  }

  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.checkRazorpayLoaded()) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }
}

export default new PaymentService(); 