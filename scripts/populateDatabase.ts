import { PrismaClient } from "@prisma/client";
import fs from "fs/promises"
import { TradeMark } from "../types"

async function populateDatabase(client: PrismaClient) {
  const trademarkPaths = await fs.readdir(process.env.SAVE_PATH!)
  for (const path of trademarkPaths) {
    let tradeMarkJSON = await parseJSONFile(`${process.env.SAVE_PATH}/${path}`)
    let tradeMarkObj = new TradeMark(tradeMarkJSON)
    console.log(tradeMarkJSON)
  }
}

async function parseJSONFile(filePath: string) {
  let file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file)
}

export { populateDatabase }