# 🚀 Deploy to Vercel - Quick Guide

## Step 1: Push to GitHub

```bash
cd siargao-moto-rental
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/siargao-moto-rental.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ihllxghuehfeqkpqlvpm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key from .env.local)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key from .env.local)
4. Click Deploy!

## Step 3: Update Supabase

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to Site URL and Redirect URLs

Done! Your app is live! 🎉
