-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "views" INTEGER NOT NULL,
    "original_upload_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "added_on" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
