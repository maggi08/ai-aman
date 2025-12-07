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

  const roomId = getRouterParam(event, 'id');

  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Room ID is required',
    });
  }

  const room = await event.context.prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Room not found',
    });
  }

  await event.context.prisma.room.delete({
    where: { id: roomId },
  });

  return { success: true, message: 'Room deleted' };
});
