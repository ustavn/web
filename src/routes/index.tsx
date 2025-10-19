import { Route, Routes as ReactRoutes, useSearchParams } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPages from '@/pages/error';
import Account from '@/pages/account';
import LandingPage from '@/pages/Landing';
import ErrorPageNotFound from '@/pages/error/PageNotFound';
import { lazy, Suspense } from 'react';

const OAuthCallback = lazy(() => import('@/pages/account/OAuthCallback'));

function RootHandler() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get('code');
	
	// If there's a code parameter, it's an OAuth callback
	if (code) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<OAuthCallback />
			</Suspense>
		);
	}
	
	// Otherwise, render normal protected routes
	return <ProtectedRoutes />;
}

export default function AppRoutes() {
	return (
		<ReactRoutes>
			<Route path="account/*" element={<Account />} />
			<Route path="auth/*" element={<Account />} />
			<Route path="/" element={<RootHandler />} />
			<Route path="/*" element={<ProtectedRoutes />} />
			<Route path="/error/*" element={<ErrorPages />} />
			<Route path="/landing" element={<LandingPage />} />
			<Route path="*" element={<ErrorPageNotFound />} />
		</ReactRoutes>
	);
}
