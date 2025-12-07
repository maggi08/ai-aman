export default defineEventHandler(async (event) => {
  const rooms = await event.context.prisma.room.findMany({
    include: {
      bookings: {
        select: {
          id: true,
          userId: true,
          startTime: true,
          endTime: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return rooms;
});
