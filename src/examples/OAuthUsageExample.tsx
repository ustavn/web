
import { useAuthContext } from '@/common/context';
import { useOAuthRedirect } from '@/pages/account/LoginOAuth/useOAuthRedirect';
import { Button } from 'react-bootstrap';

export function UserProfileExample() {
	const { user, isAuthenticated } = useAuthContext();

	if (!isAuthenticated || !user) {
		return <div>Please log in</div>;
	}

	// Type guard for OAuth user
	const isOAuthUser = (u: any): u is import('@/types').UserClaims => 'sub' in u;
	const oauthUser = isOAuthUser(user) ? user : null;

	return (
		<div>
			<h3>User Profile</h3>
			<p>Email: {oauthUser?.email || (user as any).email}</p>
			<p>Name: {oauthUser?.name || (user as any).name}</p>
			{oauthUser && <p>User ID: {oauthUser.sub}</p>}
		</div>
	);
}

// Example 2: Protected API call with auto token refresh
export function ProtectedAPICallExample() {
	const { getAccessToken } = useAuthContext();

	const fetchProtectedData = async () => {
		try {
			// Get valid access token (auto-refreshes if needed)
			const token = await getAccessToken();

			if (!token) {
				console.error('No valid token available');
				return;
			}

			// Make API call with token
			const response = await fetch('https://identity.dev.usta.vn/api/protected-resource', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			console.log('Protected data:', data);
		} catch (error) {
			console.error('API call failed:', error);
		}
	};

	return <Button onClick={fetchProtectedData}>Fetch Protected Data</Button>;
}

// Example 3: OAuth redirect flow (traditional)
export function OAuthRedirectLoginButton() {
	const { initiateOAuthFlow } = useOAuthRedirect();

	const handleLogin = async () => {
		try {
			await initiateOAuthFlow();
			// User will be redirected to identity server
		} catch (error) {
			console.error('OAuth flow failed:', error);
		}
	};

	return (
		<Button onClick={handleLogin} variant="primary">
			Login with OAuth Redirect
		</Button>
	);
}

// Example 4: Logout with token revocation
export function LogoutButtonExample() {
	const { logout } = useAuthContext();

	const handleLogout = async () => {
		try {
			await logout();
			console.log('Successfully logged out');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<Button onClick={handleLogout} variant="danger">
			Logout
		</Button>
	);
}

// Example 5: Check authentication status
export function AuthStatusExample() {
	const { isAuthenticated, user } = useAuthContext();
	const email = user && 'email' in user ? user.email : undefined;
	const username = user && 'preferred_username' in user ? user.preferred_username : undefined;

	return (
		<div>
			<p>
				Authentication Status:{' '}
				<strong>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</strong>
			</p>
			{isAuthenticated && (
				<div>
					<p>Logged in as: {email || username}</p>
				</div>
			)}
		</div>
	);
}

// Example 6: Using OAuth in a custom hook
export function useProtectedResource() {
	const { getAccessToken, isAuthenticated } = useAuthContext();

	const fetchResource = async (resourceId: string) => {
		if (!isAuthenticated) {
			throw new Error('User not authenticated');
		}

		const token = await getAccessToken();
		if (!token) {
			throw new Error('No valid token');
		}

		const response = await fetch(
			`https://identity.dev.usta.vn/api/resources/${resourceId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.json();
	};

	return { fetchResource };
}

// Example 7: Complete auth flow component
export function CompleteAuthExample() {
	const { isAuthenticated, user, logout } = useAuthContext();
	const { initiateOAuthFlow } = useOAuthRedirect();
	const userName = user && ('name' in user ? user.name : 'email' in user ? user.email : 'User');

	if (isAuthenticated) {
		return (
			<div>
				<h3>Welcome, {userName}!</h3>
				<UserProfileExample />
				<ProtectedAPICallExample />
				<Button onClick={logout} variant="danger" className="mt-3">
					Logout
				</Button>
			</div>
		);
	}

	return (
		<div>
			<h3>Please Login</h3>
			<div className="d-flex flex-column gap-2">
				{/* Option 1: OTP Login */}
				<Button href="/account/login-oauth" variant="primary">
					Login with OTP
				</Button>

				{/* Option 2: Traditional OAuth Redirect */}
				<Button onClick={initiateOAuthFlow} variant="outline-primary">
					Login with OAuth Redirect
				</Button>

				{/* Option 3: Legacy Login */}
				<Button href="/account/login" variant="outline-secondary">
					Login with Email/Password
				</Button>
			</div>
		</div>
	);
}

