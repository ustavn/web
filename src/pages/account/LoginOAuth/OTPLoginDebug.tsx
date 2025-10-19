/**
 * Debug component for OTP login troubleshooting
 * Use this to test OTP API endpoints
 */

import { useState } from 'react';
import { Button, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

export default function OTPLoginDebug() {
	const [endpoint, setEndpoint] = useState('https://identity.dev.usta.vn/api/auth/request-otp');
	const [email, setEmail] = useState('abc1@gmail.com');
	const [response, setResponse] = useState<any>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const testOTPRequest = async () => {
		setLoading(true);
		setError('');
		setResponse(null);

		try {
			console.log('Testing OTP request to:', endpoint);
			console.log('With email:', email);

			const res = await axios.post(
				endpoint,
				{ email },
				{
					headers: {
						'Content-Type': 'application/json',
					},
					timeout: 10000,
				}
			);

			console.log('Response:', res);
			setResponse(res.data);
		} catch (err: any) {
			console.error('Error:', err);
			setError(
				err.response?.data?.message ||
					err.response?.data?.error ||
					err.message ||
					'Unknown error'
			);
			setResponse(err.response?.data || null);
		} finally {
			setLoading(false);
		}
	};

	const testAuthorizationEndpoint = async () => {
		const authUrl = 'https://identity.dev.usta.vn/connect/authorize';
		setLoading(true);
		setError('');
		setResponse(null);

		try {
			console.log('Testing authorization endpoint:', authUrl);

			// Test with a simple OPTIONS request to check CORS
			const res = await axios.get(authUrl, {
				params: {
					client_id: 'test_client',
					response_type: 'code',
					scope: 'offline_access',
				},
				timeout: 10000,
			});

			console.log('Auth endpoint response:', res);
			setResponse({ message: 'Authorization endpoint is reachable', data: res.data });
		} catch (err: any) {
			console.error('Auth endpoint error:', err);
			setError(
				err.response?.data?.message ||
					err.response?.data?.error ||
					err.message ||
					'Cannot reach authorization endpoint'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-5">
			<Card>
				<Card.Header>
					<h4>OTP Login Debug Tool</h4>
				</Card.Header>
				<Card.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>OTP Endpoint URL</Form.Label>
							<Form.Control
								type="text"
								value={endpoint}
								onChange={(e) => setEndpoint(e.target.value)}
								placeholder="Enter OTP endpoint URL"
							/>
							<Form.Text>The API endpoint for OTP request</Form.Text>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email"
							/>
						</Form.Group>

						<div className="d-flex gap-2 mb-3">
							<Button onClick={testOTPRequest} disabled={loading} variant="primary">
								{loading ? 'Testing...' : 'Test OTP Request'}
							</Button>
							<Button
								onClick={testAuthorizationEndpoint}
								disabled={loading}
								variant="secondary"
							>
								Test Auth Endpoint
							</Button>
						</div>
					</Form>

					{error && (
						<Alert variant="danger" className="mt-3">
							<Alert.Heading>Error</Alert.Heading>
							<p>{error}</p>
						</Alert>
					)}

					{response && (
						<Alert variant="success" className="mt-3">
							<Alert.Heading>Response</Alert.Heading>
							<pre style={{ maxHeight: '300px', overflow: 'auto' }}>
								{JSON.stringify(response, null, 2)}
							</pre>
						</Alert>
					)}

					<Card className="mt-4">
						<Card.Header>Troubleshooting Steps</Card.Header>
						<Card.Body>
							<ol>
								<li>
									<strong>Check if identity server is running:</strong>
									<br />
									Open{' '}
									<a
										href="https://identity.dev.usta.vn"
										target="_blank"
										rel="noopener noreferrer"
									>
										https://identity.dev.usta.vn
									</a>{' '}
									in your browser
								</li>
								<li>
									<strong>Check CORS configuration:</strong>
									<br />
									The identity server must allow requests from{' '}
									<code>{window.location.origin}</code>
								</li>
								<li>
									<strong>Verify OTP endpoint exists:</strong>
									<br />
									The endpoint <code>/api/auth/request-otp</code> must be implemented on
									the identity server
								</li>
								<li>
									<strong>Check browser console:</strong>
									<br />
									Open DevTools (F12) → Console tab for detailed error messages
								</li>
								<li>
									<strong>Check Network tab:</strong>
									<br />
									Open DevTools (F12) → Network tab to see if requests are being made
								</li>
							</ol>
						</Card.Body>
					</Card>

					<Card className="mt-3">
						<Card.Header>Expected OTP Flow (from Postman collection)</Card.Header>
						<Card.Body>
							<p>Based on your Postman collection, the standard OAuth flow is:</p>
							<ol>
								<li>
									<strong>GET</strong>{' '}
									<code>/connect/authorize?client_id=test_client&...</code>
									<br />
									<small className="text-muted">
										User authenticates and gets authorization code
									</small>
								</li>
								<li>
									<strong>POST</strong> <code>/connect/token</code>
									<br />
									<small className="text-muted">
										Exchange code for access + refresh tokens
									</small>
								</li>
							</ol>

							<Alert variant="warning" className="mt-3">
								<strong>Note:</strong> The Postman collection doesn't show OTP endpoints
								(<code>/api/auth/request-otp</code>). You may need to:
								<ul className="mb-0 mt-2">
									<li>Ask your backend team to implement OTP endpoints, or</li>
									<li>Use the traditional OAuth redirect flow instead</li>
								</ul>
							</Alert>
						</Card.Body>
					</Card>
				</Card.Body>
			</Card>
		</div>
	);
}

