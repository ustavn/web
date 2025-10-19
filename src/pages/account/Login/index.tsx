import { PageBreadcrumb, Form, PasswordInput, TextInput } from '@/components';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import useLogin, { LoginFormFields, loginFormSchema } from './useLogin';

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

export default function Login() {
	const { t } = useTranslation();

	const { loading, login, redirectUrl, isAuthenticated } = useLogin();

	return (
		<>
			{isAuthenticated && <Navigate to={redirectUrl} replace />}

			<PageBreadcrumb title="Login" />
			<AccountWrapper bottomLinks={<BottomLink />}>
				<div className="text-center w-75 m-auto">
					<h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
					<p className="text-muted mb-4">
						{t('Enter your username and password to access admin panel.')}
					</p>
				</div>

				<Form<LoginFormFields>
					onSubmit={login}
					schema={loginFormSchema}
					defaultValues={{ email: 'usta@coderthemes.com', password: 'USTA' }}
				>
					<Row>
						<Col>
							<TextInput
								name="email"
								label={t('Email Address')}
								type="email"
								placeholder={t('Enter your email')}
								containerClass="mb-3"
							/>
						</Col>
					</Row>
					<PasswordInput
						label={t('Password')}
						name="password"
						placeholder={t('Enter your password')}
						containerClass="mb-3"
					>
						<Link to="/account/recover-password" className="text-muted float-end">
							<small>Forgot your password?</small>
						</Link>
					</PasswordInput>

					{/* <CheckInput
            name="rememberme"
            type="checkbox"
            label="Remember me"
            containerClass="mb-3"
            defaultChecked
          /> */}

					<div className="mb-3 text-center">
						<Button variant="primary" type="submit" disabled={loading}>
							{t('Log In')}
						</Button>
					</div>
				</Form>

				<div className="text-center mt-4">
					<p className="text-muted mb-2">— {t('Or login with')} —</p>
					<Button 
						variant="outline-primary" 
						className="w-100"
						onClick={async () => {
							const { buildAuthorizationUrl, storeRedirectPath } = await import('@/common/helpers/oauth');
							storeRedirectPath('/');
							const authUrl = await buildAuthorizationUrl();
							window.location.href = authUrl;
						}}
					>
						<i className="mdi mdi-shield-lock-outline me-1"></i>
						{t('Login with Identity Server')}
					</Button>
					<p className="text-muted mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
						{t('Secure OAuth 2.0 authentication')}
					</p>
				</div>
			</AccountWrapper>
		</>
	);
}
