
import { PageBreadcrumb } from '@/components';
import { Button, Col, Row, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import { useAuthContext } from '@/common/context';
import { buildAuthorizationUrl, storeRedirectPath } from '@/common/helpers/oauth';
import { useState } from 'react';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t("Don't have an account?")}
					<a href="https://identity.dev.usta.vn" className="text-muted ms-1" target="_blank" rel="noopener noreferrer">
						<b>{t('Register on Identity Server')}</b>
					</a>
				</p>
			</Col>
		</Row>
	);
};

export default function StandardOAuthLogin() {
	const { t } = useTranslation();
	const location = useLocation();
	const { isAuthenticated } = useAuthContext();
	const [loading, setLoading] = useState(false);

	const redirectUrl = location.state?.from?.pathname || '/';

	const handleOAuthLogin = async () => {
		setLoading(true);
		try {
			// Store where to redirect after OAuth completes
			storeRedirectPath(redirectUrl);

			// Build authorization URL with PKCE (matches Postman collection)
			const authUrl = await buildAuthorizationUrl();

			// Redirect to identity server
			// This matches: GET /connect/authorize?client_id=test_client&...
			console.log('[OAuth] Redirecting to:', authUrl);
			window.location.href = authUrl;
		} catch (error) {
			console.error('[OAuth] Failed to initiate OAuth flow:', error);
			setLoading(false);
		}
	};

	return (
		<>
			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<PageBreadcrumb title="OAuth Login" />
			<AccountWrapper bottomLinks={<BottomLink />}>
				<div className="text-center w-75 m-auto">
					<h4 className="text-dark-50 text-center mt-0 fw-bold">
						{t('Sign In with Identity Server')}
					</h4>
					<p className="text-muted mb-4">
						{t('Secure authentication via OAuth 2.0')}
					</p>
				</div>

				<Card className="mb-3" style={{ backgroundColor: '#f8f9fa' }}>
					<Card.Body>
						<div className="d-flex align-items-start">
							<i className="mdi mdi-information text-primary me-2" style={{ fontSize: '20px' }}></i>
							<div style={{ fontSize: '0.9rem' }}>
								<p className="mb-2">
									<strong>This follows your Postman collection flow:</strong>
								</p>
								<ol className="mb-0" style={{ paddingLeft: '20px', fontSize: '0.85rem' }}>
									<li>Redirect to identity server</li>
									<li>Login there (with your credentials)</li>
									<li>Redirect back to this app</li>
									<li>Automatically exchange code for tokens</li>
								</ol>
							</div>
						</div>
					</Card.Body>
				</Card>

				<div className="mb-3 text-center">
					<Button 
						variant="primary" 
						size="lg"
						onClick={handleOAuthLogin} 
						disabled={loading}
						className="w-100"
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

				<Card className="mt-4">
					<Card.Header>
						<h5 className="mb-0">How it works</h5>
					</Card.Header>
					<Card.Body>
						<div className="timeline-alt pb-0">
							<div className="timeline-item">
								<i className="mdi mdi-circle bg-primary text-primary"></i>
								<div className="timeline-item-info">
									<h5 className="mt-0 mb-1">Step 1: Authorization</h5>
									<p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
										You'll be redirected to:<br />
										<code style={{ fontSize: '0.8rem' }}>https://identity.dev.usta.vn/connect/authorize</code>
									</p>
								</div>
							</div>
							<div className="timeline-item">
								<i className="mdi mdi-circle bg-info text-info"></i>
								<div className="timeline-item-info">
									<h5 className="mt-0 mb-1">Step 2: Login</h5>
									<p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
										Enter your credentials on the identity server
									</p>
								</div>
							</div>
							<div className="timeline-item">
								<i className="mdi mdi-circle bg-success text-success"></i>
								<div className="timeline-item-info">
									<h5 className="mt-0 mb-1">Step 3: Token Exchange</h5>
									<p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
										App exchanges authorization code for access tokens
									</p>
								</div>
							</div>
							<div className="timeline-item">
								<i className="mdi mdi-circle bg-warning text-warning"></i>
								<div className="timeline-item-info">
									<h5 className="mt-0 mb-1">Step 4: Access Granted</h5>
									<p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
										You're logged in and redirected to your destination
									</p>
								</div>
							</div>
						</div>
					</Card.Body>
				</Card>
			</AccountWrapper>
		</>
	);
}

