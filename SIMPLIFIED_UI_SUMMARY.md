# Simplified UI - List View Implementation

## Overview

The application has been simplified from the Google Calendar grid view to a clean, simple list-based interface with pagination. Both Bookings and Rooms pages now feature consistent CRUD operations through modal dialogs.

---

## What Changed

### Before (Calendar View)
- Google Calendar-style grid layout
- Hourly time slots
- Click-to-create from calendar slots
- Complex visual layout

### After (List View)
- Simple list-based interface
- Clean item cards with details
- Create/Edit/Delete via modals
- Easy-to-understand pagination
- Responsive design

---

## Pages Overview

### 📅 Bookings Page (`/bookings`)

**Visible to:** Employees and Managers

**Features:**

1. **Search & Filter**
   - Search by room name or user ID
   - Managers can filter between "All Bookings" and "My Bookings"
   - Employees only see their own bookings

2. **Bookings List**
   - Room name with ID
   - Start and end times
   - Duration calculation
   - For managers: shows "Booked by" (user ID)
   - Edit and Delete buttons (with restrictions)

3. **CRUD Operations (Modal-based)**
   - **Create:** Click "+ Create Booking" button
     - Select room from dropdown
     - Choose start time (datetime-local input)
     - Choose end time (datetime-local input)
     - Validation: max 2 hours, no overlaps

   - **Edit:** Click "✏️ Edit" button
     - Modify room, start time, or end time
     - Only available for future bookings
     - Disabled for past bookings

   - **Delete:** Click "🗑️ Delete" button
     - Confirmation dialog
     - Employees: can only delete own future bookings
     - Managers: can delete any booking

4. **Pagination**
   - 10 items per page
   - Previous/Next buttons
   - Shows current page and total pages

---

### 🏢 Rooms Page (`/rooms`)

**Visible to:** Managers only
**Non-managers:** See "Access Denied" message with link back to bookings

**Features:**

1. **Search & Filter**
   - Search by room name
   - Filters results in real-time

2. **Rooms List**
   - Room name with ID
   - Capacity (number of people)
   - Created date
   - Active bookings count (badge)
   - Edit and Delete buttons

3. **CRUD Operations (Modal-based)**
   - **Create:** Click "+ Create Room" button
     - Enter room name
     - Enter capacity (must be > 0)
     - Success/error messages

   - **Edit:** Click "✏️ Edit" button
     - Modify room name or capacity
     - Validation: capacity must be > 0

   - **Delete:** Click "🗑️ Delete" button
     - Confirmation dialog
     - Deletes room and all associated bookings (cascade delete)

4. **Pagination**
   - 10 items per page
   - Previous/Next buttons
   - Shows current page and total pages

---

## Role-Based Access Control

### Employee View
```
✅ See Bookings page
✅ Create bookings
✅ See only their own bookings
✅ Edit own future bookings
✅ Delete own future bookings
✗ Cannot see Rooms page
✗ Cannot create/edit/delete rooms
✗ Cannot see other users' bookings
```

### Manager View
```
✅ See Bookings page
✅ See all bookings
✅ Filter between "All Bookings" and "My Bookings"
✅ Create bookings
✅ Edit any booking
✅ Delete any booking
✅ See Rooms page
✅ Create rooms
✅ Edit rooms
✅ Delete rooms
✅ See active booking counts per room
```

---

## Modal Dialog Structure

### Booking Modal
```
[Header] Create Booking / Edit Booking
[Body]
  - Room selection dropdown
  - Start time input (datetime-local)
  - End time input (datetime-local)
  - Error/success messages
[Footer]
  - Create/Update button
  - Cancel button
```

### Room Modal
```
[Header] Create Room / Edit Room
[Body]
  - Room name input
  - Capacity input (number, min 1)
  - Error/success messages
[Footer]
  - Create/Update button
  - Cancel button
```

---

## List Item Design

### Booking Item
```
┌────────────────────────────────────────────────────┐
│                                                    │
│ [Conference Room A]  ID: 1a2b3c4d                │ ← Header
│ Start: Dec 15, 02:00  PM                         │
│ End: Dec 15, 03:00    PM                         │
│ Duration: 1h 0m                                   │
│ Booked by: user123    (manager only)             │ ← Details
│                                                    │
│ [✏️ Edit] [🗑️ Delete]                              │ ← Actions
└────────────────────────────────────────────────────┘
```

### Room Item
```
┌────────────────────────────────────────────────────┐
│                                                    │
│ [Conference Room A]  ID: 1a2b3c4d                │ ← Header
│ Capacity: 👥 10 people                           │
│ Created: Dec 7, 2024                             │
│ Active Bookings: [5]                             │ ← Details
│                                                    │
│ [✏️ Edit] [🗑️ Delete]                              │ ← Actions
└────────────────────────────────────────────────────┘
```

---

## Styling Details

