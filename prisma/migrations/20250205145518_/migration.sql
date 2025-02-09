/*
  Warnings:

  - You are about to drop the column `courseId` on the `PLR` table. All the data in the column will be lost.
  - Added the required column `userId` to the `PLR` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PLR" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'EBOOK',
    "price" REAL NOT NULL,
    "terms" TEXT NOT NULL,
    "ebookUrls" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PLR" ("active", "createdAt", "description", "ebookUrls", "id", "price", "terms", "thumbnailUrl", "title", "type", "updatedAt") SELECT "active", "createdAt", "description", "ebookUrls", "id", "price", "terms", "thumbnailUrl", "title", "type", "updatedAt" FROM "PLR";
DROP TABLE "PLR";
ALTER TABLE "new_PLR" RENAME TO "PLR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
