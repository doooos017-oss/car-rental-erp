# 🚀 Deployment Guide

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `car-rental-erp`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services
In your Firebase project console, enable:

#### Authentication
- Go to Authentication → Sign-in method
- Enable Email/Password
- Enable Google Provider
- Enable Facebook Provider (if needed)

#### Firestore Database
- Go to Firestore Database
- Create database in test mode (for development)
- Choose location near your users

#### Storage
- Go to Storage
- Get started
- Choose security rules (start in test mode)

#### Functions (Optional)
- Go to Functions
- Set up billing if needed

### 3. Configure Firebase Config
1. Go to Project Settings → General
2. Scroll down to "Firebase config snippet"
3. Copy the configuration
4. Update `.env` file with your credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Update Project ID
Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 3. Run Development Server
```bash
npm run dev
```

## Production Deployment

### Method 1: Firebase Hosting (Recommended)

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login to Firebase
```bash
firebase login
```

#### Deploy
```bash
npm run deploy:firebase
```

### Method 2: Vercel

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy
```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

### Method 3: Netlify

#### Build and Deploy
```bash
npm run build
# Upload dist folder to Netlify
```

## Security Rules

### Firestore Rules
Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

### Storage Rules
Deploy storage rules:
```bash
firebase deploy --only storage
```

## Environment Variables

### Required Variables
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Optional Variables
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_PAYPAL_CLIENT_ID`

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Test database operations
- [ ] Test file uploads
- [ ] Verify RTL Arabic support
- [ ] Test mobile responsiveness
- [ ] Check security rules
- [ ] Monitor Firebase usage
- [ ] Set up billing if needed

## Monitoring

### Firebase Console
- Monitor Authentication usage
- Track Firestore reads/writes
- Check Storage usage
- Review Function execution (if used)

### Performance
- Use Firebase Performance Monitoring
- Set up alerts for high usage
- Monitor error rates

## Troubleshooting

### Common Issues

#### Firebase Configuration
- Ensure all environment variables are set
- Check Firebase project ID matches
- Verify API keys are correct

#### CORS Issues
- Check Firebase security rules
- Verify domain is whitelisted

#### Build Errors
- Clear node_modules and reinstall
- Check for missing dependencies
- Verify Vite configuration

#### Deployment Issues
- Check Firebase CLI authentication
- Verify project permissions
- Check build output in dist folder

## Support

For issues:
1. Check Firebase documentation
2. Review error logs in Firebase console
3. Verify configuration files
4. Test in development environment first

## Scaling

When ready to scale:
1. Upgrade Firebase plan
2. Set up custom domains
3. Implement caching strategies
4. Add monitoring and analytics
5. Consider CDN for static assets
