import { prisma } from "@/lib/prisma"

async function main() {
  console.log("🌱 Seeding database with test data...")

  // Clear existing data
  await prisma.verificationLog.deleteMany()
  await prisma.blacklistedAccount.deleteMany()
  await prisma.foundation.deleteMany()

  // Seed verified foundations
  const foundations = await Promise.all([
    prisma.foundation.create({
      data: {
        name: "Songklanagarind for Disaster Relief (ม.อ. ทาดใหญ่)",
        accountNumber: "565-471106-1",
        bank: "Siam Commercial Bank (SCB)",
        category: "Disaster Relief",
        verified: true,
      },
    }),
    prisma.foundation.create({
      data: {
        name: "Thai Red Cross Society for Disaster",
        accountNumber: "045-3-04637-0",
        bank: "Siam Commercial Bank (SCB)",
        category: "Disaster Relief",
        verified: true,
      },
    }),
    prisma.foundation.create({
      data: {
        name: "Mirror Foundation (มูลนิธิกระจกเงา)",
        accountNumber: "507-4-10183-8",
        bank: "Siam Commercial Bank (SCB)",
        category: "Medical",
        verified: true,
      },
    }),
    prisma.foundation.create({
      data: {
        name: "Doing Good Foundation (มูลนิธิองค์กรกำกี)",
        accountNumber: "713-2-59590-3",
        bank: "Kasikorn Bank (KBank)",
        category: "Education",
        verified: true,
      },
    }),
    prisma.foundation.create({
      data: {
        name: "Hat Yai City Climate (Southern Network)",
        accountNumber: "018-1-23504-7",
        bank: "Kasikorn Bank (KBank)",
        category: "Environment",
        verified: true,
      },
    }),
  ])

  console.log(`✅ Created ${foundations.length} verified foundations`)

  // Seed blacklisted accounts
  const blacklisted = await Promise.all([
    prisma.blacklistedAccount.create({
      data: {
        accountNumber: "0999999999",
        reason: "Fake charity scam - impersonating Red Cross",
        reportedBy: "user@example.com",
      },
    }),
    prisma.blacklistedAccount.create({
      data: {
        accountNumber: "0888888888",
        reason: "Ponzi scheme disguised as disaster relief",
        reportedBy: "admin@truadboon.com",
      },
    }),
    prisma.blacklistedAccount.create({
      data: {
        accountNumber: "0777777777",
        reason: "Money laundering operation",
        reportedBy: "user@example.com",
      },
    }),
  ])

  console.log(`✅ Created ${blacklisted.length} blacklisted accounts`)

  console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
