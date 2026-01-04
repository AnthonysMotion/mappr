# Google Authentication Setup Guide

This guide will help you configure Google OAuth authentication for your Mappr application.

## Prerequisites

- A Supabase project (already set up)
- A Google Cloud Platform account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information:
     - App name: "Mappr" (or your app name)
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue** through the scopes (default is fine)
   - Add test users if needed (for development)
   - Click **Save and Continue** to finish
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Mappr Web Client" (or any name)
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - You'll get this from your Supabase project settings
   - Click **Create**
7. **Copy the Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click on it
5. Enable the Google provider
6. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **Save**

## Step 3: Verify Redirect URL

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Make sure your **Site URL** is set correctly:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

## Step 4: Test Google Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000/auth/login`
3. Click **Continue with Google**
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URI in Google Cloud Console matches exactly:
  - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
- Check that your Supabase project reference is correct

### "Access blocked: This app's request is invalid"

- Make sure you've configured the OAuth consent screen
- If in development, add your email as a test user
- Make sure the app is not in "Testing" mode if you want public access

### User Not Redirected After Sign In

- Check that your callback route (`/auth/callback`) is working
- Verify the redirect URL in Supabase matches your site URL
- Check browser console for any errors

### Google Provider Not Showing

- Make sure you've enabled the Google provider in Supabase
- Verify your Client ID and Secret are correct
- Check that you've saved the changes in Supabase

## Production Deployment

When deploying to production:

1. Update Google OAuth credentials:
   - Add your production domain to **Authorized JavaScript origins**
   - Add your production callback URL to **Authorized redirect URIs**
2. Update Supabase:
   - Set **Site URL** to your production domain
   - Add production redirect URL to **Redirect URLs**
3. Update environment variables if needed (they should already be set)

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for sensitive data
- Keep your OAuth credentials secure
- Regularly rotate your secrets

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

