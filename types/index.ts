// Type definitions for Traudboon app

export interface VerificationResult {
  status: "safe" | "warning" | "danger"
  accountName: string
  accountNumber: string
  bank: string
  message: string
}

export interface Foundation {
  id: string
  name: string
  bank: string
  accountNumber: string
}

export interface LoadingStage {
  icon: React.ReactNode
  text: string
  duration: number
}
