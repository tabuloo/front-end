// Base API URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://tabuloo-backend-p95l.vercel.app';

export interface SendOTPRequest {
  phoneNumber: string;
  purpose: 'registration' | 'login' | 'password_reset';
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export class APIService {
  /**
   * Send OTP via SMS
   * POST /api/otp/send
   */
  async sendOTP(request: SendOTPRequest): Promise<APIResponse> {
    try {
      console.log('Sending OTP to:', request.phoneNumber);
      
      const response = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          identifier: request.phoneNumber // Backend expects 'identifier'
        })
      });

      const data = await response.json();
      console.log('Send OTP response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Failed to send OTP: ${response.status}`,
          error: 'OTP_SEND_FAILED'
        };
      }

      return {
        success: true,
        message: data.message || 'OTP sent successfully',
        data: data
      };
    } catch (error) {
      console.error('API Error - Send OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please check your connection and try again.',
        error: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Verify OTP
   * POST /api/otp/verify
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<APIResponse> {
    try {
      console.log('Verifying OTP for:', request.phoneNumber);
      
      const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          identifier: request.phoneNumber, // Backend expects 'identifier'
          otp: request.otp
        })
      });

      const data = await response.json();
      console.log('Verify OTP response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `OTP verification failed: ${response.status}`,
          error: 'OTP_VERIFICATION_FAILED'
        };
      }

      return {
        success: true,
        message: data.message || 'OTP verified successfully',
        data: {
          phoneNumber: request.phoneNumber,
          verified: true,
          sessionToken: data.sessionToken
        }
      };
    } catch (error) {
      console.error('API Error - Verify OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please check your connection and try again.',
        error: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Resend OTP
   * POST /api/sms/send-otp (same endpoint, just call sendOTP again)
   */
  async resendOTP(request: SendOTPRequest): Promise<APIResponse> {
    console.log('Resending OTP to:', request.phoneNumber);
    return this.sendOTP(request);
  }

  /**
   * Check OTP status (if your backend supports this)
   * GET /api/sms/otp-status/:phoneNumber
   */
  async getOTPStatus(phoneNumber: string): Promise<APIResponse> {
    try {
      console.log('Checking OTP status for:', phoneNumber);
      
      const response = await fetch(`${API_BASE_URL}/api/sms/otp-status/${phoneNumber}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json();
      console.log('OTP status response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Failed to get OTP status: ${response.status}`,
          error: 'STATUS_CHECK_FAILED'
        };
      }

      return {
        success: true,
        message: data.message || 'OTP status retrieved successfully',
        data: data.data || {
          phoneNumber,
          hasPendingOTP: false,
          expiryTime: null
        }
      };
    } catch (error) {
      console.error('API Error - Get OTP Status:', error);
      return {
        success: false,
        message: 'Failed to get OTP status. Please check your connection and try again.',
        error: 'NETWORK_ERROR'
      };
    }
  }
}

export default new APIService();
