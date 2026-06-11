/**
 * NVIDIA Credential Test Result Types and Utilities
 * 
 * Provides type-safe handling of credential test responses
 */

export type CredentialTestErrorCode =
  | "MISSING_API_KEY"
  | "AUTHORIZATION_FAILED"
  | "INFERENCE_TIMEOUT"
  | "API_ERROR"
  | "NETWORK_ERROR";

export interface CredentialTestResult {
  success: boolean;
  error: CredentialTestErrorCode | null;
  message: string;
  model?: string;
  content?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  httpStatus?: number;
  apiErrorDetails?: Record<string, any>;
  timeout?: number;
  errorName?: string;
  timestamp: string;
  durationMs: number;
}

/**
 * Interpret a credential test result into actionable information
 */
export function interpretCredentialTestResult(result: CredentialTestResult) {
  if (result.success) {
    return {
      status: "✅ READY",
      meaning: "NVIDIA credentials and Nemotron model are properly configured",
      action: "Proceed with AI features",
      details: {
        model: result.model,
        tokens: result.usage?.total_tokens,
        responseTimeMs: result.durationMs,
      },
    };
  }

  const interpretations: Record<CredentialTestErrorCode, any> = {
    MISSING_API_KEY: {
      status: "❌ NOT CONFIGURED",
      meaning: "NVIDIA_API_KEY environment variable is missing",
      action: "Set NVIDIA_API_KEY in .env.local",
      steps: [
        "1. Get API key from https://build.nvidia.com/",
        "2. Create .env.local with: NVIDIA_API_KEY=your-key",
        "3. Restart dev server",
      ],
    },
    AUTHORIZATION_FAILED: {
      status: "❌ UNAUTHORIZED",
      meaning: "API key is invalid, expired, or lacks permissions",
      action: "Regenerate or verify API key",
      steps: [
        "1. Verify key at https://build.nvidia.com/",
        "2. Check key hasn't expired",
        "3. Regenerate if needed",
        "4. Update .env.local",
        "5. Restart dev server",
      ],
      httpStatus: result.httpStatus,
    },
    INFERENCE_TIMEOUT: {
      status: "⏱️ TIMEOUT",
      meaning: "Nemotron did not respond within 15 seconds",
      action: "Check NVIDIA API status and retry",
      steps: [
        "1. Check NVIDIA status: https://status.nvidia.com/",
        "2. Verify model has quota remaining",
        "3. Retry the test",
        "4. Contact NVIDIA support if persists",
      ],
      timeout: result.timeout,
    },
    API_ERROR: {
      status: "❌ API ERROR",
      meaning: `NVIDIA API returned HTTP ${result.httpStatus}`,
      action: "Check NVIDIA service status",
      steps: [
        `1. Error: HTTP ${result.httpStatus}`,
        "2. Check NVIDIA status: https://status.nvidia.com/",
        "3. Verify API quota",
        "4. Retry after service recovers",
      ],
      httpStatus: result.httpStatus,
      details: result.apiErrorDetails,
    },
    NETWORK_ERROR: {
      status: "❌ NETWORK",
      meaning: `Network error: ${result.errorName || result.message}`,
      action: "Check network connectivity",
      steps: [
        "1. Verify internet connection",
        "2. Check firewall/proxy isn't blocking NVIDIA domains",
        "3. Verify https://integrate.api.nvidia.com is reachable",
        "4. Retry the test",
      ],
      error: result.message,
    },
  };

  return interpretations[result.error!] || {
    status: "❓ UNKNOWN",
    meaning: "Unknown error occurred",
    action: "Check logs for details",
    details: result,
  };
}

/**
 * Format result for console output
 */
export function formatCredentialTestResult(result: CredentialTestResult): string {
  const interpretation = interpretCredentialTestResult(result);

  let output = `\n${"=".repeat(60)}\n`;
  output += `${interpretation.status}\n`;
  output += `${interpretation.meaning}\n`;
  output += `${"=".repeat(60)}\n`;

  if (result.success) {
    output += `Model: ${result.model}\n`;
    output += `Response: "${result.content}"\n`;
    if (result.usage) {
      output += `Tokens: ${result.usage.total_tokens} total `;
      output += `(${result.usage.prompt_tokens} prompt, `;
      output += `${result.usage.completion_tokens} completion)\n`;
    }
  } else {
    output += `Error: ${result.error}\n`;
    output += `Message: ${result.message}\n`;
    if (result.httpStatus) {
      output += `HTTP Status: ${result.httpStatus}\n`;
    }
    if (interpretation.steps) {
      output += `\nNext Steps:\n`;
      interpretation.steps.forEach((step: string) => {
        output += `  ${step}\n`;
      });
    }
  }

  output += `\nDuration: ${result.durationMs}ms\n`;
  output += `Timestamp: ${result.timestamp}\n`;
  output += `${"=".repeat(60)}\n`;

  return output;
}

/**
 * Check if result indicates a configuration issue vs transient issue
 */
export function isConfigurationIssue(result: CredentialTestResult): boolean {
  return (
    !result.success &&
    (result.error === "MISSING_API_KEY" ||
      result.error === "AUTHORIZATION_FAILED")
  );
}

/**
 * Check if result indicates a transient issue (might resolve after retry)
 */
export function isTransientIssue(result: CredentialTestResult): boolean {
  return (
    !result.success &&
    (result.error === "INFERENCE_TIMEOUT" ||
      result.error === "API_ERROR" ||
      result.error === "NETWORK_ERROR")
  );
}
