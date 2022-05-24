-- CreateEnum
CREATE TYPE "KindType" AS ENUM ('Individual', 'Collective', 'EUCertificate');

-- CreateEnum
CREATE TYPE "OperationCode" AS ENUM ('Insert', 'Delete');

-- CreateEnum
CREATE TYPE "MarkCurrentStatusCodeStatus" AS ENUM ('ApplicationFiled', 'ApplicationPublished', 'ApplicationRefused', 'ApplicationUnderExamination', 'ApplicationWithdrawn', 'RegistrationPending', 'ApplicationOpposed', 'AppealPending', 'RegistrationCancellationPending', 'RegistrationCancelled', 'RegistrationExpired', 'RegistrationSurrendered', 'Registered');

-- CreateEnum
CREATE TYPE "EUOfficialLanguageCode" AS ENUM ('BG', 'CS', 'DA', 'DE', 'EL', 'EN', 'ES', 'ET', 'FI', 'FR', 'HR', 'HU', 'IT', 'LT', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SL', 'SV');

-- CreateEnum
CREATE TYPE "PublicationSectionType" AS ENUM ('A_1', 'A_2', 'A_2_1', 'A_2_1_1', 'A_2_1_2', 'A_2_2', 'A_2_3', 'A_2_4_1', 'A_2_4_2', 'A_2_5_1', 'A_2_5_2', 'B_1', 'B_2', 'B_3', 'B_4_1', 'B_4_2', 'C_1_1', 'C_1_2', 'C_1_3', 'C_1_4', 'C_2_1', 'C_2_2', 'C_2_3', 'C_2_4', 'C_3_1', 'C_3_2', 'C_3_4', 'C_3_5', 'C_3_6', 'C_3_7', 'C_3_8_1', 'C_3_8_2', 'C_4_1', 'C_4_2', 'C_4_3', 'C_4_4', 'C_4_5', 'C_5_1', 'C_5_2', 'C_5_3', 'C_5_4', 'C_6_1', 'C_6_2', 'C_6_3', 'C_7_1', 'C_7_2', 'C_7_3', 'C_8_1', 'C_8_2', 'C_9_1', 'C_9_2', 'C_9_3', 'C_9_4', 'C_10_1', 'C_10_2', 'D_1', 'D_2_1', 'D_2_2', 'E_1', 'E_2_1', 'E_2_2', 'E_3', 'E_4_1', 'E_4_2', 'E_5_1', 'E_5_2', 'E_6_1', 'E_6_2', 'F_1', 'F_2_1', 'F_2_2');

-- CreateEnum
CREATE TYPE "EMSecondLanguageCodeType" AS ENUM ('EN', 'ES', 'FR', 'DE', 'IT');

-- CreateTable
CREATE TABLE "TradeMark" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "operationCode" "OperationCode" NOT NULL,
    "applicationDate" DATE NOT NULL,
    "applicationNumber" INTEGER NOT NULL,
    "expiryDate" DATE,
    "applicationLanguageCode" "EUOfficialLanguageCode",
    "kindMark" "KindType",
    "wordMark" TEXT NOT NULL,
    "tradeDistinctivenessIndicator" BOOLEAN,
    "secondLanguageCode" "EMSecondLanguageCodeType",
    "markCurrentStatusCode" "MarkCurrentStatusCodeStatus" NOT NULL,
    "markCurrentStatusCodeMilestone" INTEGER,
    "markCurrentStatusCodeStatus" INTEGER,

    CONSTRAINT "TradeMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsService" (
    "id" SERIAL NOT NULL,
    "tradeMarkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassDescription" (
    "id" SERIAL NOT NULL,
    "classNumber" INTEGER NOT NULL,
    "goodsServiceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsServiceDescription" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "languageCode" VARCHAR(10) NOT NULL,
    "classDescriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsServiceDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" SERIAL NOT NULL,
    "publicationDate" DATE NOT NULL,
    "publicationIdentifier" VARCHAR(50) NOT NULL,
    "publicationPage" INTEGER,
    "tradeMarkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoodsService" ADD CONSTRAINT "GoodsService_tradeMarkId_fkey" FOREIGN KEY ("tradeMarkId") REFERENCES "TradeMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassDescription" ADD CONSTRAINT "ClassDescription_goodsServiceId_fkey" FOREIGN KEY ("goodsServiceId") REFERENCES "GoodsService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsServiceDescription" ADD CONSTRAINT "GoodsServiceDescription_classDescriptionId_fkey" FOREIGN KEY ("classDescriptionId") REFERENCES "ClassDescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_tradeMarkId_fkey" FOREIGN KEY ("tradeMarkId") REFERENCES "TradeMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
