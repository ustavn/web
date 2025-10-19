import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '@/common/context';
import { exchangeCodeForTokens, parseJWT, getAndClearRedirectPath } from '@/common/helpers/oauth';
import { Spinner } from 'react-bootstrap';

export default function OAuthCallback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { saveOAuthSession } = useAuthContext();
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const handleCallback = async () => {
			const code = searchParams.get('code');
			const error = searchParams.get('error');
			const errorDescription = searchParams.get('error_description');

			if (error) {
				setError(errorDescription || error);
				setTimeout(() => navigate('/account/login'), 3000);
				return;
			}

			if (!code) {
				setError('Authorization code not found');
				setTimeout(() => navigate('/account/login'), 3000);
				return;
			}

			try {
				// Exchange code for tokens
				const tokenResponse = await exchangeCodeForTokens(code);

				// Parse user info from access token
				const userInfo = parseJWT(tokenResponse.access_token);

				// Save OAuth session
				saveOAuthSession({
					accessToken: tokenResponse.access_token,
					refreshToken: tokenResponse.refresh_token,
					expiresAt: Date.now() + tokenResponse.expires_in * 1000,
					user: userInfo,
				});

				// Redirect to original destination or home
				const redirectPath = getAndClearRedirectPath();
				navigate(redirectPath);
			} catch (err: any) {
				console.error('OAuth callback error:', err);
				setError(err.message || 'Failed to complete authentication');
				setTimeout(() => navigate('/account/login'), 3000);
			}
		};

		handleCallback();
	}, [searchParams, navigate, saveOAuthSession]);

	return (
		<div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
			{error ? (
				<div className="text-center">
					<div className="text-danger mb-3">
						<i className="mdi mdi-alert-circle" style={{ fontSize: '48px' }}></i>
					</div>
					<h4 className="text-danger mb-2">Authentication Failed</h4>
					<p className="text-muted">{error}</p>
					<p className="text-muted">Redirecting to login...</p>
				</div>
			) : (
				<div className="text-center">
					<Spinner animation="border" variant="primary" className="mb-3" />
					<h4 className="mb-2">Completing authentication...</h4>
					<p className="text-muted">Please wait while we log you in.</p>
				</div>
			)}
		</div>
	);
}

