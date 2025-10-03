# 🔧 Supabase Configuration Setup

## The Problem
You're getting CORS errors because your Supabase environment variables are not configured. The error shows requests going to `supabase.com/dashboard/...` instead of your actual Supabase project URL.

## The Solution

### Step 1: Create Environment File
Create a `.env.local` file in your project root with the following content:

```bash
# Copy this to .env.local and replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/admin
```

### Step 2: Get Your Supabase Credentials
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Update Database Schema
Run this SQL in your Supabase SQL Editor to add image_url columns:

```sql
-- Add image_url column to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### Step 4: Restart Your Development Server
```bash
npm run dev
# or
pnpm dev
```

## What I Fixed
✅ Created reusable image upload component  
✅ Updated all admin forms to use image uploads  
✅ Added proper error handling for missing environment variables  
✅ Created database migration script  
✅ Updated TypeScript types  

## Next Steps
1. Create `.env.local` with your Supabase credentials
2. Run the database migration SQL
3. Restart your dev server
4. Test the image upload functionality!

Your admin forms now support direct image uploads instead of requiring URLs! 🎉
