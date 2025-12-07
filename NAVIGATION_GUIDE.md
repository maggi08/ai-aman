# Navigation Guide

## Header Navigation Structure

The application now has a professional header with navigation and user menu at the top of every page.

### Header Components

**AppHeader.vue** (`app/components/AppHeader.vue`)
- Logo/Brand: "Meeting Room Booking"
- Navigation Menu:
  - 📅 Bookings (default, `/bookings`)
  - 🏢 Rooms (manager only, `/rooms`)
- User Menu (dropdown):
  - Shows current user email
  - Shows user role badge (Manager/Employee)
  - Logout button

### Layout

**Default Layout** (`app/layouts/default.vue`)
- Wraps all pages with AppHeader
- Provides consistent styling and spacing
- Auto-applied to all pages

## Pages

### 1. Login Page (`/login`)
- Email/password authentication
- Auto-redirect to `/bookings` if already logged in
- Register link to sign up

### 2. Register Page (`/register`)
- Create new account with email/password
- Select role: Manager or Employee
- Password validation
- Auto-login after registration

### 3. Bookings Page (`/bookings`) - Default
- **Google Calendar-Style View**
  - Hourly grid (9 AM - 6 PM)
  - Room columns showing bookings
  - Click any slot to create a booking
  - Modal form for booking details

- **Features:**
  - View all rooms and their availability
  - Create new bookings (max 2 hours)
  - Delete own future bookings (employees)
  - View booking list in summary cards
  - Manager can cancel any booking

- **Real-Time Updates:**
  - Bookings update automatically when others make changes
  - Calendar refreshes in real-time

- **Manager Only:**
  - "All Bookings" summary card showing all bookings
  - Can cancel any booking

### 4. Rooms Page (`/rooms`) - Manager Only
- **Room Management Panel**
  - Form to create new rooms
  - Enter room name and capacity
  - Error/success messages

- **Rooms Grid**
  - Card-based layout showing all rooms
  - Each room shows:
    - Room name
    - Capacity
    - Creation date
    - Active bookings count
    - Quick link to view bookings
    - Delete button

- **Access Control:**
  - Non-managers see "Access Denied" message
  - Managers can see full room management interface

## Navigation Flow

```
┌─────────────────────────────────────────────┐
│         Header with Navigation              │
│  Logo | Bookings | Rooms | User Dropdown    │
└─────────────────────────────────────────────┘
         │             │              │
         ▼             ▼              ▼
    Bookings        Rooms        User Menu
    (Public)      (Manager)    - Logout
    - Calendar    - Room List
    - Bookings    - Create Room
    - Summary     - Delete Room
```

## User Experience

### For Employees
1. Login with credentials
2. Redirected to `/bookings` page
3. Can see calendar view of all rooms
4. Can create bookings (max 2 hours)
5. Can view and delete own future bookings
6. Navigation shows only "Bookings" link

### For Managers
1. Login with credentials
2. Redirected to `/bookings` page
3. Can see calendar view of all rooms
4. Can create bookings
5. Can cancel ANY booking
6. Can access `/rooms` page from header
7. Can create/delete rooms
8. Can see all bookings count on rooms

## Active/Selected Link Styling

The navigation links show active state:
- Active link has slightly lighter background
- Active link has bottom border

## Responsive Design

- Header adjusts for mobile (smaller fonts, condensed layout)
- Navigation links stack nicely on small screens
- User menu dropdown positions correctly on all screen sizes
- All pages are fully responsive

## Technical Details

### Components Used
- `AppHeader.vue` - Main navigation component
- `default.vue` - Default layout wrapper

### Composables
- `useAuth()` - User authentication and role info
- `useRooms()` - Room management
- `useBookings()` - Booking management

### Routes
- `/login` - Authentication page
- `/register` - Registration page
- `/bookings` - Calendar and booking management
- `/rooms` - Room management (manager only)

## Key Features

1. **Sticky Header** - Always visible at top while scrolling
2. **Dropdown Menu** - Click outside to close
3. **Role-Based Access** - Rooms link only shows for managers
4. **Active Route Indicator** - Shows which page you're on
5. **User Info Display** - Shows email and role in dropdown
6. **One-Click Logout** - Logout from any page via header menu
