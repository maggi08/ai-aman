// Server-side Prisma utility
let prisma: any

export function getPrismaClient() {
  if (!prisma) {
    // This runs on server side only
    // Using string literal to avoid Nitro bundler issues
    const { PrismaClient } = require('../' + '.prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}
