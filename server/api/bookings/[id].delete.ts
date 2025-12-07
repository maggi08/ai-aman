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

function getUserRoleFromEvent(event) {
  const authHeader = event.headers.get('authorization');
  if (!authHeader) return null;
  const payload = decodeToken(authHeader);
  return payload?.role || null;
}

export default defineEventHandler(async (event) => {
  const userId = requireAuth(event);
  const bookingId = getRouterParam(event, 'id');
  const userRole = getUserRoleFromEvent(event);

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Booking ID is required',
    });
  }

  const booking = await event.context.prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Booking not found',
    });
  }

  // Employee can only delete their own future bookings
  if (userRole === 'employee' && booking.userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only delete your own bookings',
    });
  }

  // Employee cannot delete past bookings
  if (userRole === 'employee' && booking.startTime < new Date()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You cannot delete past bookings',
    });
  }

  await event.context.prisma.booking.delete({
    where: { id: bookingId },
  });

  return { success: true, message: 'Booking deleted' };
});