### Colors
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (dark purple)
- Success: `#2e7d32` (green)
- Error: `#d32f2f` (red)
- Background: `#f5f5f5` (light gray)
- Text: `#333333` (dark gray)

### Components
- **Buttons:** 10px padding, 6px border-radius, 0.2s transitions
- **Inputs:** Full width, 10px padding, focus state with shadow
- **Cards:** White background, box shadow, border radius
- **Modals:** Fixed overlay, 90% width, max 500px, centered

### Responsive
- Mobile (< 768px): Stack layouts, full-width buttons
- Tablet/Desktop: Multi-column layouts with proper spacing

---

## Data Flow

### Create Booking
```
User → Click "+ Create Booking"
     → Modal opens
     → Select room, enter times
     → Click "Create"
     → API validation (duration, overlaps)
     → Success → Modal closes
     → List refreshes
     → Real-time sync to other users
```

### Edit Booking
```
User → Click "✏️ Edit" button
     → Modal opens with current data
     → Modify fields
     → Click "Update"
     → API validation
     → Success → Modal closes
     → List updates
     → Real-time sync
```

### Delete Booking
```
User → Click "🗑️ Delete" button
     → Confirmation dialog
     → Confirm deletion
     → API call
     → Success → Item removed from list
     → Real-time sync
```

---

## Pagination Logic

- **Items per page:** 10
- **Total pages:** Calculated based on filtered results
- **Current page:** Stored in `currentPage` ref
- **Disabled states:**
  - "Previous" button disabled on page 1
  - "Next" button disabled on last page

---

## Search & Filter Logic

### Bookings
```
1. If employee: Filter to only user's bookings
2. If manager + "My Bookings" selected: Filter to user's bookings
3. If manager + "All Bookings" selected: Show all bookings
4. Search query: Match against room name and user ID
```

### Rooms
```
1. Search query: Match against room name
2. Apply pagination to filtered results
```

---

## Validation

### Booking Validation
- All fields required (room, start time, end time)
- End time must be after start time
- Duration must be ≤ 2 hours (enforced by API)
- No overlapping bookings (enforced by API)

### Room Validation
- Name is required
- Capacity is required
- Capacity must be > 0
- Unique room names (handled by API if needed)

---

## Real-Time Updates

Both pages support real-time updates via Supabase subscriptions:
- When another user creates a booking → List updates automatically
- When another user deletes a booking → Item removed from list
- When another user creates a room → List updates
- When another user deletes a room → Item removed from list

---

## Button States

### Enabled/Disabled Logic

**Booking Edit Button:**
- Disabled if: Booking is in the past (for employees)
- Disabled if: User is not the owner (for employees)
- Always enabled for managers on future bookings

**Booking Delete Button:**
- Disabled if: Booking is in the past (for employees)
- Disabled if: User is not the owner (for employees)
- Always enabled for managers

**Room Edit Button:**
- Always enabled

**Room Delete Button:**
- Always enabled (cascades to delete bookings)

---

## Error Handling

### Modal Errors
- Display in red box with left border
- Show validation errors (missing fields, invalid values)
- Show API errors (overlaps, conflicts, server issues)

### Success Messages
- Display in green box with left border
- Auto-hide after 1.5 seconds
- Show on create/update/delete success

---

## Files Modified

1. **app/pages/bookings.vue**
   - Removed calendar grid layout
   - Implemented list view with pagination
   - Added booking modal for CRUD
   - Role-based filtering (employees see only their bookings)

2. **app/pages/rooms.vue**
   - Removed large card grid layout
   - Implemented list view with pagination
   - Added room modal for CRUD
   - Manager-only access with fallback UI

3. **app/components/AppHeader.vue**
   - No changes (navigation remains the same)

4. **app/layouts/default.vue**
   - No changes (layout structure remains the same)

---

## Testing Checklist

- [ ] Employee can create booking
- [ ] Employee can only see their own bookings
- [ ] Employee can edit own future bookings
- [ ] Employee cannot edit past bookings
- [ ] Employee can delete own future bookings
- [ ] Manager can see all bookings
- [ ] Manager can filter to see only own bookings
- [ ] Manager can create booking
- [ ] Manager can edit any booking
- [ ] Manager can delete any booking
- [ ] Manager can see Rooms page
- [ ] Employee cannot see Rooms page
- [ ] Manager can create room
- [ ] Manager can edit room
- [ ] Manager can delete room
- [ ] Pagination works (10 items per page)
- [ ] Search filters work correctly
- [ ] Modals open and close properly
- [ ] Validation messages show correctly
- [ ] Real-time updates work
- [ ] Responsive design works on mobile

---

## Summary

The application is now simplified with:
- ✅ Clean list-based interface
- ✅ Modal-based CRUD operations
- ✅ Pagination (10 items per page)
- ✅ Role-based access control
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Error handling and validation
- ✅ Search and filtering

Ready for testing and deployment! 🚀
