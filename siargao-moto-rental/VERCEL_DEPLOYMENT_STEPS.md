# 🚀 Vercel Deployment - Step by Step Guide

## ✅ Prerequisites Completed
- ✅ Vercel CLI installed
- ✅ Project ready for deployment
- ✅ Environment variables documented

---

## 📋 Step 1: Login to Vercel

Open your terminal in the project folder and run:

```bash
vercel login
```

This will:
1. Open your browser
2. Ask you to log in with your Vercel account (or create one)
3. Confirm the login in terminal

---

## 📋 Step 2: Deploy to Vercel (Preview)

Run this command to create your first deployment:

```bash
vercel
```

**Answer the prompts:**

1. **Set up and deploy "~/siargao-moto-rental"?** → Press `Y` (Yes)
2. **Which scope do you want to deploy to?** → Select your account (use arrow keys)
3. **Link to existing project?** → Press `N` (No)
4. **What's your project's name?** → Type `siargao-moto-rental` or press Enter
5. **In which directory is your code located?** → Press Enter (uses `./`)
6. **Want to override the settings?** → Press `N` (No)

Vercel will now:
- Build your project
- Deploy it
- Give you a preview URL (like `https://siargao-moto-rental-xxxxx.vercel.app`)

---

## 📋 Step 3: Add Environment Variables

After the first deployment, add your environment variables:

### 3.1 Add Supabase URL
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```
When prompted:
- **What's the value?** → `https://ihllxghuehfeqkpqlvpm.supabase.co`
- **Add to which environments?** → Select all (Production, Preview, Development)

### 3.2 Add Supabase Anon Key
```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
When prompted:
- **What's the value?** → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobGx4Z2h1ZWhmZXFrcHFsdnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzYwMjMsImV4cCI6MjA5MzU1MjAyM30.pi92iDnJJqLUeh7cPP7LPNyu8uQ4zv1KRofFJOuj7AM`
- **Add to which environments?** → Select all

### 3.3 Add Service Role Key
```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
```
When prompted:
- **What's the value?** → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobGx4Z2h1ZWhmZXFrcHFsdnBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk3NjAyMywiZXhwIjoyMDkzNTUyMDIzfQ.BIeLF5upkTHgabv-oiw21mbGjtZZj_Xar4FEFWVrRtg`
- **Add to which environments?** → Select all

---

## 📋 Step 4: Deploy to Production

Now deploy to production with all environment variables:

```bash
vercel --prod
```

This will:
- Build your project again
- Deploy to production
- Give you your production URL (like `https://siargao-moto-rental.vercel.app`)

---

## 📋 Step 5: Update Supabase Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ihllxghuehfeqkpqlvpm`
3. Go to **Authentication** → **URL Configuration**
4. Update these fields:

   **Site URL:**
   ```
   https://siargao-moto-rental.vercel.app
   ```

   **Redirect URLs:** (add both)
   ```
   https://siargao-moto-rental.vercel.app/**
   https://siargao-moto-rental-*.vercel.app/**
   ```

5. Click **Save**

---

## 🎉 You're Done!

Your app is now live at: `https://siargao-moto-rental.vercel.app`

### Test Your Deployment:
1. Visit your production URL
2. Try logging in with: `luwe.ato@gmail.com`
3. Check if all features work

---

## 🔧 Useful Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy to production |
| `vercel logs` | View deployment logs |
| `vercel ls` | List all deployments |
| `vercel env ls` | List environment variables |
| `vercel domains` | Manage custom domains |

---

## 🐛 Troubleshooting

### If build fails:
```bash
npm run build
```
Fix any errors locally first, then deploy again.

### If environment variables are missing:
```bash
vercel env ls
```
Check if all variables are added. Add missing ones with `vercel env add`.

### If you need to redeploy:
```bash
vercel --prod --force
```

---

## 📝 Notes

- **No SSL Issues on Vercel:** The SSL certificate issues you have locally won't affect Vercel deployment
- **Automatic HTTPS:** Vercel provides free SSL certificates
- **Fast Deployments:** Updates deploy in ~30 seconds
- **Preview URLs:** Every `vercel` command creates a unique preview URL for testing

---

## 🔐 Admin Credentials

- **Email:** luwe.ato@gmail.com
- **User ID:** c938f4bb-592a-49ef-8e20-92699d8ef5be

---

**Ready to deploy? Start with Step 1!** 🚀
