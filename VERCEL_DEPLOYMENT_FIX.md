# Vercel Deployment Fix

## Issue
The deployment is failing because Supabase environment variables are missing in Vercel.

## Solution

### 1. Add Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Add to All Environments

In Vercel, make sure to add these variables to:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4. Redeploy

After adding the environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

### 5. Verify

Your app should now work at your Vercel URL without the environment variable errors.

## Example Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://fydjsieyvnkwilrwwwnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

- Make sure there are no extra spaces in the variable values
- Ensure the URL starts with `https://`
- The anon key should be a long JWT token
- Variables must be prefixed with `NEXT_PUBLIC_` for client-side access
