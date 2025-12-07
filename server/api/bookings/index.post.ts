import jwt from 'jsonwebtoken';

function decodeToken(token) {
  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.decode(cleanToken, { complete: false });
    return decoded;
  } catch (error) {
    return null;
  }
}

function requireAuth(event) {
  const authHeader = event.headers.get('authorization');
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const payload = decodeToken(authHeader);
  if (!payload?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  return payload.sub;
}

export default defineEventHandler(async (event) => {
  const userId = requireAuth(event);
  const body = await readBody(event);

  const { roomId, startTime, endTime } = body;

  if (!roomId || !startTime || !endTime) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validate: maximum 2 hours
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  if (durationHours > 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Booking duration cannot exceed 2 hours',
    });
  }

  if (durationHours <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'End time must be after start time',
    });
  }

  // Check for overlapping bookings
  const overlappingBookings = await event.context.prisma.booking.findMany({
    where: {
      roomId,
      OR: [
        {
          startTime: {
            lt: end,
          },
          endTime: {
            gt: start,
          },
        },
      ],
    },
  });

  if (overlappingBookings.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Room is already booked for this time period',
    });
  }

  const booking = await event.context.prisma.booking.create({
    data: {
      roomId,
      userId,
      startTime: start,
      endTime: end,
    },
    include: {
      room: true,
    },
  });

  return booking;
});
