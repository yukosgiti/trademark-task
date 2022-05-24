import { PrismaClient } from '@prisma/client'
import { convertXMLToTradeMarkJson } from './scripts'

const prisma = new PrismaClient()

async function main() {

  await convertXMLToTradeMarkJson()
  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 