/*
  Warnings:

  - Added the required column `description` to the `PLR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ebookUrls` to the `PLR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `PLR` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PLR" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'EBOOK',
    "price" REAL NOT NULL,
    "terms" TEXT NOT NULL,
    "ebookUrls" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PLR_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PLR" ("active", "courseId", "createdAt", "id", "price", "terms", "type", "updatedAt") SELECT "active", "courseId", "createdAt", "id", "price", "terms", "type", "updatedAt" FROM "PLR";
DROP TABLE "PLR";
ALTER TABLE "new_PLR" RENAME TO "PLR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
