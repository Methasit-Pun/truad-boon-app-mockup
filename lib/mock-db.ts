// Mock in-memory database for testing without Prisma setup issues
// This allows us to test the API without waiting for Prisma to download engines

interface Foundation {
  id: string
  name: string
  accountNumber: string
  bank: string
  category: string
  verified: boolean
}

interface BlacklistedAccount {
  id: string
  accountNumber: string
  reportedBy?: string
  reason?: string
}

class MockDatabase {
  private foundations: Map<string, Foundation> = new Map()
  private blacklisted: Map<string, BlacklistedAccount> = new Map()
  private logs: any[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Verified foundations
    const foundationsData = [
      {
        id: "f1",
        name: "Songklanagarind for Disaster Relief (ม.อ. ทาดใหญ่)",
        accountNumber: "565-471106-1",
        bank: "Siam Commercial Bank (SCB)",
        category: "Disaster Relief",
        verified: true,
      },
      {
        id: "f2",
        name: "Thai Red Cross Society for Disaster",
        accountNumber: "045-3-04637-0",
        bank: "Siam Commercial Bank (SCB)",
        category: "Disaster Relief",
        verified: true,
      },
      {
        id: "f3",
        name: "Mirror Foundation (มูลนิธิกระจกเงา)",
        accountNumber: "507-4-10183-8",
        bank: "Siam Commercial Bank (SCB)",
        category: "Medical",
        verified: true,
      },
      {
        id: "f4",
        name: "Doing Good Foundation (มูลนิธิองค์กรกำกี)",
        accountNumber: "713-2-59590-3",
        bank: "Kasikorn Bank (KBank)",
        category: "Education",
        verified: true,
      },
      {
        id: "f5",
        name: "Hat Yai City Climate (Southern Network)",
        accountNumber: "018-1-23504-7",
        bank: "Kasikorn Bank (KBank)",
        category: "Environment",
        verified: true,
      },
    ]

    foundationsData.forEach((f) => {
      this.foundations.set(f.accountNumber, f)
    })

    // Blacklisted accounts
    const blacklistedData = [
      {
        id: "b1",
        accountNumber: "0999999999",
        reportedBy: "user@example.com",
        reason: "Fake charity scam - impersonating Red Cross",
      },
      {
        id: "b2",
        accountNumber: "0888888888",
        reportedBy: "admin@truadboon.com",
        reason: "Ponzi scheme disguised as disaster relief",
      },
      {
        id: "b3",
        accountNumber: "0777777777",
        reportedBy: "user@example.com",
        reason: "Money laundering operation",
      },
    ]

    blacklistedData.forEach((b) => {
      this.blacklisted.set(b.accountNumber, b)
    })
  }

  getFoundationByAccount(accountNumber: string): Foundation | undefined {
    const cleaned = accountNumber.replace(/[-\s]/g, "")
    for (const [, foundation] of this.foundations) {
      const cleanedFoundation = foundation.accountNumber.replace(/[-\s]/g, "")
      if (cleanedFoundation === cleaned) {
        return foundation
      }
    }
    return undefined
  }

  getBlacklistedByAccount(accountNumber: string): BlacklistedAccount | undefined {
    const cleaned = accountNumber.replace(/[-\s]/g, "")
    for (const [key, account] of this.blacklisted) {
      const cleanedKey = key.replace(/[-\s]/g, "")
      if (cleanedKey === cleaned) {
        return account
      }
    }
    return undefined
  }

  getAllFoundations(): Foundation[] {
    return Array.from(this.foundations.values())
  }

  addLog(log: any) {
    this.logs.push({ ...log, id: `log-${Date.now()}`, createdAt: new Date() })
  }

  getLogs(days: number = 7, status?: string) {
    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - days)

    return this.logs.filter((log) => {
      if (log.createdAt < dateFilter) return false
      if (status && log.status !== status) return false
      return true
    })
  }
}

export const mockDb = new MockDatabase()
