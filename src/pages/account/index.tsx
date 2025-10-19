import DefaultLayout from '@/layouts/Default';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./Login'));
const Login2 = lazy(() => import('./Login2'));
const LoginOAuth = lazy(() => import('./LoginOAuth'));
const OAuthCallback = lazy(() => import('./OAuthCallback'));
const OTPLoginDebug = lazy(() => import('./LoginOAuth/OTPLoginDebug'));
const Logout = lazy(() => import('./Logout'));
const Logout2 = lazy(() => import('./Logout2'));
const Register = lazy(() => import('./Register'));
const Register2 = lazy(() => import('./Register2'));
const RecoverPassword = lazy(() => import('./RecoverPassword'));
const RecoverPassword2 = lazy(() => import('./RecoverPassword2'));
const ConfirmMail = lazy(() => import('./ConfirmMail'));
const ConfirmMail2 = lazy(() => import('./ConfirmMail2'));
const LockScreen = lazy(() => import('./LockScreen'));
const LockScreen2 = lazy(() => import('./LockScreen2'));

export default function Account() {
	return (
		<Routes>
			<Route path="/*" element={<DefaultLayout />}>
				<Route index element={<Login />} />
				<Route path="login" element={<Login />} />
				<Route path="login2" element={<Login2 />} />
				<Route path="login-oauth" element={<LoginOAuth />} />
				<Route path="logout" element={<Logout />} />
				<Route path="logout2" element={<Logout2 />} />
				<Route path="register" element={<Register />} />
				<Route path="register2" element={<Register2 />} />
				<Route path="recover-password" element={<RecoverPassword />} />
				<Route path="recover-password2" element={<RecoverPassword2 />} />
				<Route path="confirm-mail" element={<ConfirmMail />} />
				<Route path="confirm-mail2" element={<ConfirmMail2 />} />
				<Route path="lock-screen" element={<LockScreen />} />
				<Route path="lock-screen2" element={<LockScreen2 />} />
				<Route path="debug-otp" element={<OTPLoginDebug />} />
			</Route>
			{/* OAuth callback route outside DefaultLayout for cleaner UX */}
			<Route path="callback" element={<OAuthCallback />} />
		</Routes>
	);
}
