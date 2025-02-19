/*
  Warnings:

  - Added the required column `feeAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feePercentage` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "withdrawalFee" REAL NOT NULL DEFAULT 10,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "mpesaName" TEXT NOT NULL,
    "mpesaNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "finalAmount" REAL NOT NULL,
    "feeAmount" REAL NOT NULL,
    "feePercentage" REAL NOT NULL,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "id", "mpesaName", "mpesaNumber", "notes", "processedAt", "status", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "mpesaName", "mpesaNumber", "notes", "processedAt", "status", "updatedAt", "userId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
