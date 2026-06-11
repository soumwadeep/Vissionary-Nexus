/**
 * Credential/Model Compatibility Test Endpoint
 * 
 * Tests Nemotron (nvidia/nemotron-3-ultra-550b-a55b) with bounded timeout.
 * Distinguishes between:
 * - Success: Authorization works + inference succeeds
 * - Authorization failure: 401/403 response
 * - Inference timeout: AbortError within bounded timeout
 * - Other errors: 5xx, network issues, etc.
 */

export async function GET() {
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";
  const BOUNDED_TIMEOUT_MS = 15000; // 15 second bounded timeout

  const startTime = Date.now();

  // Check 1: API Key Presence
  if (!NVIDIA_API_KEY) {
    return Response.json(
      {
        success: false,
        error: "MISSING_API_KEY",
        message: "NVIDIA_API_KEY environment variable is not set",
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
      },
      { status: 400 }
    );
  }

  let response: Response | undefined;
  let abortError: Error | undefined;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), BOUNDED_TIMEOUT_MS);

  try {
    // Check 2: Direct API call to Nemotron
    response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: "user",
            content: "Say 'OK' and nothing else.",
          },
        ],
        max_tokens: 10,
        temperature: 0.5,
      }),
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    // Check 3: Authorization Failure
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        {
          success: false,
          error: "AUTHORIZATION_FAILED",
          message:
            response.status === 401
              ? "Unauthorized: API key is invalid or expired"
              : "Forbidden: API key does not have permission",
          httpStatus: response.status,
          apiErrorDetails: errorData,
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - startTime,
        },
        { status: 200 }
      );
    }

    // Check 4: Other HTTP Errors (5xx, etc.)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        {
          success: false,
          error: "API_ERROR",
          message: `NVIDIA API returned ${response.status}`,
          httpStatus: response.status,
          apiErrorDetails: errorData,
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - startTime,
        },
        { status: 200 }
      );
    }

    // Check 5: Success - Parse response
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const usage = data.usage;

    return Response.json(
      {
        success: true,
        error: null,
        message: "Credential and model compatibility verified",
        model: data.model || NVIDIA_MODEL,
        content: content?.substring(0, 100) || "(empty response)",
        usage: {
          prompt_tokens: usage?.prompt_tokens,
          completion_tokens: usage?.completion_tokens,
          total_tokens: usage?.total_tokens,
        },
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
      },
      { status: 200 }
    );
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Check 6: Inference Timeout (AbortError)
    if (error.name === "AbortError") {
      return Response.json(
        {
          success: false,
          error: "INFERENCE_TIMEOUT",
          message: `Nemotron inference did not respond within ${BOUNDED_TIMEOUT_MS}ms`,
          timeout: BOUNDED_TIMEOUT_MS,
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - startTime,
        },
        { status: 200 }
      );
    }

    // Check 7: Network/Other Errors
    return Response.json(
      {
        success: false,
        error: "NETWORK_ERROR",
        message: error.message || "Unknown error occurred",
        errorName: error.name,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
      },
      { status: 200 }
    );
  }
}
