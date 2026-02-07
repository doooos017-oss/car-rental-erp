# 🛠️ Quick Setup Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Firebase account

## 🚀 5-Minute Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd car-rental-erp
npm install
```

### 2. Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Storage
3. Copy Firebase config to `.env` file

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 4. Run Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📋 Configuration Checklist

### Firebase Services
- [ ] Authentication enabled (Email/Password, Google)
- [ ] Firestore Database created
- [ ] Storage bucket configured
- [ ] Security rules deployed

### Environment Variables
- [ ] Firebase API keys set
- [ ] Project ID configured
- [ ] Optional: Stripe/PayPal keys

### Local Setup
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Authentication working
- [ ] Database operations working

## 🔧 Common Setup Issues

### Firebase Connection
```bash
# Check Firebase CLI
firebase --version

# Login again if needed
firebase login

# Check project
firebase projects:list
```

### Environment Issues
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Issues
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

## 📱 Testing Your Setup

### 1. Authentication Test
- Try to register a new user
- Test login with email/password
- Test Google login

### 2. Database Test
- Add a car in Fleet Management
- Create a customer
- Generate a contract

### 3. Features Test
- Upload a document
- Generate a report
- Test Arabic RTL support

## 🚀 Ready for Production?

When all tests pass:
```bash
npm run build
npm run deploy:firebase
```

## 🆘 Need Help?

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review Firebase documentation
3. Check error logs in browser console
4. Verify Firebase project settings

## 📊 Next Steps

After successful setup:
1. Customize branding and colors
2. Add your own data
3. Configure payment gateways
4. Set up custom domain
5. Add team members

## 🔐 Security Notes

- Never commit `.env` file
- Use strong authentication
- Regularly update dependencies
- Monitor Firebase usage
- Set up billing alerts

## 📈 Performance Tips

- Optimize images before upload
- Use Firebase hosting CDN
- Implement lazy loading
- Monitor bundle size
- Cache static assets

---

**🎉 Congratulations! Your car rental system is ready!**
