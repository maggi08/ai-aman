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

function requireRole(event, ...roles) {
  requireAuth(event);
  const authHeader = event.headers.get('authorization');
  const payload = decodeToken(authHeader);
  if (!payload?.role || !roles.includes(payload.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Insufficient permissions' });
  }
}

export default defineEventHandler(async (event) => {
  requireRole(event, 'manager');

  const body = await readBody(event);
  const { name, capacity } = body;

  if (!name || !capacity) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and capacity are required',
    });
  }

  if (typeof capacity !== 'number' || capacity < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Capacity must be a positive number',
    });
  }

  const room = await event.context.prisma.room.create({
    data: {
      name,
      capacity,
    },
  });

  return room;
});
