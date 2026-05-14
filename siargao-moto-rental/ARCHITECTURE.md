# 🏗️ System Architecture

## Overview

The Siargao Moto Rental Management System is built using a modern, scalable architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js App Router (React)               │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │Dashboard│ │Motorbikes│ │Rentals│ │ Map   │  ...   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Component Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Navbar │ Table │ Modal │ MapComponent │ ...         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                       │  │
│  │  /api/auth  /api/motorbikes  /api/rentals  ...       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Validators │ Calculations │ Auth Helpers            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Data Access Layer                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Supabase Client (Server/Client)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Supabase (PostgreSQL)                    │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │ Admins │ │Motorbikes│ │Rentals│ │Employees│ ...   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  │              + RLS Policies + Triggers               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. Client Layer (Frontend)

**Technology**: Next.js 14 App Router, React 18, TypeScript

**Responsibilities**:
- User interface rendering
- Client-side routing
- Form handling and validation
- State management
- User interactions

**Key Features**:
- Server-side rendering (SSR)
- Client-side navigation
- Responsive design with Tailwind CSS
- Real-time updates

### 2. Component Layer

**Technology**: React Components, TypeScript

**Responsibilities**:
- Reusable UI components
- Component composition
- Props validation
- Event handling

**Components**:
- `Navbar`: Navigation and logout
- `Table`: Data display with CRUD actions
- `Modal`: Form dialogs
- `MapComponent`: Leaflet map integration
- `LoadingSpinner`: Loading states

### 3. API Layer

**Technology**: Next.js API Routes

**Responsibilities**:
- HTTP request handling
- Request validation
- Response formatting
- Error handling
- Business logic orchestration

**Endpoints**:
- `/api/auth/*`: Authentication
- `/api/motorbikes/*`: Motorbike CRUD
- `/api/rentals/*`: Rental CRUD
- `/api/employees/*`: Employee CRUD
- `/api/payroll/*`: Payroll CRUD

### 4. Business Logic Layer

**Technology**: TypeScript utility functions

**Responsibilities**:
- Data validation (Zod schemas)
- Business calculations
- Authentication helpers
- Data transformations

**Modules**:
- `validators.ts`: Input validation schemas
- `calculations.ts`: Rental and payroll calculations
- `auth.ts`: Authentication utilities

### 5. Data Access Layer

**Technology**: Supabase JavaScript Client

**Responsibilities**:
- Database queries
- Real-time subscriptions
- Authentication
- File storage (future)

**Clients**:
- `client.ts`: Client-side operations
- `server.ts`: Server-side operations

### 6. Database Layer

**Technology**: Supabase (PostgreSQL)

**Responsibilities**:
- Data persistence
- Data integrity
- Access control (RLS)
- Automated timestamps

**Tables**:
- `admins`: Admin users
- `motorbikes`: Inventory
- `customers`: Customer records
- `rentals`: Rental transactions
- `employees`: Staff records
- `payroll`: Payroll records

## Data Flow

### Example: Creating a Rental

```
1. User fills rental form → Client Layer
2. Form submission → Component Layer (Modal)
3. API call → API Layer (/api/rentals POST)
4. Validation → Business Logic Layer (rentalSchema)
5. Calculation → Business Logic Layer (calculateRentalCost)
6. Database insert → Data Access Layer (Supabase Client)
7. RLS check → Database Layer (PostgreSQL)
8. Response → Back through layers
9. UI update → Client Layer
10. Motorbike status update → Separate API call
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials → Login page
2. Supabase Auth validates → auth.signInWithPassword()
3. Session created → JWT token stored in cookie
4. Middleware checks session → On every request
5. RLS policies enforce access → Database level
```

### Security Layers

1. **Client-side**: Form validation, input sanitization
2. **Middleware**: Route protection, session validation
3. **API Routes**: Request validation, authorization checks
4. **Database**: RLS policies, foreign key constraints

## Scalability Considerations

### Current Architecture
- **Vertical scaling**: Increase server resources
- **Horizontal scaling**: Deploy multiple instances
- **Database**: Supabase handles scaling automatically

### Future Enhancements
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery
- **Load balancing**: Multiple app instances
- **Database replicas**: Read replicas for queries
- **Message queue**: Background job processing

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet, React Leaflet
- **Date Handling**: date-fns
- **Validation**: Zod

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **ORM**: Supabase Client (query builder)

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **SSL**: Automatic (Vercel/Supabase)

## Design Patterns

### 1. Repository Pattern
- Data access abstracted through Supabase client
- Consistent query interface

### 2. Middleware Pattern
- Authentication middleware
- Request/response processing

### 3. Component Composition
- Reusable UI components
- Props-based configuration

### 4. API Route Handlers
- RESTful endpoints
- Consistent error handling

### 5. Server/Client Separation
- Server components for data fetching
- Client components for interactivity

## Performance Optimizations

### Current
- Server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- Database indexing
- Efficient queries with joins

### Future
- React Server Components
- Incremental Static Regeneration (ISR)
- Edge functions
- Database query optimization
- Lazy loading for heavy components

## Monitoring and Logging

### Current
- Browser console errors
- Supabase dashboard logs
- Vercel deployment logs

### Recommended
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase metrics)
- User analytics (Plausible/Umami)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel Edge                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CDN + Edge Functions                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Serverless Functions (API Routes)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL + Auth + Storage + Realtime              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Development Workflow

```
1. Local Development
   ├── npm run dev (Next.js dev server)
   ├── Supabase local instance (optional)
   └── Hot reload enabled

2. Version Control
   ├── Git commits
   ├── Feature branches
   └── Pull requests

3. Deployment
   ├── Push to main branch
   ├── Vercel auto-deploy
   └── Environment variables configured

4. Database Changes
   ├── Write migration SQL
   ├── Test locally
   ├── Apply to production
   └── Version control migrations
```

## Best Practices Implemented

1. **Type Safety**: TypeScript throughout
2. **Validation**: Zod schemas for all inputs
3. **Security**: RLS policies, middleware protection
4. **Code Organization**: Clear folder structure
5. **Reusability**: Shared components and utilities
6. **Error Handling**: Try-catch blocks, user feedback
7. **Documentation**: Inline comments, README files
8. **Environment Management**: .env files, no hardcoded secrets

---

This architecture provides a solid foundation for a production-ready rental management system with room for future growth and enhancements.
