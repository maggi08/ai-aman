// Server-side only utility for Prisma client
let prisma: any
let prismaPromise: Promise<any> | null = null

async function getPrismaClientSingleton() {
  if (!prisma) {
    // Dynamic import using absolute path to bypass Rollup bundler
    const absolutePath = '/Users/farizazhexembinova/programing/aman/ab.ai/.prisma/client/index.js'
    const module = await import(absolutePath)
    prisma = new module.PrismaClient()
  }
  return prisma
}

export async function getPrismaClient() {
  if (!prismaPromise) {
    prismaPromise = getPrismaClientSingleton()
  }
  return prismaPromise
}

// Initialize on module load
prismaPromise = getPrismaClientSingleton()
