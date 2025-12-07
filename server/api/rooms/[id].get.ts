export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'id');

  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Room ID is required',
    });
  }

  const room = await event.context.prisma.room.findUnique({
    where: { id: roomId },
    include: {
      bookings: {
        select: {
          id: true,
          userId: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Room not found',
    });
  }

  return room;
});
