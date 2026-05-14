# Deploy Profile Settings Fix to Vercel

## Files That Were Modified

1. ✅ `app/settings/page.tsx` - Complete profile settings with view/edit modes
2. ✅ `app/api/auth/profile/route.ts` - API endpoint for GET and PUT profile
3. ✅ `app/employees/page.tsx` - Employee status fix
4. ✅ `app/api/employees/[id]/route.ts` - Employee status API fix
5. ✅ `app/api/employees/route.ts` - Employee GET API fix
6. ✅ `components/modals/EmployeeModal.tsx` - Employee modal fixes
7. ✅ `components/modals/RentalModal.tsx` - Rental modal fix
8. ✅ `lib/utils/validators.ts` - Added status field to employee schema

## How to Deploy to Vercel

### Option 1: Using Git (Recommended)

```bash
# Navigate to your project directory
cd siargao-moto-rental

# Check what files changed
git status

# Add all changed files
git add .

# Commit the changes
git commit -m "fix: profile settings save, employee status updates, and rental creation"

# Push to your repository
git push origin main
```

Vercel will automatically detect the push and deploy your changes.

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Navigate to your project
cd siargao-moto-rental

# Deploy
vercel --prod
```

### Option 3: Manual Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your "siargao-moto-rental" project
3. Click on it
4. Go to "Deployments" tab
5. Click "Redeploy" button
6. Select "Use existing Build Cache" (optional)
7. Click "Redeploy"

## After Deployment

### Test Profile Settings:
1. Go to your deployed site
2. Navigate to Settings page
3. Click "Edit" button
4. Change your name
5. Click "Save Changes"
6. Verify the name updates in view mode
7. Refresh the page - name should persist

### Test Employee Status:
1. Go to Employees page
2. Edit an employee
3. Change status to "Inactive"
4. Click "Update Employee"
5. Verify status badge changes to gray "Inactive"

### Check Console for Errors:
1. Open browser console (F12)
2. Look for any errors
3. Check network tab for failed API calls

## Troubleshooting

### If profile still doesn't save:

1. **Check browser console** for errors
2. **Check Network tab** - Look for `/api/auth/profile` PUT request
3. **Verify authentication** - Make sure you're logged in
4. **Check Supabase** - Verify your user exists in employees table

### If employee status doesn't update:

1. **Check console logs** - Should show "Mapped status to is_active"
2. **Verify database** - Run this in Supabase SQL Editor:
   ```sql
   SELECT id, full_name, is_active FROM employees;
   ```
3. **Check is_active column** - Should change from true to false

### If deployment fails:

1. Check Vercel deployment logs
2. Look for build errors
3. Verify all dependencies are installed
4. Check environment variables are set

## Environment Variables Required

Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

## Expected Behavior After Deployment

### Profile Settings:
- ✅ Loads current user profile
- ✅ "Edit" button enables editing
- ✅ "Save Changes" persists to database
- ✅ "Cancel" discards changes
- ✅ View mode shows updated values
- ✅ Changes persist after page refresh

### Employee Status:
- ✅ Status dropdown works (Active/Inactive/On Leave)
- ✅ Status badge updates immediately
- ✅ Status persists after page refresh
- ✅ Active counter updates correctly

### Rental Creation:
- ✅ Total cost field accepts numbers
- ✅ Rental creation succeeds
- ✅ No validation errors

## Quick Deploy Command

```bash
cd siargao-moto-rental && git add . && git commit -m "fix: profile settings and employee status" && git push
```

This will trigger automatic deployment on Vercel.
