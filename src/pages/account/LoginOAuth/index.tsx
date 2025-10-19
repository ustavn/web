import { PageBreadcrumb } from '@/components';
import { Button, Col, Row, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import { useAuthContext } from '@/common/context';
import { buildAuthorizationUrl, storeRedirectPath } from '@/common/helpers/oauth';
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t("Don't have an account?")}
					<Link to="/account/register" className="text-muted ms-1">
						<b>{t('Sign Up')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

export default function LoginOAuth() {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuthContext();
	const location = useLocation();
	const [loading, setLoading] = useState(false);

	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);

	const handleOAuthLogin = async () => {
		setLoading(true);
		try {
			// Store where to redirect after OAuth completes
			storeRedirectPath(redirectUrl);

			// Build authorization URL with PKCE (follows Postman collection)
			const authUrl = await buildAuthorizationUrl();

			// Redirect to identity server /connect/authorize
			window.location.href = authUrl;
		} catch (error) {
			console.error('Failed to initiate OAuth flow:', error);
			setLoading(false);
		}
	};

	return (
		<>
			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<PageBreadcrumb title="Login with OAuth 2.0" />
			<AccountWrapper bottomLinks={<BottomLink />}>
				<div className="text-center w-75 m-auto">
					<h4 className="text-dark-50 text-center mt-0 fw-bold">
						{t('Secure Sign In')}
					</h4>
					<p className="text-muted mb-4">
						{t('Click below to login securely with OAuth 2.0 via the identity server.')}
					</p>
				</div>

				<Alert variant="info" className="mb-4">
					<div className="d-flex">
						<i className="mdi mdi-information me-2" style={{ fontSize: '20px' }}></i>
						<div>
							<strong>{t('How it works:')}</strong>
							<ol className="mb-0 mt-2 ps-3" style={{ fontSize: '0.9rem' }}>
								<li>{t('You will be redirected to the identity server')}</li>
								<li>{t('Login with your credentials on the secure server')}</li>
								<li>{t('You will be automatically redirected back and logged in')}</li>
							</ol>
						</div>
					</div>
				</Alert>

				<div className="mb-3 text-center">
					<Button 
						variant="primary" 
						size="lg"
						onClick={handleOAuthLogin} 
						disabled={loading}
						className="px-5"
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								{t('Redirecting...')}
							</>
						) : (
							<>
								<i className="mdi mdi-shield-lock-outline me-2"></i>
								{t('Login with Identity Server')}
							</>
						)}
					</Button>
				</div>

				<div className="text-center mt-4">
					<p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
						<i className="mdi mdi-check-circle text-success me-1"></i>
						{t('Secured with OAuth 2.0 + PKCE')}
					</p>
					<p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
						<i className="mdi mdi-server text-primary me-1"></i>
						{t('Server')}: identity.dev.usta.vn
					</p>
				</div>
			</AccountWrapper>
		</>
	);
}

