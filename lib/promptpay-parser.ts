/**
 * Thai PromptPay QR Code Parser
 * Parses EMV QR Code format used by Thai PromptPay
 * 
 * PromptPay QR structure:
 * - Tag 00: Payload Format Indicator (01)
 * - Tag 01: Point of Initiation Method (11=static, 12=dynamic)
 * - Tag 26: Merchant Account Information (contains account/phone)
 *   - 00: Globally Unique Identifier (PromptPay = A000000677010111)
 *   - 01: Proxy Type (01=Mobile, 02=Tax ID, 03=E-wallet)
 *   - 02: Proxy Value (phone/tax id/account)
 * - Tag 52: Merchant Category Code
 * - Tag 53: Transaction Currency (764 = THB)
 * - Tag 54: Transaction Amount
 * - Tag 58: Country Code (TH)
 * - Tag 59: Merchant Name
 * - Tag 60: Merchant City
 * - Tag 62: Additional Data Field Template
 */

export interface PromptPayData {
  accountNumber?: string
  phoneNumber?: string
  taxId?: string
  organizationReference?: string // 17-digit ORN for government/organizations
  donationBoxAccount?: string // 16-digit donation box account
  referenceNumber?: string // Text reference like DIABETQR
  name?: string
  amount?: number
  currency?: string
  country?: string
  proxyType?: string // readable: mobile, taxid, ewallet, organizationref, donationbox, reference
  proxyTypeCode?: string // raw code: 01, 02, 03, 04, 09
  raw?: string
}

/**
 * Parse Thai PromptPay QR code data
 * @param qrData - Raw QR code data (usually starts with "00020126")
 * @returns Parsed PromptPay information
 */
export function parsePromptPay(qrData: string): PromptPayData {
  const result: PromptPayData = {
    raw: qrData,
  }

  console.log("🔍 [PromptPay Parser] Raw QR Data:", qrData)
  console.log("📏 [PromptPay Parser] QR Data Length:", qrData.length)

  try {
    // Parse TLV (Tag-Length-Value) format
    let index = 0
    while (index < qrData.length) {
      const tag = qrData.substring(index, index + 2)
      const length = parseInt(qrData.substring(index + 2, index + 4), 10)

      if (isNaN(length)) {
        console.log("⚠️ [PromptPay Parser] Invalid length at index:", index)
        break
      }

      const value = qrData.substring(index + 4, index + 4 + length)
      index += 4 + length

      console.log(`🏷️ [PromptPay Parser] Tag ${tag} (length: ${length}):`, value)

      switch (tag) {
        case "26": // Merchant Account Information (standard)
        case "30": // Merchant Account Information (alternate)
          console.log(`💳 [PromptPay Parser] Found Merchant Account Information (tag ${tag})`)
          parseMerchantInfo(value, result)
          break

        case "54": // Transaction Amount
          result.amount = parseFloat(value)
          console.log("💰 [PromptPay Parser] Amount:", result.amount)
          break

        case "53": // Currency Code
          result.currency = value === "764" ? "THB" : value
          console.log("💵 [PromptPay Parser] Currency:", result.currency)
          break

        case "58": // Country Code
          result.country = value
          console.log("🌍 [PromptPay Parser] Country:", result.country)
          break

        case "59": // Merchant Name
          result.name = value
          console.log("👤 [PromptPay Parser] Merchant Name:", result.name)
          break

        case "62": // Additional Data
          console.log("📝 [PromptPay Parser] Found Additional Data")
          parseAdditionalData(value, result)
          break
      }
    }
  } catch (error) {
    console.error("❌ [PromptPay Parser] Error parsing PromptPay data:", error)
  }

  console.log("✅ [PromptPay Parser] Parsed Result:", result)
  return result
}

/**
 * Parse merchant account information (tag 26)
 * Contains PromptPay proxy information
 */
