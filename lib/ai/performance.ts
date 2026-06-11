export interface AIMessage {
  role: string
  content: string
}

// NVIDIA does not expose a preflight tokenizer here, so these are estimates.
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateMessageTokens(messages: AIMessage[]): number {
  return messages.reduce(
    (total, message) => total + estimateTokenCount(message.content) + 4,
    0
  )
}

export function elapsedMs(startedAt: number): number {
  return Math.round(performance.now() - startedAt)
}
