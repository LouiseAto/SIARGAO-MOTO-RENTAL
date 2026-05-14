# 🏍️ Siargao Moto Rental Management System

A production-ready, full-stack admin system for managing motorbike rentals in Siargao, Philippines. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time statistics and recent rental overview
- **Motorbike Management**: Full CRUD operations for motorbike inventory
- **Rental Management**: Track active, completed, and cancelled rentals
- **Employee Management**: Manage staff, mechanics, and admin users
- **Payroll System**: Calculate and track employee compensation
- **GIS Mapping**: Interactive map showing motorbike locations using Leaflet

### Technical Features
- ✅ Admin-only authentication with Supabase Auth
- ✅ Row-level security (RLS) policies
- ✅ TypeScript for type safety
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time data synchronization
- ✅ Automated calculations (rental costs, payroll)
- ✅ Input validation with Zod
- ✅ Secure API routes
- ✅ Environment variable management

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd siargao-moto-rental
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Set up Supabase database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`

### 5. Create admin user

In Supabase dashboard:
1. Go to Authentication > Users
2. Click "Add user"
3. Create a user with email and password
4. Note the user ID

Then run this SQL in the SQL Editor:

```sql
INSERT INTO admins (id, email, full_name, role)
VALUES ('your-user-id', 'admin@siargao-moto.com', 'Admin User', 'admin');
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
siargao-moto-rental/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── motorbikes/   # Motorbike CRUD
│   │   ├── rentals/      # Rental CRUD
│   │   ├── employees/    # Employee CRUD
│   │   └── payroll/      # Payroll CRUD
│   ├── dashboard/        # Dashboard page
│   ├── motorbikes/       # Motorbike management
│   ├── rentals/          # Rental management
│   ├── employees/        # Employee management
│   ├── payroll/          # Payroll management
│   ├── map/              # GIS map view
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── Navbar.tsx
│   ├── Table.tsx
│   ├── Modal.tsx
│   ├── MapComponent.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Client-side
│   │   └── server.ts     # Server-side
│   └── utils/            # Utility functions
│       ├── auth.ts       # Auth helpers
│       ├── calculations.ts # Business logic
│       └── validators.ts  # Zod schemas
├── types/
│   └── database.ts       # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
├── middleware.ts         # Auth middleware
└── README.md
```

## 🗄️ Database Schema

### Tables

- **admins**: Admin user profiles
- **motorbikes**: Motorbike inventory with GPS coordinates
- **customers**: Customer information
- **rentals**: Rental transactions
- **employees**: Employee records
- **payroll**: Payroll records

### Key Features

- UUID primary keys
- Automatic timestamps (created_at, updated_at)
- Row-level security (RLS) policies
- Foreign key constraints
- Indexed columns for performance
- Custom ENUM types for status fields

## 🔐 Security

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Admin-only access enforced by middleware
- **RLS Policies**: Database-level security
- **Input Validation**: Zod schemas on all forms
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Only**: Production deployment requires HTTPS

## 💼 Business Logic

### Rental Cost Calculation

```typescript
cost = (end_date - start_date + 1) × daily_rate
```

### Payroll Calculation

```typescript
total = base_amount + bonuses - deductions
```

### Late Return Penalty

```typescript
penalty = late_days × daily_rate × 1.5
```

## 🗺️ Map Integration

The system uses Leaflet for interactive mapping:

- **Green markers**: Available motorbikes
- **Orange markers**: Rented motorbikes
- **Red markers**: Motorbikes under maintenance

Coordinates are stored in the database and can be updated via the motorbike management interface.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📝 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Motorbikes
- `GET /api/motorbikes` - List all motorbikes
- `POST /api/motorbikes` - Create motorbike
- `GET /api/motorbikes/[id]` - Get motorbike
- `PUT /api/motorbikes/[id]` - Update motorbike
- `DELETE /api/motorbikes/[id]` - Delete motorbike

### Rentals
- `GET /api/rentals` - List all rentals
- `POST /api/rentals` - Create rental
- `GET /api/rentals/[id]` - Get rental
- `PUT /api/rentals/[id]` - Update rental
- `DELETE /api/rentals/[id]` - Delete rental

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee

### Payroll
- `GET /api/payroll` - List all payroll records
- `POST /api/payroll` - Create payroll record

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with admin credentials
- [ ] Create a new motorbike
- [ ] Create a new customer
- [ ] Create a rental
- [ ] View rental on dashboard
- [ ] Update rental status to completed
- [ ] Verify motorbike status changes to available
- [ ] Create employee
- [ ] Create payroll record
- [ ] View motorbikes on map
- [ ] Logout

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Invalid API key"
- **Solution**: Check your `.env.local` file has correct Supabase credentials

**Issue**: "User not authorized"
- **Solution**: Ensure admin record exists in `admins` table

**Issue**: Map not loading
- **Solution**: Check that motorbikes have valid latitude/longitude values

**Issue**: RLS policy errors
- **Solution**: Verify user is authenticated and policies are enabled

## 📚 Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Mapping**: Leaflet, React Leaflet
- **Validation**: Zod
- **Date Handling**: date-fns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact: admin@siargao-moto.com

## 🎯 Future Enhancements

- [ ] SMS notifications for rental reminders
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Automated backup system
- [ ] Customer portal
- [ ] Maintenance scheduling
- [ ] Insurance tracking
- [ ] Document upload (IDs, contracts)

---

Built with ❤️ for Siargao Island
