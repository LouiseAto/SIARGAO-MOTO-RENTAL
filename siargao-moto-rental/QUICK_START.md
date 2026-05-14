# ⚡ Quick Start Guide

Get the Siargao Moto Rental Management System running in 10 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ Supabase account created
- ✅ Git installed (optional)

---

## 🚀 5-Step Setup

### Step 1: Install Dependencies (2 min)

```bash
cd siargao-moto-rental
npm install
```

### Step 2: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Step 3: Set Up Database (3 min)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste `supabase/migrations/001_initial_schema.sql`
5. Click **Run**
6. Repeat for `supabase/migrations/002_seed_data.sql`

### Step 4: Create Admin User (2 min)

**In Supabase Dashboard:**
1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - Email: `admin@siargao-moto.com`
   - Password: `Admin123!`
4. Click **Create user**
5. **Copy the User ID**

**In SQL Editor:**
```sql
INSERT INTO admins (id, email, full_name, role)
VALUES ('PASTE_USER_ID_HERE', 'admin@siargao-moto.com', 'Admin User', 'admin');
```

### Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎉 You're Done!

Login with:
- **Email**: `admin@siargao-moto.com`
- **Password**: `Admin123!`

---

## 📱 What You'll See

### Dashboard
- 5 sample motorbikes
- 3 sample customers
- 3 sample employees
- Real-time statistics

### Available Features
- ✅ Motorbike management
- ✅ Rental management
- ✅ Employee management
- ✅ Payroll management
- ✅ Interactive map

---

## 🔧 Common Issues

### "Invalid API credentials"
```bash
# Check your .env.local file
# Ensure no extra spaces
# Restart dev server: Ctrl+C then npm run dev
```

### "User not authorized"
```sql
-- Verify admin record exists
SELECT * FROM admins;

-- If missing, run the INSERT statement again
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Map not loading
```bash
# Check browser console for errors
# Ensure motorbikes have valid coordinates
# Try hard refresh: Ctrl+Shift+R
```

---

## 📚 Next Steps

1. **Explore the app**: Click through all pages
2. **Add your data**: Create your own motorbikes
3. **Customize**: Update colors in `tailwind.config.ts`
4. **Read docs**: Check out [README.md](./README.md)
5. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📖 Documentation

- **[README.md](./README.md)** - Full documentation
- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[TESTING.md](./TESTING.md)** - Testing procedures

---

## 💡 Pro Tips

1. **Use Chrome DevTools**: Press F12 to debug
2. **Check Console**: Look for errors in browser console
3. **Supabase Logs**: Check logs in Supabase dashboard
4. **Hot Reload**: Changes auto-refresh in dev mode
5. **TypeScript**: Let TypeScript catch errors early

---

## 🆘 Need Help?

1. Check the error message carefully
2. Look in the documentation
3. Check Supabase dashboard for database issues
4. Verify environment variables
5. Try restarting the dev server

---

## 🎊 Sample Data Included

The seed migration includes:

**Motorbikes:**
- Honda Click 150i (Red)
- Yamaha NMAX (Blue)
- Honda Beat (Black)
- Suzuki Raider 150 (White)
- Kawasaki Ninja 400 (Green)

**Customers:**
- John Doe
- Jane Smith
- Mike Johnson

**Employees:**
- Maria Santos (Staff)
- Pedro Cruz (Mechanic)
- Ana Reyes (Staff)

---

## 🚀 Ready to Deploy?

Once you're happy with local testing:

1. Push code to GitHub
2. Deploy to Vercel (recommended)
3. Add environment variables
4. Create production admin user
5. Go live!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

---

**Happy Coding!** 🏍️

*Built for Siargao Island with ❤️*
