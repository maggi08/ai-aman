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
  const body = await readBody(event);

  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Room ID is required',
    });
  }

  const { name, capacity } = body;

  if (name === undefined && capacity === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field (name or capacity) is required',
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

  const updatedRoom = await event.context.prisma.room.update({
    where: { id: roomId },
    data: {
      ...(name !== undefined && { name }),
      ...(capacity !== undefined && { capacity }),
    },
  });

  return updatedRoom;
});
