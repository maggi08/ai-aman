# Quick Reference Guide

## 🎯 What Was Built

A professional navigation system with:
- **Fixed header** on every page
- **Navigation links**: Bookings (default) & Rooms (manager only)
- **User dropdown menu** with logout
- **Responsive design** for mobile/tablet/desktop

## 📍 Pages Overview

```
┌─────────────────────────────────────────────────┐
│ Logo | Nav | User Dropdown                      │  ← AppHeader.vue
├─────────────────────────────────────────────────┤
│                                                 │
│         Page Content (bookings.vue)            │  ← Bookings page
│         or (rooms.vue)                         │     or Rooms page
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🗺️ Navigation Map

**Employees:**
```
Login → Bookings (calendar) → View/Create Bookings
                           → Logout from header
```

**Managers:**
```
Login → Bookings (calendar) → View/Create/Cancel Any Booking
             ↓                 → Logout from header
          Rooms → Create/Delete Rooms
                → View Room Stats
```

## 🎨 Header Components

### AppHeader.vue
- Logo: "Meeting Room Booking"
- Nav Links:
  - 📅 Bookings (always visible)
  - 🏢 Rooms (manager only)
- User Menu:
  - Email display
  - Role badge
  - Logout button

### default.vue Layout
- Wraps AppHeader
- Wraps page content
- Provides consistent styling

## 📄 Key Pages

### /bookings
- Google Calendar grid (9 AM - 6 PM)
- Click any slot to create booking
- Modal booking form
- Summary cards (my bookings, all bookings)
- Real-time updates
- Manager can cancel any booking

### /rooms
- Manager-only access
- Create rooms (name, capacity)
- Delete rooms
- View room details:
  - Capacity
  - Creation date
  - Active bookings count
  - Link to view bookings

### /login & /register
- Email/password authentication
- Role selection (employee/manager)
- Auto-redirect to /bookings on success

## 🔐 Access Control

| Feature | Employee | Manager |
|---------|----------|---------|
| View bookings calendar | ✅ | ✅ |
| Create booking | ✅ | ✅ |
| Delete own booking | ✅ | ✅ |
| Delete future booking only | ✅ | - |
| View all bookings | - | ✅ |
| Cancel any booking | - | ✅ |
| Create room | - | ✅ |
| Delete room | - | ✅ |
| Access /rooms page | - | ✅ |

## 🚀 How It Works

1. **User logs in** → Auto-redirected to /bookings
2. **Header always visible** → Click links to navigate
3. **Bookings page** → See calendar, create/delete bookings
4. **Managers click Rooms** → See room management interface
5. **Click user dropdown** → See profile info and logout
6. **Click logout** → Clear session, go to login page

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Compact header, single column layout
- **Tablet** (768px - 1024px): Two column layouts
- **Desktop** (> 1024px): Full multi-column layouts

## 💾 Files Summary

**Created/Modified:**
- ✨ `app/components/AppHeader.vue` - Navigation header
- ✨ `app/layouts/default.vue` - Page wrapper
- ✨ `app/pages/bookings.vue` - Refactored (was dashboard.vue)
- ✨ `app/pages/rooms.vue` - Room management page
- 📖 `NAVIGATION_GUIDE.md` - Navigation documentation
- 📖 `HEADER_IMPLEMENTATION_SUMMARY.md` - Header details
- 📖 `FILE_STRUCTURE.md` - Complete file structure
- 📖 `QUICK_REFERENCE.md` - This file

## 🎯 Next Steps

1. **Test the navigation:**
   ```bash
   npm run dev
   ```
   - Login with test account
   - Check header appears on all pages
   - Test navigation links
   - Test user dropdown

2. **Test manager features:**
   - Login as manager
   - Verify Rooms link visible
   - Create/delete a room
   - View room stats

3. **Test employee features:**
   - Login as employee
   - Verify Rooms link NOT visible
   - Create a booking
   - Delete your own booking

4. **Test responsiveness:**
   - Open on mobile device
   - Test on tablet
   - Verify header responsive

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Header not showing | Check layout applied in app.vue |
| Links not working | Verify pages exist in /pages directory |
| Dropdown not opening | Check useAuth() is imported |
| Can't create room | Verify you're logged in as manager |
| Rooms link not showing | Check user role is 'manager' |

## 📚 Documentation Files

Read in this order:
1. **QUICK_REFERENCE.md** (this file) - Overview
2. **NAVIGATION_GUIDE.md** - How navigation works
3. **HEADER_IMPLEMENTATION_SUMMARY.md** - Design & features
4. **FILE_STRUCTURE.md** - Complete file organization

## 🔗 Important Code Locations

| Item | Location |
|------|----------|
| Navigation component | `app/components/AppHeader.vue` |
| Layout wrapper | `app/layouts/default.vue` |
| Bookings page | `app/pages/bookings.vue` |
| Rooms page | `app/pages/rooms.vue` |
| Auth composable | `app/composables/useAuth.ts` |
| Rooms composable | `app/composables/useRooms.ts` |
| Bookings composable | `app/composables/useBookings.ts` |

## ✨ Key Features

✅ Sticky header that stays visible while scrolling
✅ Active route indicator on navigation links
✅ Dropdown menu with smooth animations
✅ Role-based link visibility
✅ Mobile responsive design
✅ Professional gradient styling
✅ Click-outside dropdown close
✅ Auto-logout functionality
✅ Real-time booking updates
✅ Google Calendar-style view
✅ Room management for managers
✅ Access control enforcement

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check browser console for errors
4. Verify environment variables are set
5. Check Supabase connection

---

**Status:** ✅ Navigation system complete and ready to use!
