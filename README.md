# USTA Web Application

Modern React + TypeScript web application with OAuth 2.0 authentication (PKCE flow) integrated with identity server.

## 🚀 Features

- ✅ **OAuth 2.0 Authentication** with PKCE (Proof Key for Code Exchange)
- ✅ **OpenID Connect** integration
- ✅ **Automatic token refresh** (runs every 60 seconds)
- ✅ **Secure token storage** with localStorage
- ✅ **Token revocation** on logout
- ✅ **React 18** with TypeScript
- ✅ **Vite** for fast development and building
- ✅ **React Router v6** for navigation
- ✅ **React Bootstrap** for UI components
- ✅ **ESLint & Prettier** for code quality
- ✅ **CI/CD** with GitHub Actions

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **Yarn** 1.x or higher
- **Identity Server** for authentication

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-app

# Install dependencies
yarn install

# Copy environment variables
cp .env.schema .env

# Update .env with your configuration
# Edit .env file with your identity server settings

# Start development server
yarn dev
```

The app will open at **http://localhost:5297**

## 🔐 OAuth 2.0 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OAuth 2.0 / OpenID Connect Configuration
VITE_IDENTITY_SERVER=
VITE_CLIENT_ID=admin_client
VITE_REDIRECT_URI=http://localhost:5297
VITE_SCOPES=offline_access openid profile email
```

### Identity Server Requirements

Your `admin_client` must be configured on the identity server with:

- **Allowed Redirect URIs:**
  - Development: `http://localhost:5297`
  - Production: `https://yourdomain.com`

- **Allowed Scopes:**
  - `offline_access` - For refresh tokens

- **Grant Types:**
  - `authorization_code` - OAuth 2.0 authorization code flow
  - `refresh_token` - Token refresh

- **PKCE:** Required (code_challenge_method: S256)

### Authentication Flow

```
1. User clicks "Login with Identity Server"
   ↓
2. App generates PKCE challenge and redirects to:
   https://identity.dev.usta.vn/connect/authorize
   ↓
3. User authenticates on identity server
   ↓
4. Identity server redirects back with authorization code:
   http://localhost:5297?code=abc123
   ↓
5. App exchanges code for tokens at /connect/token
   ↓
6. User is authenticated with access_token + refresh_token
```

## 📜 Available Scripts

### Development

```bash
# Start dev server with hot reload
yarn dev

# Type check without building
yarn typecheck

# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Check code formatting
yarn format:check
```

### Testing

```bash
# Run all tests
yarn test

# Run tests in CI mode
yarn test:ci
```

### Building

```bash
# Build for production
yarn build

# Preview production build locally
yarn preview

# Run full validation (typecheck + lint + test)
yarn validate
```

## 🏗️ Project Structure

```
web-app/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
│       ├── ci.yml          # Continuous Integration
│       ├── deploy.yml      # Production deployment
│       └── preview.yml     # PR preview deployments
├── src/
│   ├── common/
│   │   ├── api/
│   │   │   ├── oauth.ts    # OAuth API functions (OTP, user profile)
│   │   │   └── auth.ts     # Legacy auth API
│   │   ├── helpers/
│   │   │   ├── oauth.ts    # OAuth utilities (PKCE, token exchange)
│   │   │   └── httpClient.ts # Axios client with auto token injection
│   │   └── context/
│   │       └── useAuthContext.tsx # Auth state management
│   ├── pages/
│   │   └── account/
│   │       ├── Login/          # Main login page
│   │       ├── LoginOAuth/     # OAuth login page
│   │       └── OAuthCallback/  # OAuth callback handler
│   ├── types/
│   │   └── oauth.ts        # TypeScript types for OAuth
│   ├── routes/
│   │   └── index.tsx       # App routing
│   └── App.tsx             # Main app component
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔄 OAuth Implementation

### Using OAuth in Your Components

```tsx
import { useAuthContext } from '@/common/context';

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user.email}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import HttpClient from '@/common/helpers/httpClient';

