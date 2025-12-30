# Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Vercel account
- Backend API URL

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

The build output will be in the `dist` folder.

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository or upload the `dist` folder
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin/frontend` (if deploying from root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Environment Variables (if needed)

If your backend API is hosted separately, add these in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add:
  - `VITE_API_URL`: Your backend API URL (e.g., `https://your-api.vercel.app`)

### 5. Verify Deployment

After deployment, your app will be available at:
- `https://your-project.vercel.app`

## Important Notes

1. **API Configuration**: Make sure your backend API CORS is configured to allow requests from your Vercel domain
2. **Routing**: The `vercel.json` file handles SPA routing - all routes redirect to `index.html`
3. **Build Output**: The `dist` folder contains the production build
4. **Environment Variables**: Use `VITE_` prefix for environment variables that should be available in the frontend

## Troubleshooting

- **404 on routes**: Ensure `vercel.json` is in the root directory
- **API errors**: Check CORS settings on your backend
- **Build fails**: Check Node.js version (should be 18+)

