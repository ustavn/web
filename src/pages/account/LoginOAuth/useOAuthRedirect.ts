import { buildAuthorizationUrl, storeRedirectPath } from '@/common/helpers/oauth';
import { useLocation } from 'react-router-dom';

export function useOAuthRedirect() {
	const location = useLocation();

	const initiateOAuthFlow = async () => {
		try {
			// Store where to redirect after OAuth completes
			const redirectPath =
				location.state && location.state.from ? location.state.from.pathname : '/';
			storeRedirectPath(redirectPath);

			// Build authorization URL with PKCE
			const authUrl = await buildAuthorizationUrl();

			// Redirect to identity server
			window.location.href = authUrl;
		} catch (error) {
			console.error('Failed to initiate OAuth flow:', error);
			throw error;
		}
	};

	return { initiateOAuthFlow };
}

