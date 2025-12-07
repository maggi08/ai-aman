# Project File Structure

## Complete Application Structure

```
ab.ai/
├── app/
│   ├── components/
│   │   └── AppHeader.vue              ✨ NEW - Main navigation component
│   │
│   ├── composables/
│   │   ├── useAuth.ts                 - User authentication & role
│   │   ├── useBookings.ts             - Booking CRUD & real-time
│   │   └── useRooms.ts                - Room CRUD operations
│   │
│   ├── layouts/
│   │   └── default.vue                ✨ NEW - Page wrapper with header
│   │
│   ├── pages/
│   │   ├── index.vue                  - Redirect page
│   │   ├── login.vue                  - Authentication
│   │   ├── register.vue               - User registration
│   │   ├── bookings.vue               ✨ REFACTORED - Calendar & bookings
│   │   └── rooms.vue                  ✨ NEW - Room management
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── bookings/
│   │   │   │   ├── index.get.ts       - Get user's bookings
│   │   │   │   ├── index.post.ts      - Create booking
│   │   │   │   └── [id].delete.ts     - Delete booking
│   │   │   └── rooms/
│   │   │       ├── index.get.ts       - Get all rooms
│   │   │       ├── index.post.ts      - Create room (manager)
│   │   │       ├── [id].get.ts        - Get room details
│   │   │       ├── [id].patch.ts      - Update room (manager)
│   │   │       └── [id].delete.ts     - Delete room (manager)
│   │   │
│   │   └── utils/
│   │       └── auth.ts                - JWT verification & role checking
│   │
│   └── app.vue                        - Root Vue component
│
├── prisma/
│   ├── schema.prisma                  - Database schema (Room, Booking)
│   └── migrations/                    - Database migration files
│
├── prisma.config.ts                   - Prisma 7 configuration
│
├── Documentation/
│   ├── NAVIGATION_GUIDE.md             ✨ NEW - Navigation system guide
│   ├── HEADER_IMPLEMENTATION_SUMMARY.md ✨ NEW - Header implementation details
│   ├── FILE_STRUCTURE.md               ✨ NEW - This file
│   ├── API_DOCUMENTATION.md            - API endpoints reference
│   ├── COMPOSABLES.md                  - Frontend composables guide
│   ├── IMPLEMENTATION_SUMMARY.md        - Overall project summary
│   ├── QUICK_START.md                  - 5-minute setup guide
│   ├── SUPABASE_SETUP.md               - Database & RLS setup
│   ├── README.md                       - Project overview
│   └── DOCUMENTATION_INDEX.md          - Documentation navigation
│
├── package.json                       - Dependencies (Nuxt 4, Supabase, etc.)
├── nuxt.config.ts                     - Nuxt configuration
├── tsconfig.json                      - TypeScript configuration
└── .env.local                         - Environment variables
```

## New Files Created (This Session)

### Components
- **AppHeader.vue** (249 lines)
  - Navigation header with logo, menu, and user dropdown
  - Sticky positioning at top of all pages
  - Role-based link visibility
  - Dropdown menu for user profile and logout

### Layouts
- **default.vue** (35 lines)
  - Wraps all pages with AppHeader
  - Provides consistent styling and spacing

### Pages (Refactored)
- **bookings.vue** (748 lines)
  - Renamed from `dashboard.vue`
  - Google Calendar-style booking view
  - Removed embedded header (now in layout)
  - Removed room management (now in separate /rooms page)
  - Cleaner, focused on booking functionality only

- **rooms.vue** (412 lines)
  - NEW: Dedicated room management page
  - Create new rooms (name, capacity)
  - Delete existing rooms
  - View room details and active bookings
  - Manager-only access with fallback UI for non-managers

### Documentation
- **NAVIGATION_GUIDE.md** - How the navigation system works
- **HEADER_IMPLEMENTATION_SUMMARY.md** - Header design and features
- **FILE_STRUCTURE.md** - This file

## Pages & Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | index.vue | Public | Redirect helper page |
| `/login` | login.vue | Public | Email/password login |
| `/register` | register.vue | Public | User registration with role selection |
| `/bookings` | bookings.vue | Authenticated | Calendar view & booking management (default) |
| `/rooms` | rooms.vue | Manager Only | Room creation and management |

## Component Hierarchy

