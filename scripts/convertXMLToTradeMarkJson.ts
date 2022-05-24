import fs from "fs/promises";
import xml2js from "xml2js";
import 'dotenv/config'

/**
 * Reads TradeMark XML files from 'FILES_PATH' given in .env file.
 * 
 * And writes the parsed XML file to 'SAVE_PATH'.
 * 
 * Parsed XML File contains only the information about the trademark.
 * 
 * Assumes the files are structured like:
 * @example "<FILES_PATH>/123/foo.xml"
 * "<FILES_PATH>/123/bar.xml"
 * "<FILES_PATH>/124/baz.xml"
 */
async function convertXMLToTradeMarkJson() {
  let filesPath = process.env.FILES_PATH;
  if (filesPath == null) {
    throw Error("Please define 'FILE_PATH' environment variable.")
  }

  let savePath = process.env.SAVE_PATH;
  if (savePath == null) {
    throw Error("Please define 'SAVE_PATH' environment variable.")
  }

  let folders = await fs.readdir(filesPath);
  for (const folder of folders) {
    let folderPath = `${filesPath}/${folder}`
    let folderItems = await fs.readdir(folderPath);


    let promises = folderItems.map(async (fileName) => {
      let filePath = `${folderPath}/${fileName}`;
      let file = await fs.readFile(filePath);
      let parser = new xml2js.Parser();
      let xmlJson = await parser.parseStringPromise(file)
      let { TradeMarkTransactionBody } = xmlJson.Transaction;
      let { TransactionContentDetails } = TradeMarkTransactionBody[0];
      let { TransactionData } = TransactionContentDetails[0];
      let { TradeMarkDetails } = TransactionData[0]

      // The XML Specification claims that these may hold more than one TradeMark.
      // However all of the XML's seems to actually have only one TradeMark defined.

      for (let i = 0; i < TradeMarkDetails.length; i++) {
        let tm = TradeMarkDetails[i];
        let { TradeMark } = tm;

        let { MarkFeature } = TradeMark[0];
        let feature = MarkFeature[0];
        if (feature != "Word") {
          continue;
        }
        console.log({ filePath });
        await fs.writeFile(`${savePath}/${folder}.${fileName}.json`, JSON.stringify(TradeMark))
      }
    })

    await Promise.all(promises);
  }
}

export { convertXMLToTradeMarkJson }