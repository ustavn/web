import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/common/context';
import { requestOTP as requestOTPApi, verifyOTP as verifyOTPApi } from '@/common/api/oauth';
import { exchangeCodeForTokens, parseJWT } from '@/common/helpers/oauth';
import * as yup from 'yup';

export const otpRequestSchema = yup.object({
	contact: yup
		.string()
		.required('Please enter email or phone number')
		.test('email-or-phone', 'Please enter a valid email or phone number', (value) => {
			if (!value) return false;
			// Check if it's a valid email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			// Check if it's a valid phone number (basic validation)
			const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
			return emailRegex.test(value) || phoneRegex.test(value);
		}),
});

export const otpVerifySchema = yup.object({
	contact: yup.string().required(),
	otp: yup
		.string()
		.required('Please enter OTP code')
		.matches(/^\d{6}$/, 'OTP must be 6 digits'),
});

export type OTPRequestFormFields = yup.InferType<typeof otpRequestSchema>;
export type OTPVerifyFormFields = yup.InferType<typeof otpVerifySchema>;

type Step = 'request' | 'verify';

export default function useLoginOAuth() {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<Step>('request');
	const [error, setError] = useState<string>('');
	const [contactInfo, setContactInfo] = useState<string>('');
	
	const location = useLocation();
	const navigate = useNavigate();

	const { isAuthenticated, saveOAuthSession } = useAuthContext();

	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);

	const isEmail = (contact: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

	const requestOTP = async (values: OTPRequestFormFields) => {
		setLoading(true);
		setError('');

		try {
			const isEmailContact = isEmail(values.contact);
			const payload = isEmailContact
				? { email: values.contact }
				: { phoneNumber: values.contact };

			await requestOTPApi(payload);
			
			setContactInfo(values.contact);
			setStep('verify');
		} catch (err: any) {
			setError(err.message || 'Failed to send OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const verifyOTP = async (values: OTPVerifyFormFields) => {
		setLoading(true);
		setError('');

		try {
			const isEmailContact = isEmail(values.contact);
			const payload = isEmailContact
				? { email: values.contact, otp: values.otp }
				: { phoneNumber: values.contact, otp: values.otp };

			// Verify OTP and get authorization code
			const authCode = await verifyOTPApi(payload);

			// Exchange authorization code for tokens
			const tokenResponse = await exchangeCodeForTokens(authCode);

			// Parse user info from access token
			const userInfo = parseJWT(tokenResponse.access_token);

			// Save OAuth session
			saveOAuthSession({
				accessToken: tokenResponse.access_token,
				refreshToken: tokenResponse.refresh_token,
				expiresAt: Date.now() + tokenResponse.expires_in * 1000,
				user: userInfo,
			});

			// Navigate to redirect URL
			navigate(redirectUrl);
		} catch (err: any) {
			setError(err.message || 'Invalid OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return { 
		loading, 
		step, 
		error,
		requestOTP, 
		verifyOTP, 
		redirectUrl, 
		isAuthenticated,
		contactInfo 
	};
}

