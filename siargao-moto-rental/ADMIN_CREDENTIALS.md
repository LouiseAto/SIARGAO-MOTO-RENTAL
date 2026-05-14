# 🔐 Admin Login Credentials

## Current Admin Account

**Email:** `luwe.ato@gmail.com`  
**User ID:** `c938f4bb-592a-49ef-8e20-92699d8ef5be`  
**Role:** Admin

## How Login Works (Secure)

### ✅ Security Features:
1. **No Auto-Login** - Users MUST enter email and password
2. **Session-Based** - Uses secure Supabase authentication
3. **Protected Routes** - Middleware blocks unauthorized access
4. **Explicit Sign-In Required** - No bypass or automatic access

### 🔒 Login Flow:
1. User visits landing page (/)
2. Clicks "Login" or "Get Started" → Goes to `/login`
3. **Must enter email and password** (no auto-login)
4. Supabase validates credentials
5. If valid → Creates session → Redirects to dashboard
6. If invalid → Shows error message

### 🚫 What's NOT Happening:
- ❌ No automatic login
- ❌ No credential bypass
- ❌ No demo/test accounts with auto-access
- ❌ No hardcoded passwords in code

## Setting Your Password

If you haven't set a password yet:

### Option 1: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select project: `ihllxghuehfeqkpqlvpm`
3. Go to **Authentication** → **Users**
4. Find user: `luwe.ato@gmail.com`
5. Click the user → **Reset Password**
6. Set a strong password

### Option 2: Via Password Reset Email
1. Go to https://siargao-moto-rental.vercel.app/login
2. Click "Forgot password?"
3. Enter: `luwe.ato@gmail.com`
4. Check your email for reset link
5. Set a new password

## Recommended Password

Use a strong password with:
- At least 12 characters
- Mix of uppercase and lowercase
- Numbers and special characters
- Example: `SiargaoMoto2026!@#`

## Testing Login Security

Try these to verify security:

1. **Test 1: No Auto-Login**
   - Visit: https://siargao-moto-rental.vercel.app
   - Click "Get Started"
   - ✅ Should go to login page (not dashboard)
   - ✅ Should require email + password

2. **Test 2: Wrong Password**
   - Enter correct email
   - Enter wrong password
   - ✅ Should show error message
   - ✅ Should NOT log in

3. **Test 3: No Session Bypass**
   - Open incognito window
   - Go directly to: https://siargao-moto-rental.vercel.app/dashboard
   - ✅ Should redirect to login page
   - ✅ Should NOT show dashboard

## Current System Status

✅ **Secure Login Implemented**
- Landing page buttons → Login page (no auto-login)
- Login requires valid credentials
- Middleware protects all routes
- Session-based authentication

❌ **No Security Issues**
- No hardcoded passwords
- No auto-login bypass
- No demo accounts with automatic access

## If You're Seeing Auto-Login

If you're experiencing automatic login, it's because:
1. **Browser has saved session** - You're already logged in
2. **Cookies are active** - Your previous session is still valid

To test fresh login:
1. Open **Incognito/Private window**
2. Visit the site
3. You'll be required to log in

To force logout:
1. Go to dashboard
2. Click your profile/logout button
3. Or clear browser cookies

## Admin User in Database

Your admin record in Supabase:
```sql
SELECT * FROM admins WHERE email = 'luwe.ato@gmail.com';
```

Should show:
- id: c938f4bb-592a-49ef-8e20-92699d8ef5be
- email: luwe.ato@gmail.com
- full_name: Louise Ato
- role: admin
- is_active: true

## Security Best Practices

1. ✅ Use strong, unique password
2. ✅ Don't share credentials
3. ✅ Enable 2FA in Supabase (optional)
4. ✅ Regularly update password
5. ✅ Log out when done
6. ✅ Use HTTPS only (Vercel provides this)

---

**Your system is secure!** The login requires explicit credentials - no auto-login exists.
