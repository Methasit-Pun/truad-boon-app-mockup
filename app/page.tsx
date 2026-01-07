"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Book,
  Loader2,
  ImageIcon,
  Search,
  Building2,
  Database,
  FileSearch,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type VerificationStatus = "safe" | "warning" | "danger"

interface VerificationResult {
  status: VerificationStatus
  accountName: string
  accountNumber: string
  bank: string
  message: string
  identifierType?: "mobile" | "taxid" | "organizationref" | "donationbox" | "reference" | "account" | "unknown"
}

type LoadingStage = {
  icon: React.ReactNode
  text: string
  duration: number
}

interface Foundation {
  id: string
  name: string
  accountNumber: string
  bank: string
  category: string
  verified: boolean
}

const loadingStages: LoadingStage[] = [
  {
    icon: <Search className="h-6 w-6" />,
    text: "กำลังอ่านข้อมูลจากรูปภาพ",
    duration: 1500,
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    text: "ตรวจสอบชื่อและที่อยู่บัญชีปลายทาง",
    duration: 1500,
  },
  {
    icon: <Shield className="h-6 w-6" />,
    text: "ตรวจข้อมูลกับมูลนิธิกว่า 200 แห่ง",
    duration: 2000,
  },
  {
    icon: <Database className="h-6 w-6" />,
    text: "คัดกรองรายชื่อเฝ้าระวังมิจฉาชีพ",
    duration: 2000,
  },
  {
    icon: <FileSearch className="h-6 w-6" />,
    text: "สรุปผลความปลอดภัย",
    duration: 1000,
  },
]

const microCopyMessages = [
  "ตรวจบุญกำลังดูแลความปลอดภัยให้คุณ",
  "รอสักครู่ เพื่อให้เงินบุญของคุณถึงมือผู้รับที่แท้จริง",
  "เรากำลังตรวจสอบข้อมูลจากแหล่งที่เชื่อถือได้ทั่วประเทศ",
]

// Verification logic moved to backend: lib/verification.ts

