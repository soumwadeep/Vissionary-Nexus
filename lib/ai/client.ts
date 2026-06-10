// Shared NVIDIA AI client with retry and timeout handling
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = "meta/llama-3.3-70b-instruct"

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
    timeout = 30000,
    maxRetries = 3
  } = options

  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not set")
  }

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

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
