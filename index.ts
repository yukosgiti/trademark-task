import { Prisma, PrismaClient, TradeMark } from '@prisma/client'
import { convertXMLToTradeMarkJson, populateDatabase } from './scripts'
import 'dotenv/config'
import fs from "fs/promises"
import express from "express";

const prisma = new PrismaClient()

const app = express();
const port = process.env.PORT;

type Query = {
  q: string,
  descriptionLanguage?: string
}

app.get('/', async (req, res) => {
  let a = req.query as Query;
  res.type("json");

  if (a.q == null) {
    return res.status(422).send({
      message: "Parameter 'q' is missing."
    })
  }
  let result = await prisma.tradeMark.findFirst({
    where: {
      wordMark: {
        equals: a.q,
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
          GoodsServiceDescription: {
            where: {
              languageCode: a.descriptionLanguage
            }
          },
          classNumber: true,
        },
      }

    }
  })
  if (result == null) {
    // No content
    return res.status(204).send();
  }

  return res.send(result);

})

app.get("/fuzzy", async (req, res) => {
  let a = req.query as Query;
  let result = await fuzzySearch(prisma, a.q, 10)
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

async function fuzzySearch(client: PrismaClient, word: string, limit: number = 10) {
  let clampedLimit = Math.min(50, Math.max(limit, 0))

  let wordMarkName: keyof TradeMark = "wordMark"
  //SIMILARITY function comes from the extension.
  let response = await prisma.$queryRaw`
    SELECT *, SIMILARITY("wordMark", ${word}) as sim FROM "TradeMark" ORDER BY sim DESC LIMIT ${clampedLimit};`
  return response;
}

app.use(function (err: any, req: any, res: { status: (arg0: number) => void; send: (arg0: string) => void; }, next: any) {
  res.status(500);
  res.send("Oops, something went wrong.")
});

async function main() {
  await ensureEnv();

  //Fuzzy search extension.
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

  // await populateDatabase(prisma);
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