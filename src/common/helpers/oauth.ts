/**
 * OAuth 2.0 PKCE (Proof Key for Code Exchange) utilities
 */

import type { PKCEPair, TokenResponse, IntrospectionResponse, UserClaims } from '@/types/oauth';

const IDENTITY_SERVER = import.meta.env.VITE_IDENTITY_SERVER || 'https://identity.dev.usta.vn';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'admin_client';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}`;
const SCOPES = import.meta.env.VITE_SCOPES || 'offline_access openid profile email';

/**
 * Generate random string for code verifier
 */
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((v) => charset[v % charset.length])
    .join('');
}

/**
 * Generate SHA256 hash
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate PKCE code verifier and challenge
 */
export async function generatePKCE(): Promise<PKCEPair> {
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  return {
    codeVerifier,
    codeChallenge,
  };
}

/**
 * Store PKCE verifier in session storage
 */
export function storePKCEVerifier(verifier: string): void {
  sessionStorage.setItem('pkce_code_verifier', verifier);
}

/**
 * Retrieve PKCE verifier from session storage
 */
export function getPKCEVerifier(): string | null {
  return sessionStorage.getItem('pkce_code_verifier');
}

/**
 * Clear PKCE verifier from session storage
 */
export function clearPKCEVerifier(): void {
  sessionStorage.removeItem('pkce_code_verifier');
}

/**
 * Store redirect path before OAuth flow
 */
export function storeRedirectPath(path: string): void {
  sessionStorage.setItem('oauth_redirect_path', path);
}

/**
 * Get and clear redirect path after OAuth flow
 */
export function getAndClearRedirectPath(): string {
  const path = sessionStorage.getItem('oauth_redirect_path') || '/';
  sessionStorage.removeItem('oauth_redirect_path');
  return path;
}

/**
 * Build authorization URL
 */
export async function buildAuthorizationUrl(): Promise<string> {
  const { codeVerifier, codeChallenge } = await generatePKCE();
  storePKCEVerifier(codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    scope: SCOPES,
    state: generateRandomString(32), // CSRF protection
  });

  return `${IDENTITY_SERVER}/connect/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const codeVerifier = getPKCEVerifier();

  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please restart the login flow.');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code,
    code_verifier: codeVerifier,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(`${IDENTITY_SERVER}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to exchange code for tokens');
  }

  clearPKCEVerifier();
  return response.json();
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${IDENTITY_SERVER}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to refresh token');
  }

  return response.json();
}

/**
 * Introspect token (check if valid)
 */
export async function introspectToken(token: string): Promise<IntrospectionResponse> {
  const params = new URLSearchParams({
    token,
    client_id: CLIENT_ID,
  });

  const response = await fetch(`${IDENTITY_SERVER}/connect/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to introspect token');
  }

  return response.json();
}

/**
 * Revoke token (logout)
 */
export async function revokeToken(token: string): Promise<void> {
  const params = new URLSearchParams({
    token,
    client_id: CLIENT_ID,
  });

  const response = await fetch(`${IDENTITY_SERVER}/connect/revocation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to revoke token');
  }
}

/**
 * Parse JWT token to get user info
 */
export function parseJWT(token: string): UserClaims | undefined {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return undefined;
  }
}

