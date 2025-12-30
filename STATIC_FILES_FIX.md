# Fixing chatbot-widget.js 404 Error

## Issue
The file `chatbot-widget.js` is returning 404 when accessed at:
`https://chatbot-xi-six-89.vercel.app/chatbot-widget.js`

## Solution Applied

### 1. Updated vercel.json
- Modified rewrite rule to exclude static files (including `.js` files)
- Added explicit headers for `chatbot-widget.js` with correct Content-Type
- Added CORS headers to allow cross-origin access

### 2. File Location
The file is located at: `admin/frontend/public/chatbot-widget.js`
Vite automatically copies files from `public/` to the root of `dist/` during build.

### 3. Verification Steps

After redeploying, verify:

1. **Check if file exists in build:**
   ```bash
   # After build, check dist folder
   ls dist/chatbot-widget.js
   ```

2. **Test the URL:**
   ```bash
   curl https://chatbot-xi-six-89.vercel.app/chatbot-widget.js
   ```

3. **Check Vercel Deployment:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Check build logs to ensure file is copied
   - Verify file appears in deployment artifacts

### 4. If Still Not Working

If the file still returns 404 after redeploy:

1. **Check Build Output:**
   - Verify `dist/chatbot-widget.js` exists after `npm run build`
   - Check file permissions

2. **Alternative: Serve via API Route**
   - Create a Vercel serverless function to serve the file
   - Or host it on a CDN

3. **Check Vercel Configuration:**
   - Ensure `outputDirectory` is set to `dist`
   - Verify build command includes the file copy step

### 5. Current Configuration

The `vercel.json` now:
- Excludes `.js` files from SPA rewrite
- Sets correct headers for `chatbot-widget.js`
- Allows CORS access

The rewrite pattern excludes:
- `chatbot-widget.js` (explicitly)
- `assets/` directory
- All files with extensions: `.js`, `.css`, `.png`, etc.