function parseMerchantInfo(data: string, result: PromptPayData) {
  console.log("🔎 [Merchant Info Parser] Raw data:", data)
  console.log("🔎 [Merchant Info Parser] Data length:", data.length)
  console.log("🔎 [Merchant Info Parser] Data bytes:", [...data].map((c, i) => `${i}: ${c}`).join(", "))
  
  let index = 0
  let currentProxyType = ""
  
  while (index < data.length) {
    const tag = data.substring(index, index + 2)
    const lengthStr = data.substring(index + 2, index + 4)
    const length = parseInt(lengthStr, 10)

    console.log(`   [index ${index}] tag=${tag}, lengthStr='${lengthStr}', length=${length}`)

    if (isNaN(length) || length <= 0) {
      console.log("⚠️ [Merchant Info Parser] Invalid length at index:", index, "lengthStr:", lengthStr)
      break
    }

    const value = data.substring(index + 4, index + 4 + length)
    index += 4 + length

    console.log(`🏷️ [Merchant Info] Tag ${tag} (length: ${length}): "${value}"`)

    switch (tag) {
      case "00": // Globally Unique Identifier
        console.log("🆔 [Merchant Info] GUID:", value)
        if (value.startsWith("A0000006770101")) {
          console.log("✨ [Merchant Info] Confirmed PromptPay GUID")
        }
        break

      case "01": // Proxy Type
        currentProxyType = value
        // Validate proxy type code - should be 1 or 2 characters
        if (value.length <= 2) {
          result.proxyTypeCode = value
          result.proxyType = getProxyType(value)
          console.log("📱 [Merchant Info] Proxy Type code:", value, "=>", result.proxyType)
        } else {
          console.warn("⚠️ [Merchant Info] Proxy Type code seems malformed (too long):", value, "- taking first 2 chars only")
          const cleanCode = value.substring(0, 2)
          result.proxyTypeCode = cleanCode
          result.proxyType = getProxyType(cleanCode)
          console.log("📱 [Merchant Info] Cleaned Proxy Type code:", cleanCode, "=>", result.proxyType)
        }
        break

      case "02": // Proxy Value (account/phone/tax id/org ref)
        console.log("💎 [Merchant Info] Proxy Value:", value, "Type:", currentProxyType)
        assignProxyValue(value, result.proxyType || getProxyType(currentProxyType), currentProxyType, result)
        break
    }
  }
  
  console.log("✅ [Merchant Info] Parsing complete. Result:", { phoneNumber: result.phoneNumber, taxId: result.taxId, accountNumber: result.accountNumber })
}

/**
 * Parse additional data field (tag 62)
 * Often contains bill number and reference
 */
function parseAdditionalData(data: string, result: PromptPayData) {
  let index = 0
  while (index < data.length) {
    const tag = data.substring(index, index + 2)
    const length = parseInt(data.substring(index + 2, index + 4), 10)

    if (isNaN(length)) break

    const value = data.substring(index + 4, index + 4 + length)
    index += 4 + length

    // Tag 07 = Bill Number
    // Tag 08 = Mobile Number
    // etc.
  }
}

/**
 * Convert proxy type code to readable format
 * 01 = Mobile phone
 * 02 = Tax ID (13 digits)
 * 03 = E-wallet
 * 04 = Organization Reference Number (17 digits)
 * 09 = REF.1 (text reference like DIABETQR)
 */
function getProxyType(code: string): string {
  const types: { [key: string]: string } = {
    "01": "mobile",
    "02": "taxid",
    "03": "ewallet",
    "04": "organizationref",
    "09": "reference",
  }
  return types[code] || `unknown(${code})`
}

/**
 * Assign proxy value (account/phone/tax id/organization ref/donation box/reference) based on type and length
 * Also tracks the length to distinguish between similar formats
 */
function assignProxyValue(
  value: string,
  proxyType: string | undefined,
  proxyTypeCode: string,
  result: PromptPayData
) {
  const valueLength = value.replace(/\D/g, "").length
  const hasDigits = /\d/.test(value)
  
  console.log(`   → assignProxyValue(value="${value}", length=${valueLength}, hasDigits=${hasDigits}, proxyType="${proxyType}", code="${proxyTypeCode}")`)
  
  // REF.1 reference (text) - type 09
  if (proxyType === "reference" || proxyTypeCode === "09") {
    result.referenceNumber = value
    console.log(`   → SET referenceNumber = "${value}" (REF.1 text reference)`)
    return
  }
  
  // Smart detection: determine actual type based on length rather than just proxy type
  if (valueLength === 16) {
    result.donationBoxAccount = value
    console.log(`   → SET donationBoxAccount = "${value}" (${valueLength} digits - donation box)`)
  } else if (valueLength === 17) {
    result.organizationReference = value
    console.log(`   → SET organizationReference = "${value}" (${valueLength} digits)`)
  } else if (valueLength === 13) {
    result.taxId = value
    console.log(`   → SET taxId = "${value}" (${valueLength} digits)`)
  } else if (valueLength === 10 && value.replace(/\D/g, "").startsWith("0")) {
    result.phoneNumber = value
    console.log(`   → SET phoneNumber = "${value}" (${valueLength} digits, starts with 0)`)
  } else if (proxyType === "mobile") {
    result.phoneNumber = value
    console.log(`   → SET phoneNumber (explicit mobile) = "${value}" (${valueLength} digits)`)
  } else if (proxyType === "taxid") {
    result.taxId = value
    console.log(`   → SET taxId (explicit) = "${value}" (${valueLength} digits)`)
  } else if (proxyType === "ewallet") {
    result.accountNumber = value
    console.log(`   → SET accountNumber (ewallet) = "${value}" (${valueLength} digits)`)
  } else if (proxyType === "organizationref") {
    result.organizationReference = value
    console.log(`   → SET organizationReference (explicit) = "${value}" (${valueLength} digits)`)
  } else if (!hasDigits && value.length > 0) {
    // Text value with no digits - treat as reference
    result.referenceNumber = value
    console.log(`   → SET referenceNumber (text fallback) = "${value}"`)
  } else {
    // Default: treat as account number
    const cleaned = value.replace(/\D/g, "").substring(0, 16)
    result.accountNumber = cleaned
    console.log(`   → SET accountNumber (default) = "${cleaned}" (from "${value}", ${valueLength} digits)`)
  }
}

