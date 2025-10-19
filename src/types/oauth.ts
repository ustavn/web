/**
 * OAuth 2.0 and OpenID Connect Types
 */

export interface TokenResponse {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token?: string;
}

export interface AuthSession {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	user?: UserClaims;
}

export interface UserClaims {
	/** Subject - User ID */
	sub: string;
	/** Email address */
	email?: string;
	/** Email verified flag */
	email_verified?: boolean;
	/** Full name */
	name?: string;
	/** Given name (first name) */
	given_name?: string;
	/** Family name (last name) */
	family_name?: string;
	/** Username */
	preferred_username?: string;
	/** Phone number */
	phone_number?: string;
	/** Phone verified flag */
	phone_number_verified?: boolean;
	/** Profile picture URL */
	picture?: string;
	/** Issued at timestamp */
	iat?: number;
	/** Expiration timestamp */
	exp?: number;
	/** Issuer */
	iss?: string;
	/** Audience */
	aud?: string | string[];
	/** Client ID */
	client_id?: string;
	/** Scope */
	scope?: string;
	/** JWT ID */
	jti?: string;
}

export interface PKCEPair {
	codeVerifier: string;
	codeChallenge: string;
}

export interface IntrospectionResponse {
	active: boolean;
	scope?: string;
	client_id?: string;
	username?: string;
	token_type?: string;
	exp?: number;
	iat?: number;
	sub?: string;
	aud?: string | string[];
	iss?: string;
}

export interface OTPLoginRequest {
	phoneNumber?: string;
	email?: string;
}

export interface OTPVerifyRequest {
	phoneNumber?: string;
	email?: string;
	otp: string;
}

export interface OTPResponse {
	success: boolean;
	message?: string;
	sessionId?: string;
}

export interface OAuthError {
	error: string;
	error_description?: string;
	error_uri?: string;
}

export interface AuthorizationRequest {
	client_id: string;
	response_type: 'code';
	redirect_uri: string;
	scope: string;
	state: string;
	code_challenge: string;
	code_challenge_method: 'S256';
	nonce?: string;
	prompt?: 'none' | 'login' | 'consent' | 'select_account';
	max_age?: number;
	ui_locales?: string;
	id_token_hint?: string;
	login_hint?: string;
	acr_values?: string;
}

export interface TokenRequest {
	grant_type: 'authorization_code' | 'refresh_token';
	client_id: string;
	code?: string;
	redirect_uri?: string;
	code_verifier?: string;
	refresh_token?: string;
}

