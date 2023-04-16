/*
  Warnings:

  - You are about to alter the column `views` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "views" INTEGER NOT NULL,
    "original_upload_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "added_on" TEXT NOT NULL
);
INSERT INTO "new_videos" ("added_on", "author", "id", "original_upload_date", "title", "views") SELECT "added_on", "author", "id", "original_upload_date", "title", "views" FROM "videos";
DROP TABLE "videos";
ALTER TABLE "new_videos" RENAME TO "videos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
