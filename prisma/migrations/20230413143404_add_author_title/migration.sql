-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "views" BIGINT NOT NULL,
    "upload_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL
);
