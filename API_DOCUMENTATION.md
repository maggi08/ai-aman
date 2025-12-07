# API Documentation

## Overview

The Meeting Room Booking System API uses RESTful endpoints for managing rooms and bookings. All endpoints require authentication via JWT tokens from Supabase.

## Authentication

All API requests must include the Authorization header with a Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token is obtained from Supabase authentication and should be passed in the HTTP Authorization header.

## Error Handling

Standard HTTP status codes are used:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., double-booking)
- `500` - Server Error

Error responses include a message:
```json
{
  "statusCode": 400,
  "statusMessage": "Error description"
}
```

## Endpoints

### Rooms API

#### Get All Rooms
Retrieve all available meeting rooms.

```
GET /api/rooms
```

**Authentication:** Required
**Authorization:** Any authenticated user

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Conference Room A",
    "capacity": 10,
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z",
    "bookings": [
      {
        "id": "uuid",
        "userId": "user-uuid",
        "startTime": "2025-01-01T10:00:00Z",
        "endTime": "2025-01-01T11:00:00Z"
      }
    ]
  }
]
```

#### Create Room
Create a new meeting room (manager only).

```
POST /api/rooms
```

**Authentication:** Required
**Authorization:** Manager role

**Request Body:**
```json
{
  "name": "Conference Room A",
  "capacity": 10
}
```

**Validation:**
- `name` (string, required): Room name
- `capacity` (number, required): Must be positive integer

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Conference Room A",
  "capacity": 10,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z"
}
```

**Errors:**
- `400` - Missing required fields or invalid capacity
- `403` - User is not a manager

#### Get Room Details
Retrieve details for a specific room including its bookings.

```
GET /api/rooms/{id}
```

**Authentication:** Required
**Authorization:** Any authenticated user

**Parameters:**
- `id` (path, required): Room UUID

**Response:**
```json
{
  "id": "uuid",
  "name": "Conference Room A",
  "capacity": 10,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z",
  "bookings": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "startTime": "2025-01-01T10:00:00Z",
      "endTime": "2025-01-01T11:00:00Z"
    }
  ]
}
```

**Errors:**
- `404` - Room not found

#### Update Room
Update room details (manager only).

```
PATCH /api/rooms/{id}
```

**Authentication:** Required
**Authorization:** Manager role

**Parameters:**
- `id` (path, required): Room UUID

**Request Body:**
```json
{
  "name": "Updated Room Name",
  "capacity": 20
}
```

