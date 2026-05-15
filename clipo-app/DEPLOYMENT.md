# Frontend Deployment Guide - Clipo

## 📋 Pre-Deployment Checklist

✅ Done:

- [ ] API URL configured for production
- [ ] Google OAuth Client ID verified
- [ ] Environment variables set up
- [ ] Build tested locally
- [ ] All dependencies installed

## 🚀 Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

1. **Connect GitHub Repository**

   ```bash
   # Push code to GitHub if not already done
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select root as frontend directory

3. **Configure Environment Variables in Vercel**
   - Framework: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`

   **Environment Variables:**

   ```
   VITE_API_URL=https://clipo-server.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=602293352058-mv2k3nu25qs51hdsu9iah0hdfnmtrerg.apps.googleusercontent.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build & Deploy**

   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Add Environment Variables in Netlify Dashboard**
   - Go to Site settings → Build & deploy → Environment
   - Add the same environment variables as above

### Option 3: Deploy to Render

1. **Create New Web Service on Render**
   - Select "Static Site"
   - Connect GitHub repository
2. **Configure**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
3. **Environment Variables**
   - Add same variables as above

## 🔧 Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Configuration

Create `.env.local` for local development (Git ignored):

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=602293352058-mv2k3nu25qs51hdsu9iah0hdfnmtrerg.apps.googleusercontent.com
```

For production, set environment variables in your hosting platform's dashboard.

## ✨ Build Optimization

Current optimizations in `vite.config.js`:

- ✅ Code splitting (vendor, UI libs, main app)
- ✅ Minification with Terser
- ✅ No source maps in production
- ✅ Async chunk loading

## 🐛 Troubleshooting

**API calls failing in production:**

- Check `VITE_API_URL` in production environment
- Ensure server has CORS enabled for frontend domain
- Check browser console for exact error

**Google OAuth not working:**

- Verify `VITE_GOOGLE_CLIENT_ID` is correct
- Add frontend URL to Google OAuth Authorized redirect URIs
- Go to [Google Cloud Console](https://console.cloud.google.com)
- OAuth consent screen → Authorized redirect URIs
- Add: `https://your-frontend-url/` and `http://localhost:3000/`

**Blank page on production:**

- Check build artifacts in `dist/` folder
- Verify all environment variables are set
- Check browser console for JavaScript errors

## 📊 Performance

Current bundled size (approximate):

- Main app: ~250KB (gzipped)
- Vendor libs: ~150KB (gzipped)
- UI libraries: ~100KB (gzipped)

## 🔐 Security Checklist

- [ ] Never commit `.env` files with secrets
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS on your domain
- [ ] Set appropriate CORS headers on backend
- [ ] Sanitize user inputs (already done with React)

## 📱 Production URLs

When ready, update these:

- Frontend: `https://your-frontend-url.com`
- Backend API: `https://clipo-server.onrender.com/api`
- Google OAuth redirects: Add front-end URL

---

**Last Updated:** March 24, 2026
