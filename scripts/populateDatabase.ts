import { PrismaClient } from "@prisma/client";
import fs from "fs/promises"
import { TradeMark } from "../types"

async function populateDatabase(client: PrismaClient) {
  const trademarkPaths = await fs.readdir(process.env.SAVE_PATH!)
  for (const path of trademarkPaths) {
    let tradeMarkJSON = await parseJSONFile(`${process.env.SAVE_PATH}/${path}`)
    let tradeMarkObj = new TradeMark(tradeMarkJSON)
    // console.log({ file: `${process.env.SAVE_PATH}/${path}`, tradeMarkJSON })

    let result = await client.tradeMark.create({
      data: {
        applicationDate: tradeMarkObj.applicationDate,
        applicationNumber: tradeMarkObj.applicationNumber!,
        markCurrentStatusCode: tradeMarkObj.markCurrentStatusCode,
        operationCode: tradeMarkObj.operationCode!,
        wordMark: tradeMarkObj.wordMark,
        applicationLanguageCode: tradeMarkObj.applicationLanguageCode,
        secondLanguageCode: tradeMarkObj.secondLanguageCode,
        expiryDate: tradeMarkObj.expiryDate,
        kindMark: tradeMarkObj.kindMark,
        tradeDistinctivenessIndicator: tradeMarkObj.tradeDistinctivenessIndicator,
        markCurrentStatusCodeMilestone: tradeMarkObj.markCurrentStatusCodeMilestone,
        markCurrentStatusCodeStatus: tradeMarkObj.markCurrentStatusCodeStatus,
        Publication: {
          createMany: {
            data: tradeMarkObj.publications?.map(i => ({
              publicationDate: i.publicationDate!,
              publicationIdentifier: i.publicationIdentifier!,
              publicationPage: i.publicationPage,
              publicationSection: i.publicationSection!
            })) ?? []
          }
        },
      }
    })

    tradeMarkObj.classDescriptions?.forEach(async (i) => {
      await client.classDescription.create({
        data: {
          classNumber: i.classNumber!,
          tradeMarkId: result.id,
          GoodsServiceDescription: {
            create: i.descriptions?.map(j => ({ description: j.description, languageCode: j.languageCode }))
          }
        }
      })
    })
  }
}

async function parseJSONFile(filePath: string) {
  let file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file)
}

export { populateDatabase }