// Token is automatically added to Authorization header
async function fetchData() {
  const data = await HttpClient.get('/api/my-endpoint');
  return data;
}
```

### Manual Token Access

```tsx
import { useAuthContext } from '@/common/context';

function MyComponent() {
  const { getAccessToken } = useAuthContext();

  const callAPI = async () => {
    const token = await getAccessToken(); // Auto-refreshes if needed
    // Use token for custom API calls
  };
}
```

## 🚢 Deployment

### GitHub Actions CI/CD

Three workflows are configured:

#### 1. CI Workflow (`.github/workflows/ci.yml`)
Runs on every push and PR:
- Type checking
- Linting
- Tests
- Build verification

#### 2. Deploy Workflow (`.github/workflows/deploy.yml`)
Runs on push to `main`:
- Full validation
- Production build
- Deploy to server

#### 3. Preview Workflow (`.github/workflows/preview.yml`)
Runs on PRs:
- Build preview version
- Deploy to preview environment

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

**OAuth Configuration:**
- `VITE_IDENTITY_SERVER` - Identity server URL
- `VITE_CLIENT_ID` - OAuth client ID
- `VITE_REDIRECT_URI` - Production redirect URI
- `VITE_SCOPES` - OAuth scopes

**Deployment (SSH):**
- `SSH_PRIVATE_KEY` - SSH private key for deployment
- `DEPLOY_HOST` - Deployment server hostname
- `DEPLOY_USER` - Deployment server username
- `DEPLOY_PATH` - Deployment server path

**Alternative Deployment Options:**

The deploy workflow includes commented examples for:
- AWS S3
- Vercel
- Netlify

Uncomment the section you need and add the corresponding secrets.

### Manual Deployment

```bash
# Build for production
yarn build

# The dist/ folder contains the built app
# Upload dist/ to your web server
```

### Environment-Specific Builds

```bash
# Development
yarn build

# Staging
yarn build --mode staging

# Production
yarn build --mode production
```

Create `.env.staging` and `.env.production` files for different environments.

## 🧪 Testing OAuth Flow

### 1. Local Testing

```bash
yarn dev
# Go to http://localhost:5297/account/login
# Click "Login with Identity Server"
```

### 2. Debug Tool

Visit **http://localhost:5297/account/debug-otp** to test endpoints and troubleshoot.

### 3. Check Token Storage

Open DevTools → Application → Local Storage → `_USTA_OAUTH`

Should see:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresAt": 1234567890,
  "user": { "sub": "...", "email": "..." }
}
```

## 📚 Documentation

- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Complete OAuth implementation guide
- **[OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)** - Quick reference
- **[OTP_TROUBLESHOOTING.md](./OTP_TROUBLESHOOTING.md)** - Troubleshooting guide
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Implementation summary

## 🐛 Troubleshooting

### "redirect_uri not valid"
- Check that `VITE_REDIRECT_URI` matches what's configured on the identity server
- Ensure the client ID has the redirect URI whitelisted

### "Failed to refresh token"
- Refresh token may be expired (user needs to login again)
- Check that `offline_access` scope is included

### Token not added to API requests
- Check that `_USTA_OAUTH` exists in localStorage
- Verify httpClient interceptor is configured

### CORS errors
- Identity server must allow requests from your domain
- Check CORS configuration on the backend

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite 4** - Build tool
- **React Router 6** - Routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **i18next** - Internationalization
- **Chart.js** - Charts
- **ApexCharts** - Advanced charts
- **FullCalendar** - Calendar component

## 📝 License

[Your License Here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@usta.vn
- Documentation: See `/docs` folder

## 🎯 Roadmap

- [ ] Add unit tests with Vitest
- [ ] Add E2E tests with Playwright
- [ ] Implement biometric authentication
- [ ] Add multi-factor authentication (MFA)
- [ ] Social login (Google, Facebook, Apple)
- [ ] Session management UI
- [ ] Remember device feature

---

**Built with ❤️ by the USTA team**