```
App.vue (root)
├── NuxtLayout (default layout)
│   ├── AppHeader (navigation)
│   │   ├── Logo section
│   │   ├── Navigation menu
│   │   │   ├── Bookings link
│   │   │   └── Rooms link (conditional)
│   │   └── User menu dropdown
│   │       ├── User info
│   │       └── Logout button
│   └── NuxtPage (page content)
│       ├── Login page
│       ├── Register page
│       ├── Bookings page
│       │   ├── Calendar grid
│       │   ├── Booking form modal
│       │   └── Summary cards
│       └── Rooms page
│           ├── Create room form
│           └── Rooms grid with cards
```

## API Endpoints

### Bookings
- `GET /api/bookings` - Get user's bookings (employees) or all (managers)
- `POST /api/bookings` - Create booking (requires auth)
- `DELETE /api/bookings/[id]` - Delete booking (own or manager)

### Rooms
- `GET /api/rooms` - Get all rooms (public)
- `GET /api/rooms/[id]` - Get room details
- `POST /api/rooms` - Create room (manager only)
- `PATCH /api/rooms/[id]` - Update room (manager only)
- `DELETE /api/rooms/[id]` - Delete room (manager only)

## Database Models

### Room
```prisma
- id: String (UUID, primary key)
- name: String
- capacity: Int
- createdAt: DateTime
- updatedAt: DateTime
- bookings: Booking[] (relation)
```

### Booking
```prisma
- id: String (UUID, primary key)
- roomId: String (foreign key)
- userId: String
- startTime: DateTime
- endTime: DateTime
- createdAt: DateTime
- updatedAt: DateTime
- room: Room (relation)
```

## Composables

### useAuth()
```typescript
- user: readonly ref (current user)
- userRole: readonly computed ('manager' | 'employee')
- isManager: readonly computed boolean
- isEmployee: readonly computed boolean
- isAuthenticated: readonly computed boolean
- login(email, password): Promise
- register(email, password, role): Promise
- logout(): Promise
- loadUserRole(): Promise
```

### useRooms()
```typescript
- rooms: readonly ref (array of Room)
- loading: readonly ref boolean
- error: readonly ref (string | null)
- getRooms(): Promise
- getRoom(id): Promise
- createRoom(name, capacity): Promise
- updateRoom(id, data): Promise
- deleteRoom(id): Promise
```

### useBookings()
```typescript
- bookings: readonly ref (array of Booking)
- loading: readonly ref boolean
- error: readonly ref (string | null)
- getBookings(): Promise
- createBooking(roomId, startTime, endTime): Promise
- deleteBooking(id): Promise
- subscribeToBookings(roomId?): Function (unsubscribe)
```

## Styling Architecture

### Colors
```
Primary: #667eea (purple)
Secondary: #764ba2 (darker purple)
Success: #2e7d32 (green)
Error: #d32f2f (red)
Warning: #4ecdc4 (teal)
Background: #f5f5f5 (light gray)
```

### Component Styling
- All components use scoped styles
- Responsive design with mobile-first approach
- Consistent padding, margins, and spacing
- Smooth transitions and hover effects

## Configuration Files

### package.json
- Nuxt 4
- Vue 3
- @nuxtjs/supabase
- Prisma
- TypeScript
- TailwindCSS (optional)

### nuxt.config.ts
- Supabase module setup
- Auto-import composables
- Auto-import components
- Auto-import utilities

### tsconfig.json
- TypeScript strict mode
- Path aliases (@/)
- Vue 3 support

### prisma.config.ts
- Datasource configuration
- DATABASE_URL from environment
- Schema path: prisma/schema.prisma

### .env.local
Required environment variables:
```
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgresql://connection_string
```

## Code Organization Principles

1. **Component-based** - Reusable components for navigation
2. **Page-based** - File-based routing with Nuxt
3. **Composables** - Shared logic via composition API
4. **API Routes** - Server-side business logic
5. **Database-first** - Prisma for data management
6. **Type-safe** - Full TypeScript support

## Recent Changes Summary

### Before
- Single dashboard.vue with everything
- Header included in each page
- Room management mixed with bookings
- No dedicated navigation

### After
- Separate pages for bookings and rooms
- Shared header layout component
- Clean separation of concerns
- Professional navigation system
- Better code organization
- Easier to maintain and extend

## Next Possible Enhancements

1. **Search & Filter**
   - Search rooms by name/capacity
   - Filter bookings by date range
   - Filter by room

2. **Advanced Features**
   - Recurring bookings
   - Booking reminders
   - Email notifications
   - Export calendar

3. **Analytics**
   - Room usage statistics
   - Booking trends
   - Peak hours analysis

4. **Settings**
   - User preferences
   - Notification settings
   - Theme selection

5. **Mobile App**
   - Native iOS/Android apps
   - Offline support
   - Push notifications