/**
 * Extract identifier from PromptPay data
 * Returns in priority order:
 * 1. REF.1 Reference (text like DIABETQR)
 * 2. Donation Box Account (16 digits)
 * 3. Organization Reference (17 digits) - for government/organizations
 * 4. Phone number (10 digits starting with 0)
 * 5. Tax ID (13 digits)
 * 6. Account number (10 digits)
 * 
 * Also returns the type so caller knows which identifier was extracted
 */
export function extractAccountFromPromptPay(qrData: string): { value: string | null; type: string } {
  console.log("🚀 [Extract Account] Starting extraction from:", qrData.substring(0, 50) + "...")
  const data = parsePromptPay(qrData)

  console.log("📊 [Extract Account] Parsed data:", data)
  console.log("📋 [Extract Account] Proxy Type Code:", data.proxyTypeCode)

  // REF.1 Reference (text) - priority 1
  if (data.referenceNumber) {
    console.log("📌 [Extract Account] Found reference number:", data.referenceNumber, "(REF.1)")
    return { value: data.referenceNumber, type: "reference" }
  }

  // Donation Box Account (16 digits) - priority 2
  if (data.donationBoxAccount) {
    const cleaned = data.donationBoxAccount.replace(/\D/g, "")
    if (cleaned.length === 16) {
      console.log("📦 [Extract Account] Found donation box account:", data.donationBoxAccount, "→", cleaned, `(${cleaned.length} digits)`)
      return { value: cleaned, type: "donationbox" }
    }
  }

  // Organization Reference (17 digits) - priority 3
  if (data.organizationReference) {
    const cleaned = data.organizationReference.replace(/\D/g, "")
    if (cleaned.length === 17) {
      console.log("🏛️ [Extract Account] Found organization reference:", data.organizationReference, "→", cleaned, `(${cleaned.length} digits)`)
      return { value: cleaned, type: "organizationref" }
    }
  }

  // Phone number (10 digits starting with 0) - priority 4
  if (data.phoneNumber) {
    const cleaned = data.phoneNumber.replace(/\D/g, "")
    if (cleaned.length === 10 && cleaned.startsWith("0")) {
      console.log("☎️ [Extract Account] Found phone number:", data.phoneNumber, "→", cleaned, `(${cleaned.length} digits)`)
      return { value: cleaned, type: "mobile" }
    }
  }

  // Tax ID (13 digits) - priority 5
  if (data.taxId) {
    const cleaned = data.taxId.replace(/\D/g, "")
    if (cleaned.length === 13) {
      console.log("🔢 [Extract Account] Found tax ID:", data.taxId, "→", cleaned, `(${cleaned.length} digits)`)
      return { value: cleaned, type: "taxid" }
    }
  }

  // Account number - priority 6
  if (data.accountNumber) {
    const cleaned = data.accountNumber.replace(/\D/g, "")
    if (cleaned.length >= 10) {
      console.log("🏦 [Extract Account] Found account number:", data.accountNumber, "→", cleaned, `(${cleaned.length} digits)`)
      return { value: cleaned, type: "account" }
    }
  }

  // Fallback: if we found a name but no proper account, still try to use it for context
  if (data.name) {
    console.warn("⚠️ [Extract Account] No valid account data found, but merchant name exists:", data.name)
  }

  console.warn("⚠️ [Extract Account] No account data found in QR code")
  return { value: null, type: "unknown" }
}

/**
 * Extract receiver name from PromptPay data
 */
export function extractNameFromPromptPay(qrData: string): string | null {
  const data = parsePromptPay(qrData)
  return data.name || null
}
