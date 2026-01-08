-- Traudboon Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/dshqblrdldpndfbdzgnw/sql

-- Create Bank enum
CREATE TYPE "Bank" AS ENUM (
  'PROMPTPAY',
  'KBANK',
  'SCB',
  'BBL',
  'KTB',
  'BAY',
  'TMB',
  'CIMB',
  'TISCO',
  'UOB',
  'GSB',
  'BAAC',
  'OTHER'
);

-- Create Foundation table (Confirmed/Verified accounts)
CREATE TABLE "foundations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL UNIQUE,
  "accountName" TEXT NOT NULL,
  "bank" "Bank" NOT NULL,
  "category" TEXT NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create BlacklistedAccount table (Scam alerts)
CREATE TABLE "blacklisted_accounts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountNumber" TEXT NOT NULL UNIQUE,
  "accountName" TEXT NOT NULL,
  "bank" "Bank" NOT NULL,
  "reportedBy" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create VerificationLog table (Audit trail)
CREATE TABLE "verification_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountNumber" TEXT NOT NULL,
  "accountName" TEXT,
  "bank" "Bank",
  "status" TEXT NOT NULL,
  "userId" TEXT,
  "source" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX "foundations_accountNumber_idx" ON "foundations"("accountNumber");
CREATE INDEX "foundations_bank_idx" ON "foundations"("bank");

CREATE INDEX "blacklisted_accounts_accountNumber_idx" ON "blacklisted_accounts"("accountNumber");
CREATE INDEX "blacklisted_accounts_bank_idx" ON "blacklisted_accounts"("bank");

CREATE INDEX "verification_logs_accountNumber_idx" ON "verification_logs"("accountNumber");
CREATE INDEX "verification_logs_createdAt_idx" ON "verification_logs"("createdAt");

-- Insert some sample data for testing (optional)
-- Foundation examples
INSERT INTO "foundations" ("id", "name", "accountNumber", "accountName", "bank", "category", "verified") VALUES
  ('found_1', 'Thai Red Cross Society', '001-1-00001-0', 'สภากาชาดไทย', 'KBANK', 'Disaster Relief', true),
  ('found_2', 'Ramathibodi Foundation', '123-4-56789-0', 'มูลนิธิโรงพยาบาลรามาธิบดี', 'SCB', 'Medical', true),
  ('found_3', 'Mirror Foundation', '0891234567', 'มูลนิธิกระจกเงา', 'PROMPTPAY', 'Education', true);

-- Blacklisted account examples
INSERT INTO "blacklisted_accounts" ("id", "accountNumber", "accountName", "bank", "reportedBy", "reason") VALUES
  ('black_1', '999-9-99999-9', 'นายโกง ทุจริต', 'BBL', 'user_001', 'Confirmed scam - fake donation drive'),
  ('black_2', '0888888888', 'มูลนิธิปลอม', 'PROMPTPAY', 'user_002', 'Impersonating legitimate foundation');
