# Frontend Environment Variables

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Update `.env` with your backend URL:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FRONTEND_URL=http://localhost:3000
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Variables

### `VITE_API_URL`
- **Description:** Backend API base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-backend.vercel.app/api`
- **Used in:** `src/utils/api.js`, `CreateChatbot.jsx`

### `VITE_FRONTEND_URL`
- **Description:** Frontend URL for widget script generation
- **Local:** `http://localhost:3000`
- **Production:** `https://your-frontend.vercel.app`
- **Used in:** `CreateChatbot.jsx` for generating embed scripts

## Usage in Code

The API utility (`src/utils/api.js`) automatically uses `VITE_API_URL`:

```javascript
import api from './utils/api'

// All requests use the configured base URL
api.get('/chatbots')
api.post('/chatbots', data)
```

## Vercel Deployment

Add these in Vercel Dashboard → Environment Variables:

- `VITE_API_URL` = Your backend API URL
- `VITE_FRONTEND_URL` = Your frontend URL

**Important:** Variables must start with `VITE_` to be accessible in the browser!

