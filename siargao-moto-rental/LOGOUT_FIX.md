# Logout Button Fix

## Issue
The logout button was redirecting users to the login page (`/login`) instead of the landing page, and needed to ensure the user session is properly cleared.

## Solution
1. Updated the `handleLogout` function in `components/layout/Sidebar.tsx` to redirect to the landing page (`/`) after logout
2. Improved the logout API (`/api/auth/logout`) to properly clear Supabase session and cookies
3. Added error handling to ensure redirect happens even if logout fails

## Changes Made

### File: `components/layout/Sidebar.tsx`
- **Line 56-70**: Enhanced `handleLogout` function with proper error handling
- Waits for logout API to complete before redirecting
- Logs any errors but still redirects to landing page
- Ensures user always ends up on landing page

### File: `app/api/auth/logout/route.ts`
- Changed from client-side Supabase client to server-side client
- Explicitly clears auth cookies (`sb-access-token`, `sb-refresh-token`)
- Added better error logging
- Returns success flag in response

## Before
```typescript
// Sidebar.tsx
const handleLogout = async () => {
  if (onLogout) {
    onLogout()
  } else {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"  // ❌ Wrong redirect
  }
}

// logout/route.ts
const supabase = createClient(...)  // ❌ Client-side only
await supabase.auth.signOut()
```

## After
```typescript
// Sidebar.tsx
const handleLogout = async () => {
  if (onLogout) {
    onLogout()
  } else {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) {
        console.error("Logout failed:", await response.json())
      }
      window.location.href = "/"  // ✅ Correct redirect
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/"  // ✅ Always redirect
    }
  }
}

// logout/route.ts
const supabase = createServerClient()  // ✅ Server-side client
await supabase.auth.signOut()
response.cookies.delete('sb-access-token')  // ✅ Clear cookies
response.cookies.delete('sb-refresh-token')
```

## What Happens When User Clicks Logout

1. **User clicks logout button** in sidebar
2. **API call** to `/api/auth/logout` is made
3. **Supabase session cleared** - `supabase.auth.signOut()` is called
4. **Cookies deleted** - Auth cookies are explicitly removed
5. **Redirect to landing page** - User sees the Siargao Moto marketing page
6. **User is logged out** - Cannot access protected pages without logging in again

## Testing
1. Log in to the system
2. Navigate to any page (Dashboard, Employees, etc.)
3. Click the logout button in the sidebar
4. ✅ You should be redirected to the landing page (`/`)
5. ✅ Your session should be cleared
6. ✅ If you try to access `/dashboard` or other protected pages, you should be redirected to login

## Security Notes
- Session is cleared on both client and server
- Auth cookies are explicitly deleted
- User cannot access protected routes after logout
- Even if logout API fails, user is still redirected (fail-safe)

## Deployment
Run `deploy.bat` to deploy these changes to Vercel.

---
**Status**: ✅ Fixed and ready for deployment
**Date**: 2024
