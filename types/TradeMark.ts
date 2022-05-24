import { OperationCode, EUOfficialLanguageCode, KindType, EMSecondLanguageCodeType, MarkCurrentStatusCodeStatus } from "@prisma/client";
import { Publication } from "./Publication";


const MARK_CURRENT_STATUS_CODE: { [key: string]: MarkCurrentStatusCodeStatus } = {
  "Application filed": "ApplicationFiled",
  "Application published": "ApplicationPublished",
  "Application refused": "ApplicationRefused",
  "Application under examination": "ApplicationUnderExamination",
  "Application withdrawn": "ApplicationWithdrawn",
  "Registration pending": "RegistrationPending",
  "Application opposed": "ApplicationOpposed",
  "Appeal pending": "AppealPending",
  "Registration cancellation pending": "RegistrationCancellationPending",
  "Registration cancelled": "RegistrationCancelled",
  "Registration expired": "RegistrationExpired",
  "Registration surrendered": "RegistrationSurrendered",
  "Registered": "Registered",

}
function parseMarkCurrentStatusCode(code: string) {
  return MARK_CURRENT_STATUS_CODE[code]
}

class TradeMark {
  operationCode: string | null;
  applicationNumber: number | null;
  applicationDate: Date | null;
  registrationDate: Date | null;
  applicationLanguageCode: string | null;
  expiryDate: Date | null;
  secondLanguageCode: string | null;
  markCurrentStatusCode: string;
  markCurrentStatusCodeMilestone: number | null;
  markCurrentStatusCodeStatus: number | null;
  markCurrentStatusDate: Date;
  markFeature: string;
  wordMark: string;
  publications: Publication[] | null
  kindMark: string | null;
  tradeDistinctivenessIndicator: boolean | null;

  constructor(tradeMarkJson: any) {
    let tm = tradeMarkJson[0];
    this.operationCode = tm?.["$"]?.operationCode as OperationCode; // Insert;
    this.applicationDate = tm.ApplicationDate?.[0] != null ? new Date(tm.ApplicationDate[0]) : null;
    this.applicationNumber = (tm.ApplicationNumber?.[0] != null ?
      Number.parseInt(tm.ApplicationNumber[0]) :
      null);
    this.expiryDate = new Date(tm.ExpiryDate[0])
    this.applicationLanguageCode = tm.ApplicationLanguageCode[0].toUpperCase() as EUOfficialLanguageCode;

    this.kindMark = tm.KindMark?.[0] as KindType
    this.wordMark = tm.WordMarkSpecification[0].MarkVerbalElementText[0]
    this.tradeDistinctivenessIndicator = tm.TradeDistinctivenessIndicator?.[0] === "true"
    this.secondLanguageCode = tm.SecondLanguageCode?.[0].toUpperCase() as EMSecondLanguageCodeType
    this.registrationDate = new Date(tm.RegistrationDate[0])

    this.markCurrentStatusCode = parseMarkCurrentStatusCode(tm.MarkCurrentStatusCode[0]["_"]);
    this.markCurrentStatusCodeMilestone = tm.MarkCurrentStatusCode[0]["$"].milestone != null ?
      Number.parseInt(tm.MarkCurrentStatusCode[0]["$"].milestone) : null;


    this.markCurrentStatusCodeStatus = tm.MarkCurrentStatusCode[0]["$"].status != null ?
      Number.parseInt(tm.MarkCurrentStatusCode[0]["$"].status) : null
      ;
    this.markCurrentStatusDate = new Date(tm.MarkCurrentStatusDate[0])

    // this.markFeature = tm.MarkFeature[0];
    this.publications = tm.PublicationDetails?.[0].Publication.map((publicationNode: any) => new Publication(publicationNode))

  }
}

export { TradeMark }