**Validation:**
- At least one field (name or capacity) must be provided
- capacity must be positive integer if provided

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Room Name",
  "capacity": 20,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:15:00Z"
}
```

**Errors:**
- `400` - No fields provided or invalid data
- `403` - User is not a manager
- `404` - Room not found

#### Delete Room
Delete a meeting room and all associated bookings (manager only).

```
DELETE /api/rooms/{id}
```

**Authentication:** Required
**Authorization:** Manager role

**Parameters:**
- `id` (path, required): Room UUID

**Response:**
```json
{
  "success": true,
  "message": "Room deleted"
}
```

**Errors:**
- `403` - User is not a manager
- `404` - Room not found

### Bookings API

#### Get All Bookings
Retrieve bookings (filtered based on user role).

```
GET /api/bookings
```

**Authentication:** Required
**Authorization:** Any authenticated user

**Role-based behavior:**
- **Employee:** Returns only their own bookings
- **Manager:** Returns all bookings

**Response:**
```json
[
  {
    "id": "uuid",
    "roomId": "room-uuid",
    "userId": "user-uuid",
    "startTime": "2025-01-01T10:00:00Z",
    "endTime": "2025-01-01T11:00:00Z",
    "createdAt": "2025-01-01T09:00:00Z",
    "updatedAt": "2025-01-01T09:00:00Z",
    "room": {
      "id": "room-uuid",
      "name": "Conference Room A",
      "capacity": 10
    }
  }
]
```

#### Create Booking
Create a new room booking.

```
POST /api/bookings
```

**Authentication:** Required
**Authorization:** Employee or Manager

**Request Body:**
```json
{
  "roomId": "room-uuid",
  "startTime": "2025-01-01T10:00:00Z",
  "endTime": "2025-01-01T11:00:00Z"
}
```

**Validation:**
- `roomId` (string, required): Valid room UUID
- `startTime` (ISO 8601 datetime, required): Booking start time
- `endTime` (ISO 8601 datetime, required): Booking end time
- Duration: Must not exceed 2 hours
- End time must be after start time
- No overlapping bookings for the same room

**Response (201):**
```json
{
  "id": "uuid",
  "roomId": "room-uuid",
  "userId": "user-uuid",
  "startTime": "2025-01-01T10:00:00Z",
  "endTime": "2025-01-01T11:00:00Z",
  "createdAt": "2025-01-01T09:00:00Z",
  "updatedAt": "2025-01-01T09:00:00Z",
  "room": {
    "id": "room-uuid",
    "name": "Conference Room A",
    "capacity": 10
  }
}
```

**Errors:**
- `400` - Missing required fields
- `400` - "Booking duration cannot exceed 2 hours"
- `400` - "End time must be after start time"
- `409` - "Room is already booked for this time period"

#### Delete Booking
Delete a booking.

```
DELETE /api/bookings/{id}
```

**Authentication:** Required
**Authorization:** Booking owner (employee) or Manager

**Parameters:**
- `id` (path, required): Booking UUID

**Role-based behavior:**
- **Employee:** Can only delete their own future bookings
- **Manager:** Can delete any booking

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted"
}
```

**Errors:**
- `403` - User is not booking owner (employee only)
- `403` - Booking is in the past (employee only)
- `404` - Booking not found

## Usage Examples

### JavaScript/TypeScript with $fetch

```typescript
// Get all rooms
const rooms = await $fetch('/api/rooms');

// Create a booking
const booking = await $fetch('/api/bookings', {
  method: 'POST',
  body: {
    roomId: 'room-uuid',
    startTime: new Date('2025-01-01T10:00:00').toISOString(),
    endTime: new Date('2025-01-01T11:00:00').toISOString()
  }
});

// Delete a booking
await $fetch(`/api/bookings/${bookingId}`, {
  method: 'DELETE'
});
```

### Using Supabase Client

```typescript
const client = useSupabaseClient();

// Get bookings via Supabase
const { data } = await client
  .from('bookings')
  .select('*')
  .order('startTime', { ascending: true });
```

## Rate Limiting

Currently, no rate limiting is enforced. Rate limiting may be added in future versions.

## Pagination

Currently, no pagination is implemented. For large datasets, consider implementing cursor-based pagination.

## Caching

API responses are not cached by default. Implement caching strategies in your client application as needed.

## Security Headers

Ensure your deployment includes standard security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## CORS

CORS is configured to allow requests from the same origin. Adjust in `nuxt.config.ts` for cross-origin requests.

## API Versioning

Currently v1 (no version prefix in URLs). Future versions may use `/api/v2/` etc.

## Webhook Support

Webhooks are not currently implemented. Consider Supabase Edge Functions for real-time event handling.

## File Uploads

File uploads are not supported. Rooms and bookings use text/number fields only.

## Query Parameters

Filtering and sorting via query parameters are not currently supported. Implement advanced filtering in future versions.

## Bulk Operations

Bulk create/update/delete operations are not supported. Process requests individually.

## Data Retention

- User accounts: Retained indefinitely (Supabase managed)
- Bookings: Retained indefinitely
- Rooms: Retained until deleted

## Testing API

Use tools like Postman or curl:

```bash
# Get rooms
curl -H "Authorization: Bearer YOUR_JWT" \
  https://your-domain.com/api/rooms

# Create booking
curl -X POST -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"roomId":"...","startTime":"...","endTime":"..."}' \
  https://your-domain.com/api/bookings
```
