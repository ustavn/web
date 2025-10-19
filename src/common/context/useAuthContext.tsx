import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import type { AuthSession, UserClaims } from '@/types/oauth';
import { refreshAccessToken, revokeToken, parseJWT } from '@/common/helpers/oauth';

interface AuthContextType {
	user: UserClaims | User | undefined;
	isAuthenticated: boolean;
	saveSession: (user: User) => void;
	removeSession: () => void;
	saveOAuthSession: (session: AuthSession) => void;
	getAccessToken: () => Promise<string | null>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

const authSessionKey = '_USTA_AUTH';
const oauthSessionKey = '_USTA_OAUTH';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(() => {
		// Check for OAuth session first
		const oauthSession = localStorage.getItem(oauthSessionKey);
		if (oauthSession) {
			try {
				const session: AuthSession = JSON.parse(oauthSession);
				return session.user;
			} catch (e) {
				console.error('Failed to parse OAuth session:', e);
			}
		}

		// Fallback to legacy auth
		const legacyAuth = localStorage.getItem(authSessionKey);
		if (legacyAuth) {
			try {
				return JSON.parse(legacyAuth);
			} catch (e) {
				console.error('Failed to parse legacy auth:', e);
			}
		}

		return undefined;
	});

	// Auto-refresh token when it's about to expire
	useEffect(() => {
		const checkAndRefreshToken = async () => {
			const oauthSession = localStorage.getItem(oauthSessionKey);
			if (!oauthSession) return;

			try {
				const session: AuthSession = JSON.parse(oauthSession);
				const now = Date.now();
				const timeUntilExpiry = session.expiresAt - now;

				// Refresh if token expires in less than 5 minutes
				if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
					const tokenResponse = await refreshAccessToken(session.refreshToken);
					const newSession: AuthSession = {
						accessToken: tokenResponse.access_token,
						refreshToken: tokenResponse.refresh_token,
						expiresAt: Date.now() + tokenResponse.expires_in * 1000,
						user: parseJWT(tokenResponse.access_token),
					};
					localStorage.setItem(oauthSessionKey, JSON.stringify(newSession));
					setUser(newSession.user);
				}
			} catch (error) {
				console.error('Failed to refresh token:', error);
				// If refresh fails, log out the user
				removeSession();
			}
		};

		// Check every minute
		const interval = setInterval(checkAndRefreshToken, 60 * 1000);
		checkAndRefreshToken(); // Check immediately

		return () => clearInterval(interval);
	}, []);

	const saveSession = useCallback(
		(user: User) => {
			localStorage.setItem(authSessionKey, JSON.stringify(user.token));
			setUser(user);
		},
		[setUser]
	);

	const saveOAuthSession = useCallback(
		(session: AuthSession) => {
			localStorage.setItem(oauthSessionKey, JSON.stringify(session));
			localStorage.removeItem(authSessionKey); // Remove legacy auth
			setUser(session.user);
		},
		[setUser]
	);

	const getAccessToken = useCallback(async (): Promise<string | null> => {
		const oauthSession = localStorage.getItem(oauthSessionKey);
		if (!oauthSession) return null;

		try {
			const session: AuthSession = JSON.parse(oauthSession);
			const now = Date.now();

			// If token is expired, try to refresh
			if (session.expiresAt <= now) {
				const tokenResponse = await refreshAccessToken(session.refreshToken);
				const newSession: AuthSession = {
					accessToken: tokenResponse.access_token,
					refreshToken: tokenResponse.refresh_token,
					expiresAt: Date.now() + tokenResponse.expires_in * 1000,
					user: parseJWT(tokenResponse.access_token),
				};
				localStorage.setItem(oauthSessionKey, JSON.stringify(newSession));
				setUser(newSession.user);
				return newSession.accessToken;
			}

			return session.accessToken;
		} catch (error) {
			console.error('Failed to get access token:', error);
			return null;
		}
	}, []);

	const logout = useCallback(async () => {
		const oauthSession = localStorage.getItem(oauthSessionKey);
		if (oauthSession) {
			try {
				const session: AuthSession = JSON.parse(oauthSession);
				await revokeToken(session.accessToken);
			} catch (error) {
				console.error('Failed to revoke token:', error);
			}
		}
		removeSession();
	}, []);

	const removeSession = useCallback(() => {
		localStorage.removeItem(authSessionKey);
		localStorage.removeItem(oauthSessionKey);
		setUser(undefined);
	}, [setUser]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				saveSession,
				saveOAuthSession,
				removeSession,
				getAccessToken,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
