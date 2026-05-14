# 🚀 Deploy Directly to Vercel (No GitHub)

## Step 1: Install Vercel CLI

Open terminal and run:

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to log in.

## Step 3: Deploy

Navigate to your project folder and run:

```bash
cd siargao-moto-rental
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → siargao-moto-rental (or your choice)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

## Step 4: Add Environment Variables

After first deployment, add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```
Enter: `https://ihllxghuehfeqkpqlvpm.supabase.co`

```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Enter: (your anon key from .env.local)

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
```
Enter: (your service role key from .env.local)

```bash
vercel env add ADMIN_EMAIL
```
Enter: `luwe.ato@gmail.com`

## Step 5: Deploy to Production

```bash
vercel --prod
```

Done! Your app is live! 🎉

## Your URLs

- **Preview:** (shown after first `vercel` command)
- **Production:** (shown after `vercel --prod`)

## Update Supabase

Go to Supabase → Authentication → URL Configuration
Add your Vercel URL to Site URL and Redirect URLs

---

## Quick Commands

- **Deploy preview:** `vercel`
- **Deploy production:** `vercel --prod`
- **View logs:** `vercel logs`
- **List deployments:** `vercel ls`
