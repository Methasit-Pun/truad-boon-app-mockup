/**
 * Database Seeding Script
 * Seeds initial foundation and test data
 */

const { PrismaClient, Bank } = require('@prisma/client')

const prisma = new PrismaClient()

const foundations = [
  {
    name: 'มูลนิธิมหาวิทยาลัยสงขลานครินทร์ เพื่อภัยพิบัติใหญ่',
    accountName: 'มูลนิธิมหาวิทยาลัยสงขลานครินทร์ เพื่อภัยพิบัติใหญ่',
    accountNumber: '565-471106-1',
    bank: Bank.SCB,
    category: 'Disaster Relief',
    verified: true,
  },
  {
    name: 'สภากาชาดไทย',
    accountName: 'สภากาชาดไทย เพื่อภัยพิบัติ',
    accountNumber: '045-3-04637-0',
    bank: Bank.SCB,
    category: 'Disaster Relief',
    verified: true,
  },
  {
    name: 'มูลนิธิกระจกเงา',
    accountName: 'มูลนิธิกระจกเงา',
    accountNumber: '507-4-10183-8',
    bank: Bank.SCB,
    category: 'Social Development',
    verified: true,
  },
  {
    name: 'มูลนิธิองค์กรกำกี',
    accountName: 'มูลนิธิองค์กรกำกี',
    accountNumber: '713-2-59590-3',
    bank: Bank.KBANK,
    category: 'Community Development',
    verified: true,
  },
  {
    name: 'เครือข่ายเมืองหาดใหญ่ปรับตัวรับการเปลี่ยนแปลงสภาพภูมิอากาศ',
    accountName: 'เครือข่ายเมืองหาดใหญ่',
    accountNumber: '018-1-23504-7',
    bank: Bank.KBANK,
    category: 'Climate Change',
    verified: true,
  },
]

const blacklistedAccounts = [
  {
    accountName: 'บัญชีทดสอบ มิจฉาชีพ',
    accountNumber: '999-999-9999',
    bank: Bank.OTHER,
    reason: 'ตัวอย่างบัญชีมิจฉาชีพสำหรับทดสอบ',
    reportedBy: 'System Admin',
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing data...')
    await prisma.verificationLog.deleteMany({})
    await prisma.blacklistedAccount.deleteMany({})
    await prisma.foundation.deleteMany({})
  }

  // Seed foundations
  console.log('📚 Seeding foundations...')
  for (const foundation of foundations) {
    await prisma.foundation.upsert({
      where: { accountNumber: foundation.accountNumber },
      update: foundation,
      create: foundation,
    })
  }
  console.log(`✅ Created ${foundations.length} foundations`)

  // Seed blacklisted accounts
  console.log('⚠️  Seeding blacklisted accounts...')
  for (const account of blacklistedAccounts) {
    await prisma.blacklistedAccount.upsert({
      where: { accountNumber: account.accountNumber },
      update: account,
      create: account,
    })
  }
  console.log(`✅ Created ${blacklistedAccounts.length} blacklisted accounts`)

  console.log('✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
