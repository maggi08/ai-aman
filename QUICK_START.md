# Quick Start Guide

Get the Meeting Room Booking System up and running in 5 minutes.

## Prerequisites

- Node.js 18+
- Supabase account (https://supabase.com)
- Git

## Step 1: Clone and Install (1 min)

```bash
# Install dependencies
npm install

# or
yarn install
```

## Step 2: Create Supabase Project (1 min)

1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key from Settings → API

## Step 3: Setup Database (2 min)

1. In Supabase, go to SQL Editor
2. Copy and paste the entire SQL from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Section "Create Tables"
3. Run the SQL
4. Copy and paste the RLS policies SQL - Section "Create RLS Policies"
5. Run the SQL
6. Go to Realtime section and enable the `bookings` table

## Step 4: Configure Environment (1 min)

Create `.env.local` in the project root:

```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

Get these from:
- Supabase Dashboard → Settings → API (first two values)
- Supabase Dashboard → Settings → Database → Connection String (DATABASE_URL)

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Application is now running at `http://localhost:3000`

## Default Test Users

Create these users via the registration page:

### Employee Test Account
- Email: `employee@test.com`
- Password: `test123`
- Role: Employee

### Manager Test Account
- Email: `manager@test.com`
- Password: `test123`
- Role: Manager

## Quick Test

### As Manager
1. Login as manager
2. Go to "Manage Rooms" section
3. Create a test room: "Meeting Room A", Capacity: 10
4. See room in calendar

### As Employee
1. Login as employee
2. See "Meeting Room A" in calendar
3. Click "Book" on any time slot
4. Enter start and end time (max 2 hours)
5. Click "Book"
6. See booking in "My Bookings" section

### Test Real-time
1. Open dashboard in two browser windows
2. Login as different users
3. One user creates booking
4. Other user's dashboard updates instantly (no refresh)

## Common Issues

### "User not authorized" error
```
→ Check if RLS policies are enabled
→ Verify user metadata includes role during signup
```

### Database connection error
```
→ Check DATABASE_URL is correct
→ Verify Supabase project is accessible
→ Check firewall/network settings
```

### Bookings not appearing
```
→ Ensure RLS policies are applied
→ Check user role in Supabase auth users table
→ Verify SQL from SUPABASE_SETUP.md was executed
```

### Real-time not working
```
→ Ensure Realtime is enabled for bookings table
→ Check browser console for WebSocket errors
→ Verify subscription is active in Network tab
```

## Project Structure

```
app/
├── pages/          # UI pages (login, register, dashboard)
├── server/
│   ├── api/        # REST API endpoints
│   └── utils/      # Server utilities (JWT, auth)
└── composables/    # Vue composables (useAuth, useRooms, useBookings)
```

## Important Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SUPABASE_SETUP.md` | Database setup and RLS |
| `API_DOCUMENTATION.md` | API endpoint reference |
| `COMPOSABLES.md` | Composable usage guide |
| `nuxt.config.ts` | Nuxt configuration |
| `prisma/schema.prisma` | Database schema |

## Key Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Deploy
npm run build           # Build for production
npm run preview         # Preview production build

# Database
npx prisma generate    # Generate Prisma client
npx prisma migrate deploy  # Run migrations

# Validation
npm run lint            # (if configured)
```

## Feature Overview

### For Everyone
- Register with email/password
- Choose role (employee or manager)
- Login securely

### For Employees
- View all meeting rooms
- See room availability (calendar view)
- Book rooms for up to 2 hours
- Cancel own future bookings
- View personal bookings

### For Managers
- All employee features
- Create/edit/delete rooms
- View all bookings
- Cancel any booking
- Set room capacity

## Next Steps

1. **Development**
   - Read full [README.md](./README.md)
   - Explore [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - Review composables in [COMPOSABLES.md](./COMPOSABLES.md)

2. **Testing**
   - Create test users
   - Test all features
   - Try security scenarios from README.md

3. **Customization**
   - Modify UI in `app/pages/`
   - Add features to composables
   - Extend API endpoints

4. **Deployment**
   - Build with `npm run build`
   - Set environment variables
   - Deploy to your platform

## Troubleshooting

### Still having issues?

1. Check [README.md Troubleshooting](./README.md#troubleshooting)
2. Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Check browser console for errors
4. Check Supabase logs for database issues
5. Verify all environment variables are set

## Support

For detailed information, see:
- Security: README.md → Security section
- API: API_DOCUMENTATION.md
- Database: SUPABASE_SETUP.md
- Code: COMPOSABLES.md

## Summary

You now have a fully functional Meeting Room Booking System with:
- ✅ User authentication
- ✅ Role-based access control
- ✅ Real-time updates
- ✅ Calendar view
- ✅ Booking validation
- ✅ Complete security

Happy booking! 🎉
