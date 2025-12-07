# Vue Composables Documentation

This document describes the custom Vue composables used in the Meeting Room Booking System.

## useAuth

Authentication and user state management composable.

### Usage

```typescript
const {
  user,              // Current user from Supabase
  userRole,          // User's role ('employee' or 'manager')
  isAuthenticated,   // Boolean indicating if user is logged in
  isManager,         // Boolean indicating if user is manager
  isEmployee,        // Boolean indicating if user is employee
  login,             // Function to login
  register,          // Function to register
  logout,            // Function to logout
  loadUserRole       // Function to load user role from metadata
} = useAuth();
```

### Properties

#### user (readonly)
Current authenticated user from Supabase.

```typescript
const { user } = useAuth();

console.log(user.value?.email);
console.log(user.value?.id);
```

#### userRole (readonly)
User's role as a string ('employee' or 'manager'). Extracted from user metadata.

```typescript
const { userRole } = useAuth();

if (userRole.value === 'manager') {
  // Show manager controls
}
```

#### isAuthenticated (computed)
Reactive boolean indicating whether user is logged in.

```typescript
const { isAuthenticated } = useAuth();

if (isAuthenticated.value) {
  // Show dashboard
}
```

#### isManager (computed)
Reactive boolean indicating if user has manager role.

```typescript
const { isManager } = useAuth();

v-if="isManager" // Show manager-only UI
```

#### isEmployee (computed)
Reactive boolean indicating if user has employee role.

### Methods

#### login(email: string, password: string)
Authenticate user with email and password.

```typescript
const { login } = useAuth();

try {
  await login('user@example.com', 'password123');
  // User is now logged in, automatically redirected to dashboard
} catch (error) {
  console.error('Login failed:', error);
}
```

#### register(email: string, password: string, role: 'employee' | 'manager')
Create a new user account with specified role.

```typescript
const { register } = useAuth();

try {
  await register('user@example.com', 'password123', 'employee');
  // Account created, user logged in and redirected
} catch (error) {
  console.error('Registration failed:', error);
}
```

#### logout()
Sign out the current user.

```typescript
const { logout } = useAuth();

await logout();
// User logged out and redirected to login page
```

#### loadUserRole()
Load user role from Supabase metadata.

```typescript
const { loadUserRole } = useAuth();

const role = await loadUserRole();
console.log(role); // 'employee' or 'manager'
```

### Example Usage in Component

```vue
<template>
  <div>
    <span v-if="isAuthenticated">{{ user?.email }} ({{ userRole }})</span>
    <button v-if="isAuthenticated" @click="logout">Logout</button>

    <div v-if="isManager">
      <!-- Manager controls -->
    </div>
  </div>
</template>

<script setup>
const { user, userRole, isAuthenticated, isManager, logout } = useAuth();
</script>
```

## useRooms

Meeting room management composable.

### Usage

```typescript
const {
  rooms,           // Array of all rooms
  loading,         // Boolean indicating loading state
  error,           // Error message if any
  getRooms,        // Fetch all rooms
  getRoom,         // Fetch single room details
  createRoom,      // Create new room (manager only)
  updateRoom,      // Update room (manager only)
  deleteRoom       // Delete room (manager only)
} = useRooms();
```

### Properties

#### rooms (readonly)
Reactive array containing all meeting rooms.

```typescript
const { rooms } = useRooms();

for (const room of rooms.value) {
  console.log(room.name, room.capacity);
}
```

#### loading (readonly)
Reactive boolean indicating if an async operation is in progress.

```typescript
const { loading } = useRooms();

<button :disabled="loading.value">{{ loading.value ? 'Loading...' : 'Action' }}</button>
```

#### error (readonly)
Reactive string containing the last error message, or null if no error.

```typescript
const { error } = useRooms();

<div v-if="error.value" class="error">{{ error.value }}</div>
```

### Methods

#### getRooms()
Fetch all available rooms.

```typescript
const { getRooms, rooms } = useRooms();

onMounted(async () => {
  await getRooms();
  console.log(rooms.value); // Array of rooms
});
```

#### getRoom(roomId: string)
Fetch details for a specific room.

```typescript
const { getRoom } = useRooms();

const room = await getRoom('room-uuid');
console.log(room.bookings); // Room bookings
```

#### createRoom(name: string, capacity: number)
Create a new meeting room (manager only).

```typescript
const { createRoom, error } = useRooms();

try {
  const newRoom = await createRoom('Conference Room A', 10);
  console.log('Room created:', newRoom.id);
} catch (err) {
  console.error('Failed:', error.value);
}
```

#### updateRoom(roomId: string, updates: {name?: string, capacity?: number})
Update room details (manager only).

```typescript
const { updateRoom } = useRooms();

await updateRoom('room-uuid', {
  name: 'Updated Name',
  capacity: 20
});
```

#### deleteRoom(roomId: string)
Delete a room (manager only).

```typescript
const { deleteRoom } = useRooms();

await deleteRoom('room-uuid');
```

### Example Usage in Component

