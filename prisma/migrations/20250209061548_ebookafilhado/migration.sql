-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "duration" INTEGER;

-- CreateTable
CREATE TABLE "PLRAffiliate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plrId" TEXT NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "earnings" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PLRAffiliate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PLRAffiliate_plrId_fkey" FOREIGN KEY ("plrId") REFERENCES "PLR" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PLRAffiliate_affiliateCode_key" ON "PLRAffiliate"("affiliateCode");

-- CreateIndex
CREATE UNIQUE INDEX "PLRAffiliate_userId_plrId_key" ON "PLRAffiliate"("userId", "plrId");
