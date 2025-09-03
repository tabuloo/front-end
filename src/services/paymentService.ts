// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://tabuloo-backend-p95l.vercel.app';

class PaymentService {
  // Use environment variable for Razorpay key
  private razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_pM9jaMaFl7RvBv';

  private checkRazorpayLoaded(): boolean {
    return typeof (window as any).Razorpay !== 'undefined';
  }

  async createDirectOrder(orderData: any) {
    try {
      console.log('Creating order with backend');
      
      // Create order with backend first
      const response = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderData.total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            delivery_address: orderData.address
          }
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }

      return result.order;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature?: string) {
    try {
      console.log('Verifying payment with backend:', { paymentId, orderId });
      
      const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
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
      
      // Check if Razorpay is loaded
      if (!this.checkRazorpayLoaded()) {
        throw new Error('Razorpay is not loaded. Please refresh the page and try again.');
      }
      
      // Create payment options with backend
      const order = await this.createDirectOrder({
        total: orderData.total,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: orderData.customerPhone,
        address: orderData.address
      });

      // Initialize Razorpay with backend order
      const options = {
        key: this.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Tabuloo',
        description: 'Food Order Payment',
        order_id: order.id,
        handler: async (response: any) => {
          try {
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
            onError(error);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: orderData.customerPhone
        },
        notes: {
          customer_name: user.name,
          customer_email: user.email,
          customer_phone: orderData.customerPhone,
          delivery_address: orderData.address
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
}

export default new PaymentService(); 