```vue
<template>
  <div>
    <div v-if="loading">Loading rooms...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-for="room in rooms" :key="room.id">
      <h3>{{ room.name }}</h3>
      <p>Capacity: {{ room.capacity }}</p>
      <button @click="deleteRoom(room.id)">Delete</button>
    </div>
  </div>
</template>

<script setup>
const { rooms, loading, error, deleteRoom } = useRooms();

onMounted(async () => {
  await useRooms().getRooms();
});
</script>
```

## useBookings

Meeting room booking management composable.

### Usage

```typescript
const {
  bookings,          // Array of bookings
  loading,           // Boolean indicating loading state
  error,             // Error message if any
  createBooking,     // Create new booking
  deleteBooking,     // Delete booking
  getBookings,       // Fetch all bookings
  subscribeToBookings // Subscribe to real-time updates
} = useBookings();
```

### Properties

#### bookings (readonly)
Reactive array of bookings. Content depends on user role.

```typescript
const { bookings } = useBookings();

for (const booking of bookings.value) {
  console.log(booking.room?.name, booking.startTime);
}
```

#### loading (readonly)
Reactive boolean indicating async operation in progress.

#### error (readonly)
Reactive error message, or null if no error.

### Methods

#### createBooking(roomId: string, startTime: Date, endTime: Date)
Create a new room booking.

```typescript
const { createBooking, error } = useBookings();

try {
  const booking = await createBooking(
    'room-uuid',
    new Date('2025-01-01T10:00:00'),
    new Date('2025-01-01T11:00:00')
  );
  console.log('Booking created:', booking.id);
} catch (err) {
  // Error message in error.value
  // Possible errors:
  // - "Booking duration cannot exceed 2 hours"
  // - "Room is already booked for this time period"
  console.error('Failed:', error.value);
}
```

#### deleteBooking(bookingId: string)
Delete a booking.

```typescript
const { deleteBooking } = useBookings();

try {
  await deleteBooking('booking-uuid');
} catch (err) {
  // Error handling
}
```

#### getBookings()
Fetch all bookings (filtered by role on server).

```typescript
const { getBookings, bookings } = useBookings();

await getBookings();
// Employees see only their bookings
// Managers see all bookings
```

#### subscribeToBookings(roomId?: string)
Subscribe to real-time booking updates.

```typescript
const { subscribeToBookings } = useBookings();

// Subscribe to all booking changes
const unsubscribe = subscribeToBookings();

// Subscribe to changes for specific room
// const unsubscribe = subscribeToBookings('room-uuid');

// Cleanup on component unmount
onUnmounted(() => {
  unsubscribe();
});
```

### Example Usage in Component

```vue
<template>
  <div>
    <div v-if="loading">Loading bookings...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="handleBook">
      <input v-model="roomId" placeholder="Room ID" />
      <input v-model="startTime" type="datetime-local" />
      <input v-model="endTime" type="datetime-local" />
      <button type="submit">Book Room</button>
    </form>

    <div v-for="booking in bookings" :key="booking.id">
      <p>{{ booking.room?.name }}</p>
      <p>{{ new Date(booking.startTime).toLocaleString() }}</p>
      <button @click="deleteBooking(booking.id)">Cancel</button>
    </div>
  </div>
</template>

<script setup>
const { bookings, loading, error, createBooking, deleteBooking, getBookings, subscribeToBookings } = useBookings();

const roomId = ref('');
const startTime = ref('');
const endTime = ref('');

onMounted(async () => {
  await getBookings();
  subscribeToBookings();
});

async function handleBook() {
  try {
    await createBooking(
      roomId.value,
      new Date(startTime.value),
      new Date(endTime.value)
    );
    // Clear form
    roomId.value = '';
    startTime.value = '';
    endTime.value = '';
  } catch (err) {
    // Error shown in template via error.value
  }
}
</script>
```

## Best Practices

### 1. Load Data on Mount
Always load data when component mounts:

```typescript
onMounted(async () => {
  await getRooms();
  await getBookings();
  subscribeToBookings();
});
```

### 2. Handle Loading States
Show loading indicators while fetching:

```typescript
<div v-if="loading" class="spinner">Loading...</div>
```

### 3. Display Errors
Always show error messages to users:

```typescript
<div v-if="error" class="error-alert">{{ error }}</div>
```

### 4. Cleanup Subscriptions
Unsubscribe from real-time updates on unmount:

```typescript
let unsubscribe;

onMounted(() => {
  unsubscribe = subscribeToBookings();
});

onUnmounted(() => {
  unsubscribe?.();
});
```

### 5. Validate User Role
Check role before showing sensitive UI:

```typescript
<button v-if="isManager" @click="deleteRoom">Delete Room</button>
```

## Common Patterns

### Loading Rooms and Bookings
```typescript
const { getRooms, rooms } = useRooms();
const { getBookings, bookings, subscribeToBookings } = useBookings();

onMounted(async () => {
  await getRooms();
  await getBookings();
  subscribeToBookings();
});
```

### Creating with Error Handling
```typescript
const { createBooking, error } = useBookings();

async function book() {
  try {
    await createBooking(roomId, startTime, endTime);
    // Success - refresh or show confirmation
  } catch {
    // Error message available in error.value
  }
}
```

### Role-based Rendering
```typescript
const { isManager, isEmployee } = useAuth();

// In template:
// <div v-if="isManager">Manager UI</div>
// <div v-else-if="isEmployee">Employee UI</div>
```
