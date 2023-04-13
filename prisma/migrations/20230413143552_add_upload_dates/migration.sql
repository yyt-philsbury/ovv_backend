/*
  Warnings:

  - You are about to drop the column `upload_date` on the `videos` table. All the data in the column will be lost.
  - Added the required column `added_on` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_upload_date` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "views" BIGINT NOT NULL,
    "original_upload_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "added_on" TEXT NOT NULL
);
INSERT INTO "new_videos" ("author", "id", "title", "views") SELECT "author", "id", "title", "views" FROM "videos";
DROP TABLE "videos";
ALTER TABLE "new_videos" RENAME TO "videos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
