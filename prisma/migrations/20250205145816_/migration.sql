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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PLR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PLR" ("active", "createdAt", "description", "ebookUrls", "id", "price", "terms", "thumbnailUrl", "title", "type", "updatedAt", "userId") SELECT "active", "createdAt", "description", "ebookUrls", "id", "price", "terms", "thumbnailUrl", "title", "type", "updatedAt", "userId" FROM "PLR";
DROP TABLE "PLR";
ALTER TABLE "new_PLR" RENAME TO "PLR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
