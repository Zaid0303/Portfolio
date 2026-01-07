# Google Authentication Setup Guide

## Step-by-Step Instructions

### 1. Enable Google Provider in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** switch
6. Enter your **Project support email** (your email)
7. Click **Save**

### 2. Configure OAuth Consent Screen (if needed)

If this is the first time using Google authentication:

1. You might be redirected to Google Cloud Console
2. Configure OAuth consent screen:
   - Choose **External** (for testing) or **Internal** (for G Suite)
   - Fill in app information:
     - App name: "Portfolio Dashboard"
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes (default is fine)
   - Click **Save and Continue**
   - Add test users if needed (for testing)
   - Click **Save and Continue**
   - Review and go back to dashboard

### 3. Authorized Domains

1. In Firebase Console > **Authentication** > **Settings**
2. Under **Authorized domains**, make sure these are added:
   - `localhost` (for development)
   - Your custom domain (for production)
3. Default domains are already added

### 4. That's It!

Your Google authentication is now configured. Users can:
- Sign in with Email/Password (existing)
- Sign in with Google (new!)

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to login page: `http://localhost:5173/login`

3. Click "Continue with Google" button

4. A popup will open asking for Google account selection

5. After selecting account, you'll be signed in and redirected to dashboard

## Troubleshooting

### Error: "auth/popup-closed-by-user"
- User closed the popup window
- Just try again

### Error: "auth/unauthorized-domain"
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains
- Make sure `localhost` is in the list for development

### Error: "auth/operation-not-allowed"
- Google provider is not enabled
- Enable it in Firebase Console > Authentication > Sign-in method

### Popup blocked?
- Make sure popup blocker is disabled for localhost
- Use Chrome or Firefox for best results

## Code Implementation

The code is already updated in `src/pages/Login.jsx`:
- Google sign-in button added
- `signInWithPopup` function implemented
- Error handling included
- Loading states managed

No additional code changes needed! 🎉




