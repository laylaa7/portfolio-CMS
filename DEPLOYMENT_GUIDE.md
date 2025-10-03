# 🚀 Resource Management System - Deployment Guide

## Overview
This guide covers deploying your portfolio CMS with the new resource management system (public/protected resources) to Vercel and Supabase Cloud.

## Prerequisites
- Vercel account
- Supabase Cloud account
- GitHub repository with your code

## Step 1: Database Setup

### 1.1 Run Database Migrations
Execute these SQL scripts in your Supabase SQL Editor in order:

```sql
-- 1. Create the resource management schema
-- Run: scripts/005_resource_management_schema.sql

-- 2. Create storage bucket for files
-- Run: scripts/006_create_files_bucket.sql
```

### 1.2 Verify Tables Created
Check that these tables exist:
- `resources` (with new columns: visibility, file_url, file_name, file_size)
- `resource_requests`
- `users`
- Storage bucket: `portfolio-files`

## Step 2: Environment Variables

### 2.1 Supabase Configuration
In your Supabase dashboard → Settings → API, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 Vercel Environment Variables
In Vercel dashboard → Project Settings → Environment Variables, add:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app/admin
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository with your portfolio CMS

### 3.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (if your Next.js app is in the root)
- **Build Command**: `npm run build` (or `pnpm build`)
- **Output Directory**: `.next`

### 3.3 Environment Variables
Add the environment variables from Step 2.2 in Vercel dashboard.

### 3.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 4: Configure Supabase

### 4.1 Update Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**: `https://your-domain.vercel.app`

**Redirect URLs**:
- `https://your-domain.vercel.app/admin`
- `https://your-domain.vercel.app/admin/login`
- `https://your-domain.vercel.app/admin/signup`

### 4.2 Configure CORS
In Supabase Dashboard → Settings → API:

**Additional URLs**: `https://your-domain.vercel.app`

## Step 5: Test the System

### 5.1 Test Public Resources
1. Visit your deployed site
2. Go to `/resources`
3. Create a public resource in admin panel
4. Verify it shows "Download" button directly

### 5.2 Test Protected Resources
1. Create a protected resource in admin panel
2. Visit `/resources` as a non-logged-in user
3. Verify it shows "Sign In to Request Access"
4. Sign up/login and request access
5. Approve the request in admin panel
6. Verify user can download the file

### 5.3 Test Admin Features
1. Login to admin panel
2. Go to `/admin/resources`
3. Verify you can see resource requests
4. Test approve/deny functionality
5. Test visibility toggle (public ↔ protected)

## Step 6: Security Checklist

### 6.1 Row Level Security (RLS)
✅ All tables have RLS enabled
✅ Policies restrict access based on user roles
✅ Protected resources require approval
✅ Expired access is automatically revoked

### 6.2 File Security
✅ Files stored in private Supabase storage
✅ Signed URLs for protected files (1-hour expiry)
✅ Public files accessible without authentication
✅ Admin bypass for all restrictions

### 6.3 Authentication
✅ Supabase Auth integration
✅ Role-based access control
✅ Automatic user profile creation
✅ Secure session management

## Step 7: Monitoring & Maintenance

### 7.1 Database Monitoring
- Monitor `resource_requests` table for pending requests
- Check for expired access that needs cleanup
- Review user activity and access patterns

### 7.2 Storage Monitoring
- Monitor file uploads in Supabase Storage
- Check storage usage and limits
- Clean up unused files periodically

### 7.3 Performance Optimization
- Use Supabase CDN for file delivery
- Implement caching for frequently accessed resources
- Monitor API response times

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Verify environment variables are set correctly
- Check Supabase URL configuration
- Ensure redirect URLs are properly configured

**2. File Upload Issues**
- Verify storage bucket exists (`portfolio-files`)
- Check storage policies are correct
- Ensure user has proper permissions

**3. Authentication Issues**
- Verify Supabase Auth is enabled
- Check redirect URLs in Supabase dashboard
- Ensure RLS policies are not blocking access

**4. Resource Access Issues**
- Check if user is properly authenticated
- Verify request status in database
- Check expiration dates on approved requests

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test database connection
# Use Supabase SQL Editor to run test queries
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs in dashboard
3. Verify all environment variables
4. Test database connections
5. Review RLS policies

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure backup strategies
3. Implement user analytics
4. Add email notifications for requests
5. Consider implementing resource categories/tags

---

**🎉 Congratulations!** Your resource management system is now live with public/protected resource support!

