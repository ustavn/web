import axios from 'axios';
import type { OTPLoginRequest, OTPVerifyRequest, OTPResponse, UserClaims } from '@/types/oauth';

const IDENTITY_SERVER = import.meta.env.VITE_IDENTITY_SERVER;

export async function requestOTP(data: OTPLoginRequest): Promise<OTPResponse> {
  try {
    console.log('[OAuth] Requesting OTP with data:', data);
    console.log('[OAuth] Endpoint:', `${IDENTITY_SERVER}/api/auth/request-otp`);
    console.warn('[OAuth] WARNING: This endpoint is not in the Postman collection!');
    
    const response = await axios.post(`${IDENTITY_SERVER}/api/auth/request-otp`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[OAuth] OTP request response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[OAuth] OTP request failed:', error);
    console.error('[OAuth] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    
    if (error.response?.status === 404) {
      throw new Error(
        'OTP endpoint not found. Your Postman collection shows the standard OAuth flow at /connect/authorize. ' +
        'Use the OAuth redirect flow instead, or ask your backend team to implement OTP endpoints.'
      );
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error_description ||
      error.message ||
      'Failed to request OTP. Use the standard OAuth login instead.'
    );
  }
}

/**
 * Verify OTP and get authorization code
 * 
 * NOTE: This is NOT part of the standard OAuth 2.0 flow.
 * The Postman collection shows you should use /connect/authorize (browser redirect)
 * then exchange the code at /connect/token
 */
export async function verifyOTP(data: OTPVerifyRequest): Promise<string> {
  try {
    console.log('[OAuth] Verifying OTP');
    console.warn('[OAuth] WARNING: This endpoint is not in the Postman collection!');
    
    const response = await axios.post(`${IDENTITY_SERVER}/api/auth/verify-otp`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[OAuth] OTP verification response:', response.data);
    
    // The server should return an authorization code
    return response.data.code || response.data.authorizationCode;
  } catch (error: any) {
    console.error('[OAuth] OTP verification failed:', error);
    
    if (error.response?.status === 404) {
      throw new Error(
        'OTP verification endpoint not found. Your identity server uses the standard OAuth flow. ' +
        'Please use the OAuth redirect login button instead.'
      );
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error_description ||
      error.message ||
      'Failed to verify OTP'
    );
  }
}

/**
 * Get user profile from identity server
 */
export async function getUserProfile(accessToken: string): Promise<UserClaims> {
  try {
    const response = await axios.get(`${IDENTITY_SERVER}/connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
}

