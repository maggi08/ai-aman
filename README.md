# Meeting Room Booking System

A modern web application for managing meeting room reservations with role-based access control. Built with Nuxt 4, Supabase, and Prisma.

## Features

### For Employees
- View all available meeting rooms
- Calendar view of room availability
- Book rooms for up to 2 hours
- Automatic conflict detection (prevents double-booking)
- View and manage their own bookings
- Cancel future bookings

### For Managers
- All employee features plus:
- Create and manage meeting rooms
- Set room capacity
- View all bookings in the system
- Cancel any booking
- Real-time booking updates

### Technical Features
- Email/password authentication via Supabase
- Role-based access control (RBAC)
- Real-time updates with Supabase Realtime
- JWT-based authorization
- Row-level security (RLS) policies
- Calendar view with hourly slots (9 AM - 6 PM)
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Nuxt 4, Vue 3, TypeScript
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Real-time:** Supabase Realtime

## Setup

### Prerequisites
- Node.js 18+
- Supabase project
- PostgreSQL database

### 1. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

Get these values from your Supabase project settings.

### 3. Database Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions on:
- Creating tables
- Setting up RLS policies
- Enabling real-time features
- Configuring authentication

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── pages/
│   ├── login.vue          # Login page
│   ├── register.vue       # Registration page
│   └── dashboard.vue      # Main dashboard with calendar
├── server/
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── index.get.ts   # List bookings
│   │   │   ├── index.post.ts  # Create booking
│   │   │   └── [id].delete.ts # Delete booking
│   │   └── rooms/
│   │       ├── index.get.ts   # List rooms
│   │       ├── index.post.ts  # Create room
│   │       ├── [id].get.ts    # Get room details
│   │       ├── [id].patch.ts  # Update room
│   │       └── [id].delete.ts # Delete room
│   └── utils/
│       └── auth.ts            # JWT decoding and role verification
├── composables/
│   ├── useAuth.ts        # Authentication composable
│   ├── useRooms.ts       # Rooms management composable
│   └── useBookings.ts    # Bookings management composable
├── app.vue               # Root app component
└── nuxt.config.ts        # Nuxt configuration
```

## API Endpoints

### Authentication
- **POST** `/auth/signup` - Register new user
- **POST** `/auth/signin` - Login user

### Rooms
- **GET** `/api/rooms` - List all rooms
- **POST** `/api/rooms` - Create room (manager only)
- **GET** `/api/rooms/[id]` - Get room details
- **PATCH** `/api/rooms/[id]` - Update room (manager only)
- **DELETE** `/api/rooms/[id]` - Delete room (manager only)

### Bookings
- **GET** `/api/bookings` - List bookings (employees see own, managers see all)
- **POST** `/api/bookings` - Create booking
- **DELETE** `/api/bookings/[id]` - Delete booking

## Validation Rules

### Booking Duration
- Maximum 2 hours per booking
- Prevents overlapping bookings
- Employees can only cancel future bookings

### Room Management
- Managers can create, update, and delete rooms
- Deleting a room cascades delete to all associated bookings

## Security

### JWT-based Authorization
- All API endpoints validate JWT tokens
- Roles extracted from user metadata
- Server-side role verification prevents unauthorized access

### Row-Level Security (RLS)
- Database-level policies enforce access control
- Employees can only access their own bookings
- Managers have unrestricted access

### Password Security
- Passwords handled by Supabase Auth
- Minimum 6 characters required

## Real-time Updates

The dashboard subscribes to real-time updates using Supabase channels:
- When a booking is created, all connected clients see the update instantly
- No page refresh required
- Updates for bookings in the current selected room

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy
```

### File-based Routing

All server routes use file-based routing:
- `api/bookings/index.post.ts` → POST /api/bookings
- `api/rooms/[id].get.ts` → GET /api/rooms/:id
- `api/rooms/[id].patch.ts` → PATCH /api/rooms/:id

### Composables

Custom composables are automatically imported in Vue components:
- `useAuth()` - Authentication state and methods
- `useRooms()` - Room management
- `useBookings()` - Booking management

## Testing Security

### Test Double-booking Prevention
1. Login as employee 1
2. Book Room A from 10:00 to 11:00
3. Login as employee 2
4. Try to book Room A from 10:30 to 11:30
5. Should get error: "Room is already booked for this time period"

### Test Role-based Access
1. Employee tries to delete another user's booking → 403 Forbidden
2. Employee tries to delete past booking → 403 Forbidden
3. Manager can delete any booking → Success

### Test Maximum Duration
1. Try to book room for 3 hours
2. Should get error: "Booking duration cannot exceed 2 hours"

## Troubleshooting

### "User not authorized" error
- Check Supabase authentication is working
- Verify JWT token is being sent with requests
- Check RLS policies in Supabase

### Bookings not appearing
- Ensure user role is set in user_metadata during signup
- Check RLS policies for your user role
- Verify database queries in Supabase

### Real-time not working
- Check realtime is enabled for bookings table
- Browser console should show subscription messages
- Check WebSocket connection in Network tab

## Deployment

See [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment) for deployment options.

Key requirements:
- Environment variables set on hosting platform
- DATABASE_URL for Prisma
- NUXT_PUBLIC_SUPABASE_* for frontend

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under MIT.
