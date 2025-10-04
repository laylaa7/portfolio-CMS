# API Key Troubleshooting Guide

## "Invalid API key" Error Fix

### 1. Verify Your Supabase Keys

Go to your Supabase Dashboard:
1. **Project Settings** → **API**
2. Copy the **exact** values:

```
Project URL: https://fydjsieyvnkwilrwwwnr.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Check Vercel Environment Variables

In Vercel Dashboard:
1. **Settings** → **Environment Variables**
2. Verify these exact variable names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Common Issues & Solutions

#### Issue: Wrong Key Type
❌ **Wrong**: Using `service_role` key  
✅ **Correct**: Use `anon public` key

#### Issue: Extra Spaces/Characters
❌ **Wrong**: ` eyJhbGciOiJIUzI1NiIs... ` (with spaces)  
✅ **Correct**: `eyJhbGciOiJIUzI1NiIs...` (no spaces)

#### Issue: Wrong Variable Names
❌ **Wrong**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`  
✅ **Correct**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Issue: Not Set for All Environments
Make sure variables are set for:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4. Step-by-Step Fix

1. **Delete existing variables** in Vercel
2. **Add them again** with exact values from Supabase
3. **Redeploy** your application
4. **Test** the login functionality

### 5. Verify Keys Are Working

Test locally first:
```bash
# Check your .env.local file
cat .env.local

# Should show:
NEXT_PUBLIC_SUPABASE_URL=https://fydjsieyvnkwilrwwwnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 6. If Still Not Working

1. **Regenerate API keys** in Supabase:
   - Settings → API → Reset API keys
   - Copy the new `anon public` key
   - Update in Vercel

2. **Check Supabase project status**:
   - Make sure project is active
   - Check if there are any billing issues

3. **Test with curl**:
```bash
curl -X POST 'https://fydjsieyvnkwilrwwwnr.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 7. Quick Checklist

- [ ] Using `anon public` key (not service_role)
- [ ] Variable names start with `NEXT_PUBLIC_`
- [ ] No extra spaces in values
- [ ] Set for all environments in Vercel
- [ ] Redeployed after adding variables
- [ ] Supabase project is active

## Still Having Issues?

1. Check Vercel deployment logs for specific error messages
2. Verify Supabase project is not paused
3. Try creating a new Supabase project and use those keys
4. Contact support with exact error messages
