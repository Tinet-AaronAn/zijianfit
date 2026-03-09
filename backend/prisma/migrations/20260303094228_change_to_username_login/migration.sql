/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exercises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 1,
    "reps" INTEGER NOT NULL DEFAULT 1,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "weight" TEXT NOT NULL DEFAULT '',
    "restSeconds" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "videoSource" TEXT NOT NULL DEFAULT 'custom',
    "videoAuthor" TEXT NOT NULL DEFAULT '',
    "videoDuration" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "muscleGroup" TEXT NOT NULL DEFAULT '',
    "speed" TEXT NOT NULL DEFAULT '',
    "heartRate" TEXT NOT NULL DEFAULT '',
    "pattern" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exercises_dayPlanId_fkey" FOREIGN KEY ("dayPlanId") REFERENCES "day_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("createdAt", "dayPlanId", "description", "duration", "heartRate", "id", "muscleGroup", "name", "order", "pattern", "reps", "restSeconds", "sets", "speed", "type", "updatedAt", "videoUrl", "weight") SELECT "createdAt", "dayPlanId", "description", "duration", "heartRate", "id", "muscleGroup", "name", "order", "pattern", "reps", "restSeconds", "sets", "speed", "type", "updatedAt", "videoUrl", "weight" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE INDEX "exercises_dayPlanId_order_idx" ON "exercises"("dayPlanId", "order");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "openid" TEXT,
    "phone" TEXT,
    "nickname" TEXT,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar", "createdAt", "id", "nickname", "openid", "phone", "updatedAt") SELECT "avatar", "createdAt", "id", "nickname", "openid", "phone", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_openid_key" ON "users"("openid");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
