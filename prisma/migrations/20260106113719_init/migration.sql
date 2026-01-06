-- CreateTable
CREATE TABLE "foundations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blacklisted_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountNumber" TEXT NOT NULL,
    "reportedBy" TEXT,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "verification_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "foundations_accountNumber_key" ON "foundations"("accountNumber");

-- CreateIndex
CREATE INDEX "foundations_accountNumber_idx" ON "foundations"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_accounts_accountNumber_key" ON "blacklisted_accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "blacklisted_accounts_accountNumber_idx" ON "blacklisted_accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "verification_logs_accountNumber_idx" ON "verification_logs"("accountNumber");

-- CreateIndex
CREATE INDEX "verification_logs_createdAt_idx" ON "verification_logs"("createdAt");
