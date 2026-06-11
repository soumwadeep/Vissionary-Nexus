// Shared NVIDIA AI client with retry and timeout handling
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b"

interface AIClientOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  timeout?: number
  maxRetries?: number
}

interface AIClientResponse {
  content: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Sleep helper
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function callNVIDIA(
  messages: Array<{ role: string; content: string }>,
  options: AIClientOptions = {}
): Promise<AIClientResponse> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2048,
    timeout = 300000,
    maxRetries = 3
  } = options

  console.log("🔍 NVIDIA AI Client Debug:")
  console.log("  - NVIDIA_BASE_URL:", NVIDIA_BASE_URL)
  console.log("  - NVIDIA_API_KEY exists:", !!NVIDIA_API_KEY)
  console.log("  - NVIDIA_API_KEY starts with:", NVIDIA_API_KEY ? NVIDIA_API_KEY.slice(0, 10) + "..." : "N/A")
  console.log("  - Model:", model)
  console.log("  - Timeout Value:", timeout, "ms")

  if (!NVIDIA_BASE_URL) {
    throw new Error("NVIDIA_BASE_URL is not defined")
  }

  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not set")
  }

  const fullUrl = `${NVIDIA_BASE_URL}/chat/completions`
  console.log("  - Full URL:", fullUrl)

  try {
    new URL(fullUrl)
    console.log("  - URL is valid")
  } catch (e) {
    console.error("  - ❌ Invalid URL:", e)
    throw new Error(`Invalid NVIDIA API URL: ${fullUrl}`)
  }

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const startTime = Date.now()
    let timeoutId: any
    try {
      console.log(`🚀 Attempt ${attempt} started at: ${new Date(startTime).toISOString()}`)
      const controller = new AbortController()
      timeoutId = setTimeout(() => {
        console.log(`⏱️ Timeout reached (${timeout}ms). Aborting request...`)
        controller.abort()
      }, timeout)

      console.log("📡 SENDING_FETCH_TO_NVIDIA", messages.length)
      const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        }),
        signal: controller.signal
      })

      const endTime = Date.now()
      console.log(`📥 Fetch returned after ${endTime - startTime}ms`)
      console.log(`  - Status: ${response.status}`)
      console.log(`  - Status Text: ${response.statusText}`)

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`NVIDIA API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      }
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId)
      const errorTime = Date.now()
      console.error(`❌ NVIDIA API Error (attempt ${attempt}) at ${new Date(errorTime).toISOString()}:`)
      console.error(`  - Duration since start: ${errorTime - startTime}ms`)
      console.error("  - Error message:", error.message)
      console.error("  - Error name:", error.name)
      lastError = error
      
      // Only retry on network errors or 5xx errors
      const isRetryable = 
        error.name === "AbortError" || 
        (error.message && error.message.includes("5")) ||
        (error.cause && error.cause.name === "TypeError")

      if (!isRetryable || attempt === maxRetries) {
        break
      }

      // Exponential backoff
      const backoffMs = Math.pow(2, attempt - 1) * 1000
      await sleep(backoffMs)
    }
  }

  throw lastError || new Error("Failed to call NVIDIA AI after retries")
}