export default function TruadBoonApp() {
  const [activeTab, setActiveTab] = useState<"home" | "verified" | "guide">("home")
  const [accountNumber, setAccountNumber] = useState("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [showSafetyChecklist, setShowSafetyChecklist] = useState(false)
  const [safetyAnswers, setSafetyAnswers] = useState({
    foundOnSocialMedia: false,
    differentName: false,
    urgentMessage: false,
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [currentMicroCopy, setCurrentMicroCopy] = useState(0)
  const [verifiedFoundations, setVerifiedFoundations] = useState<Foundation[]>([])
  const [foundationsLoading, setFoundationsLoading] = useState(true)

  // Fetch verified foundations from database on component mount
  useEffect(() => {
    const fetchFoundations = async () => {
      try {
        const response = await fetch("/api/foundations")
        const data = await response.json()
        setVerifiedFoundations(data)
      } catch (error) {
        console.error("Failed to fetch foundations:", error)
      } finally {
        setFoundationsLoading(false)
      }
    }
    
    fetchFoundations()
  }, [])

  useEffect(() => {
    if (isAnalyzing || verificationResult) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isAnalyzing, verificationResult])

  useEffect(() => {
    if (isAnalyzing) {
      let stageTimer: NodeJS.Timeout
      let microCopyTimer: NodeJS.Timeout

      const progressStages = () => {
        if (currentStage < loadingStages.length - 1) {
          stageTimer = setTimeout(() => {
            setCurrentStage((prev) => prev + 1)
          }, loadingStages[currentStage].duration)
        }
      }

      microCopyTimer = setInterval(() => {
        setCurrentMicroCopy((prev) => (prev + 1) % microCopyMessages.length)
      }, 3000)

      progressStages()

      return () => {
        clearTimeout(stageTimer)
        clearInterval(microCopyTimer)
      }
    } else {
      setCurrentStage(0)
      setCurrentMicroCopy(0)
    }
  }, [isAnalyzing, currentStage])

  const formatAccountNumber = (input: string, identifierType?: string): string => {
    // For text references (REF.1), return as-is
    if (identifierType === "reference") {
      return input
    }
    
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "")
    
    // Format based on identifier type
    if (identifierType === "donationbox") {
      // Donation Box: 16 digits, format as xxxx-xxxx-xxxx-xxxx
      let formatted = ""
      for (let i = 0; i < Math.min(digits.length, 16); i++) {
        if (i === 4 || i === 8 || i === 12) {
          formatted += "-"
        }
        formatted += digits[i]
      }
      return formatted
    }
    
    if (identifierType === "organizationref") {
      // Organization Reference: 17 digits, format as xxxx-xxxx-xxxxx-xxxx
      let formatted = ""
      for (let i = 0; i < Math.min(digits.length, 17); i++) {
        if (i === 4 || i === 8 || i === 13) {
          formatted += "-"
        }
        formatted += digits[i]
      }
      return formatted
    }
    
    // Default: Bank account format xxx-x-xxxxx-x (10 digits max)
    let formatted = ""
    const maxDigits = 10
    
    for (let i = 0; i < Math.min(digits.length, maxDigits); i++) {
      // Add dashes at positions 3, 4, and 9
      if (i === 3 || i === 4 || i === 9) {
        formatted += "-"
      }
      formatted += digits[i]
    }
    
    return formatted
  }

  const getIdentifierLabel = (type?: string): string => {
    switch (type) {
      case "reference":
        return "หมายเลขอ้างอิง (REF.1)"
      case "donationbox":
        return "เลขบัญชีตู้ที่"
      case "mobile":
        return "เบอร์โทรศัพท์"
      case "taxid":
        return "เลขประจำตัวผู้เสียภาษีอากร"
      case "organizationref":
        return "เลขประจำตัวองค์กร"
      case "account":
      case "unknown":
      default:
        return "เลขบัญชี"
    }
  }

  const extractQRCode = async (imageFile: File): Promise<{ value: string; type: string; name?: string } | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const img = new Image()
          img.onload = async () => {
            console.log("📸 [QR Extractor] Image loaded, extracting QR code...")
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            
            console.log(`📐 [QR Extractor] Canvas size: ${canvas.width}x${canvas.height}`)
            
            const ctx = canvas.getContext("2d")
            if (!ctx) {
              console.error("❌ [QR Extractor] Failed to get canvas context")
              resolve(null)
              return
            }
            
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            
            console.log("🔍 [QR Extractor] Running jsqr on image data...")
            // Dynamically import jsqr
            const jsQR = (await import("jsqr")).default
            const code = jsQR(imageData.data, imageData.width, imageData.height)
            
            if (code?.data) {
              console.log("✅ [QR Extractor] QR code found!")
              console.log("📝 [QR Extractor] Raw QR data:", code.data)
              console.log("📝 [QR Extractor] QR data length:", code.data.length)
              
              // Check if it's a URL or text (not a payment QR)
              if (code.data.startsWith("http://") || code.data.startsWith("https://")) {
                console.warn("⚠️ [QR Extractor] QR contains URL, not a payment QR code")
                resolve(null)
                return
              }
              
              // QR code found - parse PromptPay format
              const { extractAccountFromPromptPay, parsePromptPay } = await import("@/lib/promptpay-parser")
              
              const result = extractAccountFromPromptPay(code.data)
              const parsedData = parsePromptPay(code.data)
              
              if (result.value) {
                console.log("💎 [QR Extractor] Extracted:", result.value, `(type: ${result.type})`)
                const formatted = formatAccountNumber(result.value, result.type)
                console.log("✨ [QR Extractor] Formatted:", formatted, `(type: ${result.type})`)
                resolve({ value: formatted, type: result.type, name: parsedData.name })
              } else {
                // Not PromptPay - try to extract digits as fallback
                console.warn("⚠️ [QR Extractor] Not PromptPay format, trying digit extraction...")
                const digits = code.data.replace(/\D/g, "")
                
                if (digits.length < 10) {
                  // Not enough digits for an account number
                  console.warn("❌ [QR Extractor] Not enough digits found. Raw QR:", code.data)
                  resolve(null)
                  return
                }
                
                const formatted = formatAccountNumber(digits, "unknown")
                console.log("📌 [QR Extractor] Fallback formatted account:", formatted)
                resolve({ value: formatted, type: "unknown", name: undefined })
              }
            } else {
              console.warn("❌ [QR Extractor] No QR code found in image")
              resolve(null)
            }
          }
          img.onerror = () => {
            console.error("❌ [QR Extractor] Failed to load image")
            resolve(null)
          }
          img.src = event.target?.result as string
        } catch (error) {
          console.error("❌ [QR Extractor] Error:", error)
          resolve(null)
        }
      }
      reader.onerror = () => {
        console.error("❌ [QR Extractor] Failed to read file")
        resolve(null)
      }
      reader.readAsDataURL(imageFile)
    })
  }

  const handleVerify = async () => {
    if (accountNumber.length >= 10) {
      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/verify/account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountNumber,
            bank: "Unknown",
          }),
        })

        const result = await response.json()
        setVerificationResult(result)
        setShowSafetyChecklist(result.status === "warning")
      } catch (error) {
        console.error("Verification error:", error)
        setVerificationResult({
          status: "warning",
          accountName: "Error",
          accountNumber,
          bank: "Unknown",
          message: "เกิดข้อผิดพลาดในการตรวจสอบ กรุณาลองใหม่อีกครั้ง",
        })
      }
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedFile(reader.result as string)
      }
      reader.readAsDataURL(file)

      setIsAnalyzing(true)
      try {
        // Extract QR code from image
        const extractedData = await extractQRCode(file)
        
        if (!extractedData) {
          setVerificationResult({
            status: "warning",
            accountName: "Error",
            accountNumber: "",
            bank: "Unknown",
            message: "ไม่สามารถอ่าน QR Code ได้ โปรดสแกน QR Code เงินหนุน (PromptPay) ที่ชัดเจนกว่า",
          })
          setIsAnalyzing(false)
          return
        }

        setAccountNumber(extractedData.value)

        // Send extracted account to backend for verification
        const response = await fetch("/api/verify/account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountNumber: extractedData.value,
            bank: "Unknown",
            identifierType: extractedData.type,
            merchantName: extractedData.name,
          }),
        })

        const result = await response.json()
        setVerificationResult(result)
        setShowSafetyChecklist(result.status === "warning")
      } catch (error) {
        console.error("Image verification error:", error)
        setVerificationResult({
          status: "warning",
          accountName: "Error",
          accountNumber,
          bank: "Unknown",
          message: "เกิดข้อผิดพลาดในการสแกน QR Code กรุณาลองใหม่อีกครั้ง",
        })
      }
      setIsAnalyzing(false)
    }
  }

  const handleCloseResult = () => {
    setVerificationResult(null)
    setShowSafetyChecklist(false)
    setAccountNumber("")
    setUploadedFile(null)
    setSafetyAnswers({
      foundOnSocialMedia: false,
      differentName: false,
      urgentMessage: false,
    })
  }

  const renderHome = () => (
    <div className="space-y-5 pb-24">
      <Card className="overflow-hidden shadow-md bg-white dark:bg-gray-900">
        <CardContent className="p-0">
          <Label htmlFor="file-upload">
            <div className="relative w-full py-16 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-kbank-green via-kbank-green to-emerald-600 hover:from-kbank-green/95 hover:via-kbank-green/95 hover:to-emerald-600/95 text-white cursor-pointer transition-all duration-300 hover:shadow-lg leading-7">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <ImageIcon className="relative h-20 w-20 drop-shadow-lg" />
              </div>
              <div className="text-center space-y-2">
                <span className="block text-2xl font-bold drop-shadow">อัพโหลดสลิปบริจาค</span>
                <span className="block text-base opacity-95">แตะเพื่อเลือกไฟล์รูปภาพ</span>
                <span className="block text-sm opacity-80 bg-white/10 px-4 py-1.5 rounded-full mx-auto w-fit">
                  JPG, PNG, HEIC
                </span>
              </div>
            </div>
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="อัพโหลดรูปภาพสลิป"
            disabled={isAnalyzing}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-base text-muted-foreground font-medium">หรือกรอกเอง</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <Card className="shadow-md bg-white dark:bg-gray-900">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-base font-medium text-foreground">
              เลขบัญชีปลายทาง
            </Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="xxx-x-xxxxx-x"
              value={accountNumber}
              onChange={(e) => setAccountNumber(formatAccountNumber(e.target.value))}
              className="h-14 text-lg"
              disabled={isAnalyzing}
            />
          </div>

          <Button
            size="lg"
            onClick={handleVerify}
            disabled={accountNumber.length < 10 || isAnalyzing}
            className="w-full h-14 text-lg bg-navy-blue hover:bg-navy-blue/90 text-white font-semibold transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                กำลังตรวจสอบ
              </>
            ) : (
              "ตรวจสอบเลย"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderVerifiedList = () => (
    <div className="space-y-4 pb-24">
      <div className="bg-linear-to-br from-kbank-green to-emerald-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">มูลนิธิที่ได้รับการรับรอง</h2>
        <p className="text-base opacity-95 leading-relaxed">รายการมูลนิธิที่ผ่านการตรวจสอบแล้ว สามารถบริจาคได้อย่างมั่นใจ</p>
      </div>

      {foundationsLoading ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">กำลังโหลดข้อมูล...</span>
          </CardContent>
        </Card>
      ) : verifiedFoundations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
            ไม่พบข้อมูลมูลนิธิที่ได้รับการรับรอง
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {verifiedFoundations.map((foundation) => (
            <Card
              key={foundation.id}
              className="border-2 border-kbank-green/30 hover:border-kbank-green transition-all shadow-sm hover:shadow-md"
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="h-12 w-12 rounded-full bg-kbank-green/10 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-kbank-green" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground leading-snug">{foundation.name}</h3>
                    <div className="space-y-1">
                      <p className="text-base text-muted-foreground">
                        <span className="font-medium text-foreground">บัญชี:</span> {foundation.accountNumber}
                      </p>
                      <p className="text-base text-muted-foreground">
                        <span className="font-medium text-foreground">ธนาคาร:</span> {foundation.bank}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderGuide = () => (
    <div className="space-y-6 pb-24">
      <div className="bg-linear-to-br from-navy-blue to-blue-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Book className="h-8 w-8" />
          <h2 className="text-2xl font-bold">คู่มือการใช้งาน</h2>
        </div>
        <p className="text-base opacity-95 leading-relaxed">เรียนรู้วิธีตรวจสอบและป้องกันการถูกหลอก</p>
      </div>

      <Card className="shadow-md border-2 bg-white dark:bg-gray-900">
        <CardHeader className="pb-4 bg-muted/30">
          <CardTitle className="text-xl text-navy-blue">วิธีใช้งาน ตรวจบุญ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-kbank-green text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1.5 text-foreground">อัพโหลดสลิปหรือกรอกเลขบัญชี</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                ถ่ายรูปสลิปโอนเงินหรือกรอกเลขบัญชีที่ต้องการตรวจสอบ
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-kbank-green text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1.5 text-foreground">รอระบบตรวจสอบ</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                ระบบจะตรวจสอบกับฐานข้อมูลมูลนิธิที่ได้รับการรับรองและรายชื่อมิจฉาชีพ
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-kbank-green text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1.5 text-foreground">ดูผลการตรวจสอบ</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                ระบบจะแสดงสัญญาณไฟจราจร: เขียว (ปลอดภัย), เหลือง (ระวัง), แดง (อันตราย)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-kbank-green text-white flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1.5 text-foreground">ตอบคำถามประเมินความเสี่ยง</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                หากได้สัญญาณเหลือง ระบบจะถามคำถามเพิ่มเติมเพื่อช่วยประเมินความเสี่ยง
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-2 border-danger/30 bg-white dark:bg-gray-900">
        <CardHeader className="pb-4 bg-danger/5">
          <CardTitle className="text-xl text-danger flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            สัญญาณเตือนภัย
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">พบโพสต์ใน Facebook หรือ LINE จากคนที่ไม่รู้จัก</p>
            </div>
            <div className="flex gap-3 items-start">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">ชื่อบัญชีไม่ตรงกับชื่อมูลนิธิที่ระบุในโพสต์</p>
            </div>
            <div className="flex gap-3 items-start">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">มีข้อความเร่งด่วน "โอนเลย" "ด่วนมาก" "เหลือเวลาไม่มาก"</p>
            </div>
            <div className="flex gap-3 items-start">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">บัญชีเป็นบัญชีส่วนตัว ไม่ใช่บัญชีองค์กร</p>
            </div>
            <div className="flex gap-3 items-start">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">ไม่มีข้อมูลสำนักงาน เบอร์โทรศัพท์ หรือเว็บไซต์อย่างเป็นทางการ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-2 border-kbank-green/30 bg-white dark:bg-gray-900">
        <CardHeader className="pb-4 bg-kbank-green/5">
          <CardTitle className="text-xl text-kbank-green flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            คำแนะนำในการบริจาค
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-kbank-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">บริจาคผ่านช่องทางอย่างเป็นทางการของมูลนิธิเท่านั้น</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-kbank-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">ตรวจสอบข้อมูลมูลนิธิจากเว็บไซต์หรือโทรศัพท์อย่างเป็นทางการ</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-kbank-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">ใช้แอป ตรวจบุญ ตรวจสอบทุกครั้งก่อนโอนเงิน</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-kbank-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">หากสงสัย ให้ปรึกษาลูกหลานหรือคนในครอบครัวก่อน</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 bg-linear-to-r from-navy-blue to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8" />
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">ตรวจบุญ</h1>
              <p className="text-xs opacity-90 font-medium">ตรวจสอบความปลอดภัยในการบริจาค</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        {activeTab === "home" && renderHome()}
        {activeTab === "verified" && renderVerifiedList()}
        {activeTab === "guide" && renderGuide()}
      </main>

      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md mx-4 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <Card className="border-2 border-kbank-green shadow-2xl bg-white dark:bg-gray-900">
              <CardContent className="py-10">
                <div className="flex flex-col items-center gap-6">
                  {uploadedFile && (
                    <div className="w-full max-w-xs animate-in fade-in duration-300">
                      <div className="relative">
                        <img
                          src={uploadedFile || "/placeholder.svg"}
                          alt="สลิปที่อัพโหลด"
                          className="w-full h-48 object-cover rounded-lg border-2 border-kbank-green/30 shadow-md"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-lg flex items-end justify-center pb-3">
                          <span className="text-white text-sm font-medium px-3 py-1.5 bg-black/40 rounded-full backdrop-blur-sm">
                            เลขบัญชี: {accountNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-kbank-green/20"></div>
                    <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-t-kbank-green border-r-kbank-green border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-kbank-green animate-pulse">
                      {loadingStages[currentStage].icon}
                    </div>
                  </div>

                  <div className="text-center space-y-3 min-h-20">
                    <p
                      className="text-xl font-semibold text-navy-blue animate-in fade-in slide-in-from-bottom-2 duration-300"
                      key={currentStage}
                    >
                      {loadingStages[currentStage].text}
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      {loadingStages.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index <= currentStage ? "w-8 bg-kbank-green" : "w-1.5 bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p
                      className="text-sm text-muted-foreground leading-relaxed max-w-sm px-4 animate-in fade-in duration-500"
                      key={`micro-${currentMicroCopy}`}
                    >
                      {microCopyMessages[currentMicroCopy]}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={`dot-${i}`}
                        className="h-2 w-2 rounded-full bg-kbank-green animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {verificationResult && !isAnalyzing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden" onClick={handleCloseResult}>
          <div className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in slide-in-from-bottom-8 duration-700" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseResult()
                }}
                className="absolute top-4 right-4 z-[70] h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors border-2 border-gray-200 cursor-pointer"
                aria-label="ปิด"
                type="button"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              <Card
                className={`border-2 shadow-2xl bg-white dark:bg-gray-900 mb-8 ${
                  verificationResult.status === "safe"
                    ? "border-kbank-green"
                    : verificationResult.status === "warning"
                      ? "border-warning"
                      : "border-danger"
                } animate-in zoom-in slide-in-from-bottom-8 duration-500`}
              >
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div
                        className={`h-24 w-24 rounded-full flex items-center justify-center shadow-lg ${
                          verificationResult.status === "safe"
                            ? "bg-kbank-green text-white"
                            : verificationResult.status === "warning"
                              ? "bg-warning text-white"
                              : "bg-danger text-white"
                        } animate-in zoom-in duration-700`}
                      >
                        {verificationResult.status === "safe" ? (
                          <CheckCircle2 className="h-14 w-14" />
                        ) : verificationResult.status === "warning" ? (
                          <AlertTriangle className="h-14 w-14" />
                        ) : (
                          <XCircle className="h-14 w-14" />
                        )}
                      </div>
                    </div>

                    <div className="text-center space-y-3 w-full">
                      <h3
                        className={`text-2xl font-bold ${
                          verificationResult.status === "safe"
                            ? "text-kbank-green"
                            : verificationResult.status === "warning"
                              ? "text-warning"
                              : "text-danger"
                        }`}
                      >
                        {verificationResult.status === "safe"
                          ? "ปลอดภัย"
                          : verificationResult.status === "warning"
                            ? "ระวัง"
                            : "อันตราย!"}
                      </h3>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 space-y-2.5 text-left border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">ชื่อบัญชี</p>
                          <p className="text-base font-semibold text-foreground">{verificationResult.accountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{getIdentifierLabel(verificationResult.identifierType)}</p>
                          <p className="text-base font-semibold text-foreground">{verificationResult.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">ธนาคาร</p>
                          <p className="text-base font-semibold text-foreground">{verificationResult.bank}</p>
                        </div>
                      </div>

                      <div
                        className={`p-5 rounded-lg ${
                          verificationResult.status === "safe"
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
                            : verificationResult.status === "warning"
                              ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700"
                              : "bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700"
                        }`}
                      >
                        <p className="text-base leading-relaxed text-foreground font-medium">
                          {verificationResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {verificationResult.status === "danger" && (
                <Card className="border-2 border-danger shadow-2xl mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-4 bg-danger/5">
                    <CardTitle className="text-xl text-danger flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-danger" />
                      บัญชีนี้ถูกรายงานว่าเป็นมิจฉาชีพ
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">โปรดอย่าโอนเงินไปยังบัญชีนี้</p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="p-4 bg-danger/10 border-l-4 border-danger rounded space-y-2">
                      <p className="font-semibold text-foreground">ว่าด้วยการรายงาน:</p>
                      <p className="text-sm text-foreground leading-relaxed">{verificationResult.message}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 leading-relaxed">
                        💡 หากคุณพบบัญชีนี้ในการอื่นๆ หรือต้องการรายงานการหลอกลวง กรุณาติดต่อเราเพื่อให้ข้อมูลเพิ่มเติม
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showSafetyChecklist && (
                <Card className="border-2 border-warning shadow-2xl mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-4 bg-warning/5">
                    <CardTitle className="text-xl text-navy-blue flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-warning" />
                      ประเมินความเสี่ยงเพิ่มเติม
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">ตอบคำถามเพื่อช่วยประเมินความปลอดภัย</p>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label className="text-base leading-relaxed font-medium">
                        1. พบโพสต์นี้ใน Facebook หรือ LINE หรือไม่?
                      </Label>
                      <div className="flex gap-3">
                        <Button
                          size="lg"
                          variant={safetyAnswers.foundOnSocialMedia ? "default" : "outline"}
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, foundOnSocialMedia: true })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            safetyAnswers.foundOnSocialMedia ? "bg-navy-blue" : ""
                          }`}
                        >
                          พบ
                        </Button>
                        <Button
                          size="lg"
                          variant={
                            !safetyAnswers.foundOnSocialMedia && safetyAnswers.foundOnSocialMedia !== undefined
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, foundOnSocialMedia: false })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            !safetyAnswers.foundOnSocialMedia && safetyAnswers.foundOnSocialMedia !== undefined
                              ? "bg-navy-blue"
                              : ""
                          }`}
                        >
                          ไม่พบ
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base leading-relaxed font-medium">2. ชื่อบัญชีต่างจากชื่อมูลนิธิที่โพสต์หรือไม่?</Label>
                      <div className="flex gap-3">
                        <Button
                          size="lg"
                          variant={safetyAnswers.differentName ? "default" : "outline"}
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, differentName: true })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            safetyAnswers.differentName ? "bg-navy-blue" : ""
                          }`}
                        >
                          ต่างกัน
                        </Button>
                        <Button
                          size="lg"
                          variant={
                            !safetyAnswers.differentName && safetyAnswers.differentName !== undefined
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, differentName: false })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            !safetyAnswers.differentName && safetyAnswers.differentName !== undefined
                              ? "bg-navy-blue"
                              : ""
                          }`}
                        >
                          เหมือนกัน
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base leading-relaxed font-medium">
                        3. โพสต์มีข้อความเร่งด่วนหรือขู่ว่าจะปิดบัญชีหรือไม่?
                      </Label>
                      <div className="flex gap-3">
                        <Button
                          size="lg"
                          variant={safetyAnswers.urgentMessage ? "default" : "outline"}
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, urgentMessage: true })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            safetyAnswers.urgentMessage ? "bg-navy-blue" : ""
                          }`}
                        >
                          มี
                        </Button>
                        <Button
                          size="lg"
                          variant={
                            !safetyAnswers.urgentMessage && safetyAnswers.urgentMessage !== undefined
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSafetyAnswers({ ...safetyAnswers, urgentMessage: false })}
                          className={`flex-1 h-12 text-base font-medium transition-all ${
                            !safetyAnswers.urgentMessage && safetyAnswers.urgentMessage !== undefined
                              ? "bg-navy-blue"
                              : ""
                          }`}
                        >
                          ไม่มี
                        </Button>
                      </div>
                    </div>

                    {(safetyAnswers.foundOnSocialMedia ||
                      safetyAnswers.differentName ||
                      safetyAnswers.urgentMessage) && (
                      <div className="p-5 bg-white dark:bg-gray-900 border-2 border-danger rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                        <p className="text-base font-semibold text-danger leading-relaxed">
                          ⚠️ ระดับความเสี่ยงสูง! มีสัญญาณของการหลอกลวง กรุณาตรวจสอบเพิ่มเติมหรือติดต่อมูลนิธิโดยตรง
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40" style={verificationResult ? { pointerEvents: 'none' } : {}}>
        <div className="container mx-auto px-2 max-w-2xl">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 ${
                activeTab === "home"
                  ? "text-kbank-green bg-kbank-green/10 rounded-lg"
                  : "text-gray-600 hover:text-kbank-green hover:bg-gray-50 rounded-lg"
              }`}
            >
              <Shield className="h-7 w-7 mb-1" />
              <span className="text-sm font-semibold">ตรวจสอบ</span>
            </button>

            <button
              onClick={() => setActiveTab("verified")}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 ${
                activeTab === "verified"
                  ? "text-kbank-green bg-white rounded-lg"
                  : "text-gray-600 hover:text-kbank-green hover:bg-gray-50 rounded-lg"
              }`}
            >
              <CheckCircle2 className="h-7 w-7 mb-1" />
              <span className="text-sm font-semibold">มูลนิธิ</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 ${
                activeTab === "guide"
                  ? "text-kbank-green bg-kbank-green/10 rounded-lg"
                  : "text-gray-600 hover:text-kbank-green hover:bg-gray-50 rounded-lg"
              }`}
            >
              <Book className="h-7 w-7 mb-1" />
              <span className="text-sm font-semibold">คู่มือ</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
