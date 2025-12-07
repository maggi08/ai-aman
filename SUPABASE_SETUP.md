# Supabase Setup Guide

This document provides instructions for setting up the Supabase backend for the Meeting Room Booking System.

## 1. Create Tables in Supabase

Execute the following SQL in your Supabase SQL Editor to create the database tables:

```sql
-- Create rooms table
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  capacity integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX bookings_room_id_idx ON public.bookings(room_id);
CREATE INDEX bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX bookings_start_time_idx ON public.bookings(start_time);
CREATE INDEX bookings_end_time_idx ON public.bookings(end_time);
```

## 2. Enable Row Level Security (RLS)

Enable RLS for both tables:

```sql
-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

## 3. Create RLS Policies

### Rooms Table Policies

```sql
-- Managers can create rooms
CREATE POLICY "managers_can_create_rooms" ON public.rooms
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager'
  );

-- Anyone can read rooms
CREATE POLICY "anyone_can_read_rooms" ON public.rooms
  FOR SELECT
  USING (true);

-- Managers can update rooms
CREATE POLICY "managers_can_update_rooms" ON public.rooms
  FOR UPDATE
  USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager')
  WITH CHECK (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager');

-- Managers can delete rooms
CREATE POLICY "managers_can_delete_rooms" ON public.rooms
  FOR DELETE
  USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager');
```

### Bookings Table Policies

```sql
-- Employees can create their own bookings
CREATE POLICY "employees_can_create_bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    (auth.jwt() ->> 'user_metadata' ->> 'role' = 'employee' OR
     auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager')
  );

-- Managers can create bookings for anyone
CREATE POLICY "managers_can_create_bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager'
  );

-- Employees can only see their own bookings
CREATE POLICY "employees_can_read_own_bookings" ON public.bookings
  FOR SELECT
  USING (
    user_id = auth.uid() AND
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'employee'
  );

-- Managers can see all bookings
CREATE POLICY "managers_can_read_all_bookings" ON public.bookings
  FOR SELECT
  USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager'
  );

-- Employees can update their own bookings
CREATE POLICY "employees_can_update_own_bookings" ON public.bookings
  FOR UPDATE
  USING (
    user_id = auth.uid() AND
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'employee'
  )
  WITH CHECK (user_id = auth.uid());

-- Managers can update all bookings
CREATE POLICY "managers_can_update_bookings" ON public.bookings
  FOR UPDATE
  USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager')
  WITH CHECK (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager');

-- Employees can delete their own bookings
CREATE POLICY "employees_can_delete_own_bookings" ON public.bookings
  FOR DELETE
  USING (
    user_id = auth.uid() AND
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'employee'
  );

-- Managers can delete all bookings
CREATE POLICY "managers_can_delete_bookings" ON public.bookings
  FOR DELETE
  USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'manager');
```

## 4. Enable Realtime for Bookings

In Supabase dashboard:
1. Go to "Realtime" in the left sidebar
2. Click "Enable" for `bookings` table
3. This will enable postgres_changes for the bookings table

## 5. Environment Variables

Add these to your `.env.local` file:

```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

## 6. Database Connection

For Prisma to work with the server-side API:
1. Get your direct database URL from Supabase settings
2. Set it in the DATABASE_URL environment variable
3. Run migrations: `npx prisma migrate deploy`

## 7. User Metadata

When creating users, ensure the role is stored in user_metadata:

```javascript
// In register.vue
const { data, error } = await client.auth.signUp({
  email: email.value,
  password: password.value,
  options: {
    data: {
      role: role.value  // 'employee' or 'manager'
    }
  }
});
```

## Testing RLS Policies

Use the Supabase SQL Editor to test policies:

```sql
-- Test as a regular user (employee)
SET request.jwt.claim.sub = 'test-user-id';
SET request.jwt.claim.user_metadata = '{"role": "employee"}';

SELECT * FROM public.bookings;  -- Should only see their bookings

-- Test as manager
SET request.jwt.claim.user_metadata = '{"role": "manager"}';

SELECT * FROM public.bookings;  -- Should see all bookings
```

## Security Checklist

- [x] RLS enabled on all tables
- [x] Policies restrict access based on user role
- [x] Employees cannot access others' bookings
- [x] Managers have full access
- [x] JWT role validation in server routes
- [x] Database encryption enabled (Supabase default)

## Troubleshooting

### "User not authorized" error
- Check if RLS is enabled
- Verify user has role in user_metadata
- Test JWT token in SQL Editor

### Bookings not showing up
- Confirm the user_id matches auth.uid()
- Check RLS policies are correctly applied
- Verify user_metadata contains correct role

### Realtime updates not working
- Enable realtime for bookings table
- Ensure client is subscribed to channel
- Check browser console for subscription errors
