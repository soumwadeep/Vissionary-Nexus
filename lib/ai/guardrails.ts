// Input and output guardrails for AI
const ALLOWED_DOMAINS = ["Vissionary Nexus", "hackathon", "team match", "tasks", "recommendations"]

const BLOCKED_CONTENT = [
  "hate", "violence", "harassment", "malware", "phishing",
  "spam", "scam", "illegal", "adult", "explicit", "nsfw"
]

export interface GuardrailResult {
  passed: boolean
  reason?: string
}

// Input guardrails
export function checkInputGuardrails(input: string): GuardrailResult {
  // Check for blocked content
  const lowerInput = input.toLowerCase()
  for (const blocked of BLOCKED_CONTENT) {
    if (lowerInput.includes(blocked)) {
      return { passed: false, reason: "Content blocked by guardrails" }
    }
  }

  // Check for excessive length
  if (input.length > 10000) {
    return { passed: false, reason: "Input too long" }
  }

  return { passed: true }
}

// Output guardrails
export function checkOutputGuardrails(output: string): GuardrailResult {
  const lowerOutput = output.toLowerCase()
  for (const blocked of BLOCKED_CONTENT) {
    if (lowerOutput.includes(blocked)) {
      return { passed: false, reason: "Output blocked by guardrails" }
    }
  }

  return { passed: true }
}

// Domain restrictions
export function isDomainAllowed(domain: string): boolean {
  const lowerDomain = domain.toLowerCase()
  return ALLOWED_DOMAINS.some(allowed => lowerDomain.includes(allowed.toLowerCase()))
}
