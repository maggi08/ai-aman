import { getPrismaClient } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  // Make Prisma client available in event context
  event.context.prisma = await getPrismaClient()
})
