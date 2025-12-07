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
  const userRole = getUserRoleFromEvent(event);

  let query: any = {
    include: {
      room: {
        select: {
          id: true,
          name: true,
          capacity: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  };

  // Employee can only see their own bookings
  if (userRole === 'employee') {
    query.where = {
      userId,
    };
  }

  const bookings = await event.context.prisma.booking.findMany(query);
  return bookings;
});
