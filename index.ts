import { PrismaClient } from '@prisma/client'
import { convertXMLToTradeMarkJson, populateDatabase } from './scripts'
import 'dotenv/config'
import path from 'path';
import fs from "fs/promises"
import express from "express";
import { pseudoRandomBytes } from 'crypto';

const prisma = new PrismaClient()

const app = express();
const port = process.env.PORT;

app.get('/', async (req, res) => {
  let a = req.query
  let result = await prisma.tradeMark.findMany({
    where: {
      wordMark: {
        contains: a.q as string,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      wordMark: true,
      Publication: true,
      expiryDate: true,
      applicationNumber: true,
      applicationDate: true,
      applicationLanguageCode: true,
      kindMark: true,
      registrationDate: true,
      markCurrentStatusCodeStatus: true,
      ClassDescription: {
        select: {
          GoodsServiceDescription: true,
          classNumber: true,

        }
      }

    }
  })
  res.type("json");
  res.send(result);
})


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
  // await populateDatabase(prisma)
  // await convertXMLToTradeMarkJson()

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}



main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 