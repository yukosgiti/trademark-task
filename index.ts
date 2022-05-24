import { PrismaClient } from '@prisma/client'
import { convertXMLToTradeMarkJson, populateDatabase } from './scripts'
import 'dotenv/config'
import path from 'path';
import fs from "fs/promises"

const prisma = new PrismaClient()

async function ensureEnv() {

  if (process.env.FILES_PATH == null) {
    throw Error("Please define 'FILE_PATH' environment variable.")
  }
  let filesPathStat = await fs.lstat(process.env.FILES_PATH);

  if (!filesPathStat.isDirectory()) {
    throw Error("'FILE_PATH' is not a directory.")
  }

  if (process.env.SAVE_PATH == null) {
    throw Error("Please define 'SAVE_PATH' environment variable.")
  }

  let savePathStat = await fs.lstat(process.env.SAVE_PATH);
  if (!savePathStat.isDirectory()) {
    throw Error("'SAVE_PATH' is not a directory.")
  }
}

async function main() {
  await ensureEnv();
  await populateDatabase(prisma)
  // await convertXMLToTradeMarkJson()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 