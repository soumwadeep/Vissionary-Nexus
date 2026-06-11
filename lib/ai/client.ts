import { AIMessage, elapsedMs } from "./performance"

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

export interface AIClientResponse {
  content: string
  model: string
  durationMs: number
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function callNVIDIA(
  messages: AIMessage[],
  options: AIClientOptions = {}
): Promise<AIClientResponse> {
  const requestStartedAt = performance.now()
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 512,
    timeout = 300000,
    maxRetries = 3
  } = options

  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not set")
  }

  const fullUrl = `${NVIDIA_BASE_URL}/chat/completions`
  new URL(fullUrl)

  console.log(
    `[NVIDIA Request] model=${model} messages=${messages.length} ` +
    `maxTokens=${maxTokens} timeoutMs=${timeout}`
  )

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptStartedAt = performance.now()
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    try {
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(fullUrl, {
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
      const durationMs = elapsedMs(requestStartedAt)
      console.log(
        `[NVIDIA Response] model=${data.model || model} durationMs=${durationMs} ` +
        `promptTokens=${data.usage?.prompt_tokens ?? "unknown"} ` +
        `completionTokens=${data.usage?.completion_tokens ?? "unknown"} ` +
        `totalTokens=${data.usage?.total_tokens ?? "unknown"}`
      )

      return {
        content: data.choices[0].message.content,
        model: data.model || model,
        usage: data.usage,
        durationMs
      }
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId)
      console.error(
        `[NVIDIA Error] attempt=${attempt} durationMs=${elapsedMs(attemptStartedAt)} ` +
        `name=${error.name} message=${error.message}`
      )
      lastError = error

      const isRetryable =
        error.name === "AbortError" ||
        (error.message && error.message.includes("5")) ||
        (error.cause && error.cause.name === "TypeError")

      if (!isRetryable || attempt === maxRetries) {
        break
      }

      await sleep(Math.pow(2, attempt - 1) * 1000)
    }
  }

  throw lastError || new Error("Failed to call NVIDIA AI after retries")
}
