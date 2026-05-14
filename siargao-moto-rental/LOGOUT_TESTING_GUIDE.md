# Logout Functionality - Testing Guide

## What Was Fixed

The logout button now:
1. ✅ **Clears your Supabase session** - Signs you out completely
2. ✅ **Deletes auth cookies** - Removes `sb-access-token` and `sb-refresh-token`
3. ✅ **Redirects to landing page** - Shows the marketing page at `/`
4. ✅ **Prevents access to protected pages** - You'll need to log in again

## How to Test After Deployment

### Step 1: Log In
1. Go to your deployed site
2. Navigate to `/login`
3. Log in with your credentials
4. You should be redirected to `/dashboard`

### Step 2: Navigate Around
1. Click on different pages (Employees, Rentals, Customers, etc.)
2. Verify you can access all pages while logged in

### Step 3: Test Logout
1. Click the **Logout** button in the sidebar (bottom of sidebar)
2. **Expected behavior**:
   - You should be immediately redirected to the landing page (`/`)
   - You should see the Siargao Moto marketing page with "Get Started" buttons

### Step 4: Verify Session is Cleared
1. Try to manually navigate to `/dashboard` by typing in the URL
2. **Expected behavior**:
   - You should be redirected to `/login`
   - You should NOT be able to access the dashboard
   - This confirms your session was properly cleared

### Step 5: Verify Cookies are Cleared
1. Open browser DevTools (F12)
2. Go to Application tab → Cookies
3. Check for Supabase cookies
4. **Expected behavior**:
   - `sb-access-token` should be deleted or empty
   - `sb-refresh-token` should be deleted or empty

## Troubleshooting

### Issue: Still logged in after clicking logout
**Solution**: 
- Clear browser cache and cookies manually
- Try in incognito/private window
- Check browser console for errors

### Issue: Redirected to login instead of landing page
**Solution**: 
- Verify deployment completed successfully
- Check Vercel deployment logs
- Ensure latest code is deployed

### Issue: Can still access dashboard after logout
**Solution**: 
- This indicates session wasn't cleared
- Check browser console for API errors
- Verify `/api/auth/logout` endpoint is working
- Check Supabase dashboard for active sessions

## Expected Flow Diagram

```
User clicks Logout
    ↓
Call /api/auth/logout API
    ↓
Supabase signs out user
    ↓
Delete auth cookies
    ↓
Redirect to landing page (/)
    ↓
User sees marketing page
    ↓
Protected routes now require login
```

## API Response

When logout is successful, the API returns:
```json
{
  "message": "Logged out successfully",
  "success": true
}
```

When logout fails, the API returns:
```json
{
  "error": "Error message here"
}
```

**Note**: Even if the API fails, the user will still be redirected to the landing page as a fail-safe.

---
**Ready to test**: After running `deploy.bat` and Vercel deployment completes
